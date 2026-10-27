const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);

// Movies
router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

// Cinemas
router.post('/cinemas', createCinema);

// Shows
router.post('/shows', createShow);
router.delete('/shows/:id', deleteShow);

// Bookings
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

// Users
router.get('/users', getAllUsers);

module.exports = router;
