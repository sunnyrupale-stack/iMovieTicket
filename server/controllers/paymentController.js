const Payment = require('../models/Payment');

// @desc    Get logged in user's payment history
// @route   GET /api/payments/my-payments
// @access  Private
const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate({
        path: 'bookingId',
        select: 'bookingReference numberOfTickets selectedSeats bookingStatus',
        populate: [
          { path: 'movieId', select: 'title posterUrl' },
          { path: 'cinemaId', select: 'name' },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment receipt
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('bookingId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    // Check ownership or admin
    if (payment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment receipt.',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPayments,
  getPaymentById,
};
