const Movie = require('../models/Movie');

// @desc    Get all movies with search, filter, sort, pagination
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const { search, genre, language, status, sort, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (genre && genre !== 'All') {
      query.genre = { $in: [genre] };
    }

    if (language && language !== 'All') {
      query.language = { $in: [language] };
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    let sortOption = { releaseDate: -1 };
    if (sort === 'title_asc') sortOption = { title: 1 };
    if (sort === 'title_desc') sortOption = { title: -1 };
    if (sort === 'rating_desc') sortOption = { rating: -1 };
    if (sort === 'date_asc') sortOption = { releaseDate: 1 };
    if (sort === 'date_desc') sortOption = { releaseDate: -1 };

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Now Showing movies
// @route   GET /api/movies/now-showing
// @access  Public
const getNowShowing = async (req, res, next) => {
  try {
    const movies = await Movie.find({ status: 'now_showing' }).sort({ rating: -1, releaseDate: -1 });
    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Upcoming movies
// @route   GET /api/movies/upcoming
// @access  Public
const getUpcoming = async (req, res, next) => {
  try {
    const movies = await Movie.find({ status: 'upcoming' }).sort({ releaseDate: 1 });
    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found with the requested ID.',
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getNowShowing,
  getUpcoming,
  getMovieById,
};
