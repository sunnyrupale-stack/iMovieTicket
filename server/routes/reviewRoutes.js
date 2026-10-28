const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
const Movie = require("../models/movieModel");
const mockStore = require("../utils/mockStore");

const isDbConnected = () => mongoose.connection.readyState === 1;

// ROUTE 1: Add a review: POST "/api/review/addreview"
router.post("/addreview", async (req, res) => {
  try {
    const { movieId, userEmail, username, rating, comment } = req.body;

    if (!movieId || !userEmail || !comment) {
      return res.status(400).json({ success: false, error: "Please fill in all review fields" });
    }

    const reviewData = {
      _id: "rev-" + Date.now(),
      movieId,
      userEmail,
      username: username || userEmail.split("@")[0],
      rating: Number(rating) || 8,
      comment,
      createdAt: new Date(),
    };

    if (!isDbConnected()) {
      mockStore.reviews.unshift(reviewData);
      return res.status(201).json({ success: true, review: reviewData });
    }

    const review = await Review.create(reviewData);

    // Update average movie rating
    const allReviews = await Review.find({ movieId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Movie.findByIdAndUpdate(movieId, { rating: Number(avgRating.toFixed(1)) });

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Add Review Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 2: Get reviews for a movie: GET "/api/review/getreviews/:movieId"
router.get("/getreviews/:movieId", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const movieReviews = mockStore.reviews.filter((r) => r.movieId === req.params.movieId);
      return res.json({ success: true, reviews: movieReviews });
    }

    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    const movieReviews = mockStore.reviews.filter((r) => r.movieId === req.params.movieId);
    res.json({ success: true, reviews: movieReviews });
  }
});

module.exports = router;
