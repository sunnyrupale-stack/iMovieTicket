const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
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
    enum: ['Standard', 'Premium', 'VIP'],
    default: 'Standard',
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'booked'],
    default: 'available',
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  bookedAt: {
    type: Date,
    default: null,
  },
});

const showSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
      index: true,
    },
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: [true, 'Cinema reference is required'],
      index: true,
    },
    screenName: {
      type: String,
      required: [true, 'Screen name is required'],
    },
    showDate: {
      type: String, // YYYY-MM-DD for easy querying
      required: [true, 'Show date is required (YYYY-MM-DD)'],
      index: true,
    },
    startTime: {
      type: String, // e.g. "10:00 AM", "02:30 PM", "06:30 PM", "09:45 PM"
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      default: '',
    },
    ticketPrice: {
      standard: { type: Number, default: 200 },
      premium: { type: Number, default: 320 },
      vip: { type: Number, default: 500 },
    },
    seats: [seatSchema],
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying shows by movie, cinema, and date
showSchema.index({ movieId: 1, cinemaId: 1, showDate: 1 });

module.exports = mongoose.model('Show', showSchema);
