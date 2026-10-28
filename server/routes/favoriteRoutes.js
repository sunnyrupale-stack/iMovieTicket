const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Favorite = require("../models/favoriteModel");
const mockStore = require("../utils/mockStore");

const isDbConnected = () => mongoose.connection.readyState === 1;

// ROUTE 1: Add to favorites: POST "/api/favorite/addfavorite"
router.post("/addfavorite", async (req, res) => {
  try {
    const { userEmail, movieId, movieData } = req.body;

    if (!userEmail || !movieId) {
      return res.status(400).json({ success: false, error: "userEmail and movieId are required" });
    }

    if (!isDbConnected()) {
      const exists = mockStore.favorites.find((f) => f.userEmail === userEmail && f.movieId === movieId);
      if (exists) return res.json({ success: true, message: "Already in favorites", favorite: exists });

      const favData = { _id: "fav-" + Date.now(), userEmail, movieId, movieData, createdAt: new Date() };
      mockStore.favorites.unshift(favData);
      return res.status(201).json({ success: true, favorite: favData });
    }

    const existing = await Favorite.findOne({ userEmail, movieId });
    if (existing) {
      return res.json({ success: true, message: "Already in favorites", favorite: existing });
    }

    const favorite = await Favorite.create({ userEmail, movieId, movieData: movieData || {} });
    res.status(201).json({ success: true, favorite });
  } catch (error) {
    console.error("Add Favorite Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 2: Remove from favorites: POST "/api/favorite/removefavorite"
router.post("/removefavorite", async (req, res) => {
  try {
    const { userEmail, movieId } = req.body;

    if (!isDbConnected()) {
      mockStore.favorites = mockStore.favorites.filter((f) => !(f.userEmail === userEmail && f.movieId === movieId));
      return res.json({ success: true, message: "Removed from favorites" });
    }

    await Favorite.findOneAndDelete({ userEmail, movieId });
    res.json({ success: true, message: "Removed from favorites" });
  } catch (error) {
    mockStore.favorites = mockStore.favorites.filter((f) => !(f.userEmail === req.body.userEmail && f.movieId === req.body.movieId));
    res.json({ success: true, message: "Removed from favorites" });
  }
});

// ROUTE 3: Get favorites by user: GET "/api/favorite/getfavorites/:userEmail"
router.get("/getfavorites/:userEmail", async (req, res) => {
  try {
    const userEmail = decodeURIComponent(req.params.userEmail);

    if (!isDbConnected()) {
      const userFavs = mockStore.favorites.filter((f) => f.userEmail.toLowerCase() === userEmail.toLowerCase());
      return res.json({ success: true, favorites: userFavs });
    }

    const favorites = await Favorite.find({ userEmail }).sort({ createdAt: -1 });
    res.json({ success: true, favorites });
  } catch (error) {
    const userFavs = mockStore.favorites.filter((f) => f.userEmail.toLowerCase() === req.params.userEmail.toLowerCase());
    res.json({ success: true, favorites: userFavs });
  }
});

module.exports = router;
