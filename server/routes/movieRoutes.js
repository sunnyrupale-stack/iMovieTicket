const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Movie = require("../models/movieModel");
const mockStore = require("../utils/mockStore");

const isDbConnected = () => mongoose.connection.readyState === 1;

// ROUTE 1: Get all movies with optional search/genre filter: GET "/api/movie" or "/api/movie/getallmovies"
router.get("/", async (req, res) => {
  try {
    const { search, genre } = req.query;

    if (!isDbConnected()) {
      let filtered = [...mockStore.movies];
      if (search) {
        filtered = filtered.filter((m) =>
          m.movieName.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (genre && genre !== "All") {
        filtered = filtered.filter((m) =>
          m.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
        );
      }
      return res.json({ success: true, movies: filtered });
    }

    let query = {};
    if (search) {
      query.movieName = { $regex: search, $options: "i" };
    }
    if (genre && genre !== "All") {
      query.genres = { $in: [new RegExp(genre, "i")] };
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1 });
    res.json({ success: true, movies });
  } catch (error) {
    console.error("Get Movies Error:", error.message);
    res.json({ success: true, movies: mockStore.movies });
  }
});

router.get("/getallmovies", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, movies: mockStore.movies });
    }
    const movies = await Movie.find().sort({ releaseDate: -1 });
    res.json({ success: true, movies });
  } catch (error) {
    res.json({ success: true, movies: mockStore.movies });
  }
});

// ROUTE 2: Get single movie details: GET "/api/movie/getmovie/:id"
router.get("/getmovie/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const movie = mockStore.movies.find((m) => m._id === req.params.id || m.movieName === req.params.id);
      if (!movie) {
        return res.status(404).json({ success: false, error: "Movie not found" });
      }
      return res.json({ success: true, movie });
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, error: "Movie not found" });
    }
    res.json({ success: true, movie });
  } catch (error) {
    const fallback = mockStore.movies.find((m) => m._id === req.params.id || m.movieName === req.params.id);
    if (fallback) return res.json({ success: true, movie: fallback });
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 3: Add a new movie: POST "/api/movie/addmovie"
router.post("/addmovie", async (req, res) => {
  try {
    const { movieName, description, genres, releaseDate, runtime, certification, trailerUrl, media, rating, cast } = req.body;

    if (!movieName || !description) {
      return res.status(400).json({ success: false, error: "Movie name and description are required" });
    }

    let parsedGenres = genres;
    if (typeof genres === "string") {
      parsedGenres = genres.split(",").map((g) => g.trim()).filter((g) => g.length > 0);
    }
    if (!Array.isArray(parsedGenres) || parsedGenres.length === 0) {
      parsedGenres = ["Action", "Drama"];
    }

    let parsedCast = cast;
    if (typeof cast === "string") {
      parsedCast = cast.split(",").map((c) => c.trim()).filter((c) => c.length > 0);
    }

    const movieData = {
      _id: "mov-" + Date.now(),
      movieName,
      description,
      genres: parsedGenres,
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
      runtime: runtime || "150 min",
      certification: certification || "UA",
      trailerUrl: trailerUrl || "",
      media: media || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
      rating: rating ? Number(rating) : 8.5,
      cast: parsedCast || [],
      createdAt: new Date(),
    };

    if (!isDbConnected()) {
      mockStore.movies.unshift(movieData);
      mockStore.save && mockStore.save();
      return res.status(201).json({ success: true, movie: movieData });
    }

    const movie = await Movie.create(movieData);
    res.status(201).json({ success: true, movie });
  } catch (error) {
    console.error("Add Movie Error:", error.message);
    res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
  }
});

// ROUTE 4: Delete movie: DELETE "/api/movie/deletemovie/:id"
router.delete("/deletemovie/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      mockStore.movies = mockStore.movies.filter((m) => m._id !== req.params.id);
      mockStore.save && mockStore.save();
      return res.json({ success: true, message: "Movie deleted successfully" });
    }

    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ success: false, error: "Movie not found" });
    }
    res.json({ success: true, message: "Movie deleted successfully", movie: deletedMovie });
  } catch (error) {
    mockStore.movies = mockStore.movies.filter((m) => m._id !== req.params.id);
    mockStore.save && mockStore.save();
    res.json({ success: true, message: "Movie deleted successfully" });
  }
});

module.exports = router;
