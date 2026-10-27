const express = require('express');
const router = express.Router();
const {
  getMovies,
  getNowShowing,
  getUpcoming,
  getMovieById,
} = require('../controllers/movieController');
const { getShowsByMovie } = require('../controllers/showController');

router.get('/', getMovies);
router.get('/now-showing', getNowShowing);
router.get('/upcoming', getUpcoming);
router.get('/:id', getMovieById);
router.get('/:movieId/shows', getShowsByMovie);

module.exports = router;
