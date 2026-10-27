const Show = require('../models/Show');

// @desc    Get shows with optional filters
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res, next) => {
  try {
    const { movieId, cinemaId, date } = req.query;
    const query = { status: 'active' };

    if (movieId) query.movieId = movieId;
    if (cinemaId) query.cinemaId = cinemaId;
    if (date) query.showDate = date;

    const shows = await Show.find(query)
      .populate('movieId', 'title posterUrl duration rating genre language')
      .populate('cinemaId', 'name location city address facilities')
      .sort({ showDate: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get show details and current seat availability
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId', 'title posterUrl duration rating genre language description')
      .populate('cinemaId', 'name location city address facilities screens');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found.',
      });
    }

    // Seat summary stats
    const totalSeats = show.seats.length;
    const bookedSeatsCount = show.seats.filter((s) => s.status === 'booked').length;
    const availableSeatsCount = totalSeats - bookedSeatsCount;

    res.status(200).json({
      success: true,
      data: show,
      stats: {
        totalSeats,
        bookedSeatsCount,
        availableSeatsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shows for a particular movie
// @route   GET /api/movies/:movieId/shows
// @access  Public
const getShowsByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    const query = { movieId, status: 'active' };
    if (date) {
      query.showDate = date;
    }

    const shows = await Show.find(query)
      .populate('cinemaId', 'name location city address facilities')
      .sort({ showDate: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShows,
  getShowById,
  getShowsByMovie,
};
