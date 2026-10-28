const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  movieData: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
