const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking reference is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount must be positive'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'PayPal', 'Cash at Counter'],
      default: 'Credit Card',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'success',
      index: true,
    },
    paymentGateway: {
      type: String,
      default: 'Simulated Gateway (Stripe/Razorpay compatible)',
    },
    refundTransactionId: {
      type: String,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
