const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema({
  theatreName: {
    type: String,
    required: true,
  },
  theatreId: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  balconySeatPrice: {
    type: Number,
    required: true,
  },
  balconySeatCount: {
    type: Number,
    default: 30,
  },
  middleSeatPrice: {
    type: Number,
    required: true,
  },
  middleSeatCount: {
    type: Number,
    default: 50,
  },
  lowerSeatPrice: {
    type: Number,
    required: true,
  },
  lowerSeatCount: {
    type: Number,
    default: 40,
  },
  balconySeats: {
    type: Object,
    default: {},
  },
  middleSeats: {
    type: Object,
    default: {},
  },
  lowerSeats: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("theatre", theatreSchema);
