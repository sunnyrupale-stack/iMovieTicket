const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true,
  },
  screenName: {
    type: String,
    required: true,
  },
  soundSystem: {
    type: String,
    default: 'Dolby Atmos 7.1',
  },
  screenType: {
    type: String,
    default: 'IMAX 4K Laser',
  },
  rows: {
    type: [String],
    default: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
  },
  seatsPerRow: {
    type: Number,
    default: 12,
  },
  totalSeats: {
    type: Number,
    default: 120,
  },
});

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cinema name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location area is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Cinema address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    screens: [screenSchema],
    facilities: {
      type: [String],
      default: ['IMAX Laser', 'Dolby Atmos', '4K Projection', 'Gourmet Food', 'Valet Parking'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cinema', cinemaSchema);
