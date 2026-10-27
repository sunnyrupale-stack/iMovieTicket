const Show = require('../models/Show');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const generateBookingReference = require('../utils/generateBookingReference');
const { sendBookingConfirmation, sendCancellationNotice } = require('./notificationService');

/**
 * Creates an atomic booking with concurrency protection
 */
const createBookingAtomic = async ({
  userId,
  user,
  showId,
  seatIds,
  paymentMethod = 'Credit Card',
  io = null,
}) => {
  // 1. Fetch Show and verify it exists and is active
  const show = await Show.findById(showId);
  if (!show) {
    const error = new Error('The requested show was not found.');
    error.statusCode = 404;
    throw error;
  }

  if (show.status !== 'active') {
    const error = new Error('This movie show is no longer active.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Validate all requested seat IDs exist in the show
  const requestedSeats = show.seats.filter((s) => seatIds.includes(s.seatId));
  if (requestedSeats.length !== seatIds.length) {
    const error = new Error('One or more selected seat IDs do not exist in this cinema screen.');
    error.statusCode = 400;
    throw error;
  }

  // Check if any seat is already booked in current in-memory view
  const alreadyBooked = requestedSeats.filter((s) => s.status !== 'available');
  if (alreadyBooked.length > 0) {
    const bookedNames = alreadyBooked.map((s) => s.seatId).join(', ');
    const error = new Error(`Seat(s) ${bookedNames} are already booked. Please choose other seats.`);
    error.statusCode = 409;
    throw error;
  }

  // 3. ATOMIC CONCURRENCY CHECK & UPDATE:
  // Update show document ONLY IF none of the selected seats are booked or reserved
  const updatedShow = await Show.findOneAndUpdate(
    {
      _id: showId,
      status: 'active',
      seats: {
        $not: {
          $elemMatch: {
            seatId: { $in: seatIds },
            status: { $in: ['booked', 'reserved'] },
          },
        },
      },
    },
    {
      $set: {
        'seats.$[elem].status': 'booked',
        'seats.$[elem].bookedBy': userId,
        'seats.$[elem].bookedAt': new Date(),
      },
    },
    {
      arrayFilters: [{ 'elem.seatId': { $in: seatIds } }],
      new: true,
    }
  );

  if (!updatedShow) {
    const error = new Error(
      'Concurrency conflict: One or more selected seats were just taken by another user. Please re-select.'
    );
    error.statusCode = 409;
    throw error;
  }

  // 4. Calculate prices
  const bookedSeatsDetails = requestedSeats.map((s) => ({
    seatId: s.seatId,
    row: s.row,
    seatNumber: s.seatNumber,
    category: s.category,
    price: s.price,
  }));

  const ticketSubtotal = bookedSeatsDetails.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = Math.round(seatIds.length * 2.5 * 100) / 100;
  const taxes = Math.round(ticketSubtotal * 0.08 * 100) / 100;
  const totalAmount = Math.round((ticketSubtotal + convenienceFee + taxes) * 100) / 100;

  // 5. Create Booking Record
  const bookingReference = generateBookingReference();

  const booking = await Booking.create({
    bookingReference,
    userId,
    showId: show._id,
    movieId: show.movieId,
    cinemaId: show.cinemaId,
    selectedSeats: bookedSeatsDetails,
    numberOfTickets: seatIds.length,
    ticketSubtotal,
    convenienceFee,
    taxes,
    totalAmount,
    bookingStatus: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod,
  });

  // 6. Broadcast real-time seat update via Socket.IO
  if (io) {
    io.to(`show_${showId}`).emit('seatsUpdated', {
      showId: showId.toString(),
      bookedSeatIds: seatIds,
      status: 'booked',
    });
  }

  // 7. Fire and forget notification
  const [movie, cinema] = await Promise.all([
    Movie.findById(show.movieId),
    Cinema.findById(show.cinemaId),
  ]);

  if (movie && cinema && user) {
    sendBookingConfirmation(booking, user, movie, cinema, show).catch((err) =>
      console.error('Notification error:', err.message)
    );
  }

  return {
    booking,
    movie,
    cinema,
    show: updatedShow,
  };
};

/**
 * Cancels a booking and atomically releases seats
 */
const cancelBookingService = async ({ bookingId, userId, isAdmin = false, io = null }) => {
  const query = { _id: bookingId };
  if (!isAdmin) {
    query.userId = userId;
  }

  const booking = await Booking.findOne(query)
    .populate('movieId', 'title posterUrl')
    .populate('cinemaId', 'name location');

  if (!booking) {
    const error = new Error('Booking not found or you are not authorized to cancel it.');
    error.statusCode = 404;
    throw error;
  }

  if (booking.bookingStatus === 'cancelled') {
    const error = new Error('This booking is already cancelled.');
    error.statusCode = 400;
    throw error;
  }

  const seatIdsToRelease = booking.selectedSeats.map((s) => s.seatId);

  // Atomically update show seats back to available
  await Show.findOneAndUpdate(
    { _id: booking.showId },
    {
      $set: {
        'seats.$[elem].status': 'available',
        'seats.$[elem].bookedBy': null,
        'seats.$[elem].bookedAt': null,
      },
    },
    {
      arrayFilters: [{ 'elem.seatId': { $in: seatIdsToRelease } }],
    }
  );

  booking.bookingStatus = 'cancelled';
  booking.paymentStatus = 'refunded';
  booking.cancellationReason = 'User requested cancellation';
  booking.cancelledAt = new Date();
  await booking.save();

  // Broadcast real-time seat release
  if (io) {
    io.to(`show_${booking.showId}`).emit('seatsUpdated', {
      showId: booking.showId.toString(),
      bookedSeatIds: seatIdsToRelease,
      status: 'available',
    });
  }

  return booking;
};

module.exports = {
  createBookingAtomic,
  cancelBookingService,
};
