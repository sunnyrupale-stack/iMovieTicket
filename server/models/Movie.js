const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true,
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster URL is required'],
    },
    bannerUrl: {
      type: String,
      required: [true, 'Banner URL is required'],
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
      index: true,
    },
    language: {
      type: [String],
      required: [true, 'At least one language is required'],
      index: true,
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be greater than 0'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
      index: true,
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      trim: true,
      default: '',
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.5,
    },
    status: {
      type: String,
      enum: ['now_showing', 'upcoming'],
      default: 'now_showing',
      index: true,
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    ageRating: {
      type: String,
      default: 'UA',
    },
  },
  {
    timestamps: true,
  }
);

// Text search index with custom language_override to prevent collision with language field
movieSchema.index(
  { title: 'text', description: 'text', director: 'text' },
  { language_override: 'text_search_language' }
);

module.exports = mongoose.model('Movie', movieSchema);
