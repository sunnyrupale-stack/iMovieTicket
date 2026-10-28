const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: "Movie Enthusiast",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
