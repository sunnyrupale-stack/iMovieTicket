const mongoose = require('mongoose');

const bookingSeatSchema = new mongoose.Schema({
  seatId: {
    type: String,
    required: true,
  },
  row: {
    type: String,
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: 'Standard',
  },
  price: {
    type: Number,
    required: true,
  },
});

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
      index: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
    selectedSeats: [bookingSeatSchema],
    numberOfTickets: {
      type: Number,
      required: true,
      min: 1,
    },
    ticketSubtotal: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      default: 30,
    },
    taxes: {
      type: Number,
      default: 25,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'refunded'],
      default: 'paid',
    },
    paymentMethod: {
      type: String,
      default: 'Credit/Debit Card',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to help query user bookings sorted by date
bookingSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
