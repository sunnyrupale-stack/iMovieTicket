const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { validateBooking } = require('../middleware/validationMiddleware');

router.post('/', protect, validateBooking, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
