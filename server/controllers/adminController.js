const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Helper to generate seat layout for a new show
const generateSeatsLayout = (screen, ticketPrice = { standard: 200, premium: 320, vip: 500 }) => {
  const seats = [];
  const rows = screen.rows || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const seatsPerRow = screen.seatsPerRow || 12;

  rows.forEach((row, rowIndex) => {
    let category = 'Standard';
    let price = ticketPrice.standard || 200;

    // Categorize by row depth
    if (rowIndex >= rows.length - 2) {
      category = 'VIP';
      price = ticketPrice.vip || 500;
    } else if (rowIndex >= rows.length - 5) {
      category = 'Premium';
      price = ticketPrice.premium || 320;
    }

    for (let num = 1; num <= seatsPerRow; num++) {
      seats.push({
        seatId: `${row}${num}`,
        row,
        seatNumber: num,
        category,
        price,
        status: 'available',
      });
    }
  });

  return seats;
};

// @desc    Get Admin Dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalMovies,
      totalCinemas,
      totalShows,
      totalBookings,
      totalUsers,
      recentBookings,
      revenueAggregation,
    ] = await Promise.all([
      Movie.countDocuments(),
      Cinema.countDocuments(),
      Show.countDocuments({ status: 'active' }),
      Booking.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Booking.find()
        .populate('movieId', 'title')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(6),
      Booking.aggregate([
        { $match: { bookingStatus: 'confirmed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalBookings,
        totalMovies,
        totalCinemas,
        totalShows,
        totalUsers,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Movie CRUD
const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, message: 'Movie created successfully!', data: movie });
  } catch (error) {
    next(error);
  }
};

const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });
    res.status(200).json({ success: true, message: 'Movie updated successfully!', data: movie });
  } catch (error) {
    next(error);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found.' });
    res.status(200).json({ success: true, message: 'Movie deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// Cinema CRUD
const createCinema = async (req, res, next) => {
  try {
    const cinema = await Cinema.create(req.body);
    res.status(201).json({ success: true, message: 'Cinema added successfully!', data: cinema });
  } catch (error) {
    next(error);
  }
};

// Show Scheduling
const createShow = async (req, res, next) => {
  try {
    const { movieId, cinemaId, screenName, showDate, startTime, endTime, ticketPrice } = req.body;

    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) return res.status(404).json({ success: false, message: 'Cinema not found.' });

    const screen = cinema.screens.find((s) => s.screenName === screenName) || {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
      seatsPerRow: 12,
    };

    const seats = generateSeatsLayout(screen, ticketPrice);

    const show = await Show.create({
      movieId,
      cinemaId,
      screenName,
      showDate,
      startTime,
      endTime: endTime || '',
      ticketPrice: ticketPrice || { standard: 200, premium: 320, vip: 500 },
      seats,
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Show scheduled successfully with seating layout!',
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!show) return res.status(404).json({ success: false, message: 'Show not found.' });
    res.status(200).json({ success: true, message: 'Show cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

// Bookings management
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('movieId', 'title posterUrl')
      .populate('cinemaId', 'name location')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.status(200).json({ success: true, message: 'Booking status updated.', data: booking });
  } catch (error) {
    next(error);
  }
};

// Users management
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  createMovie,
  updateMovie,
  deleteMovie,
  createCinema,
  createShow,
  deleteShow,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
};
