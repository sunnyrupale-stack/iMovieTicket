const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  movieName: {
    type: String,
    required: [true, "Movie name is required"],
    trim: true,
    minLength: [2, "Movie name must be at least 2 characters long"],
    maxLength: [200, "Movie cannot exceed 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minLength: [10, "Description must be at least 10 characters long"],
  },
  genres: {
    type: [String],
    required: [true, "At least one genre is required"],
    validate: {
      validator: function (genres) {
        return Array.isArray(genres) && genres.length > 0;
      },
      message: "At least one genre is required",
    },
  },
  releaseDate: {
    type: Date,
    required: [true, "Release date is required"],
    validate: {
      validator: function (date) {
        return date instanceof Date && !isNaN(date);
      },
      message: "Invalid release date",
    },
  },
  runtime: {
    type: String,
    default: "150 min",
  },
  certification: {
    type: String,
    default: "UA",
  },
  trailerUrl: {
    type: String,
    default: "",
  },
  media: {
    type: String,
    default: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=60",
  },
  rating: {
    type: Number,
    default: 8.5,
  },
  cast: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Movie", movieSchema);
