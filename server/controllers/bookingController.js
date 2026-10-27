const Booking = require('../models/Booking');
const { createBookingAtomic, cancelBookingService } = require('../services/bookingService');

// @desc    Create a new movie booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { showId, seatIds, paymentMethod } = req.body;
    const io = req.app.get('io');

    const result = await createBookingAtomic({
      userId: req.user._id,
      user: req.user,
      showId,
      seatIds,
      paymentMethod,
      io,
    });

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully! Enjoy your movie.',
      data: result.booking,
      movie: result.movie,
      cinema: result.cinema,
      show: {
        _id: result.show._id,
        screenName: result.show.screenName,
        showDate: result.show.showDate,
        startTime: result.show.startTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('movieId', 'title posterUrl duration rating genre')
      .populate('cinemaId', 'name location city address')
      .populate('showId', 'showDate startTime screenName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movieId')
      .populate('cinemaId')
      .populate('showId')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Verify ownership or admin access
    const isOwner = booking.userId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking.',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const io = req.app.get('io');
    const isAdmin = req.user.role === 'admin';

    const booking = await cancelBookingService({
      bookingId: req.params.id,
      userId: req.user._id,
      isAdmin,
      io,
    });

    res.status(200).json({
      success: true,
      message: 'Booking has been cancelled and seats have been released.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
