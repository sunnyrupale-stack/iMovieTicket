const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  // show created by admin
  adminEmail: {
    type: String,
    required: true,
  },
  showId: {
    type: String,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  theatreName: {
    type: String,
    required: true,
  },
  showDate: {
    type: String,
    required: true,
  },
  showtime: {
    type: String,
    required: true,
  },
  tickets: {
    type: Object,
    default: {
      balcony: { bookedSeats: [], price: 250 },
      middle: { bookedSeats: [], price: 180 },
      lower: { bookedSeats: [], price: 120 },
    },
  },
  status: {
    type: String,
    default: "Active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("show", showSchema);
