const mongoose = require("mongoose");

const bookingModel = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  showId: {
    type: String,
    required: true,
  },
  ticketsData: {
    type: Object,
    required: true,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    default: "Completed",
  },
  status: {
    type: String,
    default: "Confirmed",
  },
  cancelledAt: {
    type: Date,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("booking", bookingModel);
