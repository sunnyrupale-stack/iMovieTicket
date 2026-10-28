const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Show = require("../models/showModel");
const Movie = require("../models/movieModel");
const Theatre = require("../models/theatreModel");
const mockStore = require("../utils/mockStore");

const isDbConnected = () => mongoose.connection.readyState === 1;

// ROUTE 1: Get all shows: GET "/api/shows" or "/api/shows/getallshows"
router.get("/", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, shows: mockStore.shows });
    }
    const shows = await Show.find().sort({ showDate: 1, showtime: 1 });
    res.json({ success: true, shows });
  } catch (error) {
    res.json({ success: true, shows: mockStore.shows });
  }
});

router.get("/getallshows", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, shows: mockStore.shows });
    }
    const shows = await Show.find().sort({ showDate: 1, showtime: 1 });
    res.json({ success: true, shows });
  } catch (error) {
    res.json({ success: true, shows: mockStore.shows });
  }
});

// ROUTE 2: Get shows by movieName (EXACT ENDPOINT used in Frontend Screenshot 43/44)
router.get("/getmovieshows/:movieName", async (req, res) => {
  try {
    const movieName = decodeURIComponent(req.params.movieName);

    if (!isDbConnected()) {
      const showData = mockStore.shows.filter((s) =>
        s.movieId.toLowerCase().includes(movieName.toLowerCase())
      );
      const movie = mockStore.movies.find((m) =>
        m.movieName.toLowerCase().includes(movieName.toLowerCase())
      );
      return res.json({
        success: true,
        data: { showData },
        showData,
        movie,
      });
    }

    const movie = await Movie.findOne({
      movieName: { $regex: new RegExp("^" + movieName + "$", "i") },
    });

    let query = {};
    if (movie) {
      query = {
        $or: [
          { movieId: movie._id.toString() },
          { movieId: movie.movieName },
        ],
      };
    } else {
      query = { movieId: { $regex: movieName, $options: "i" } };
    }

    const showData = await Show.find(query).sort({ showDate: 1, showtime: 1 });

    res.json({
      success: true,
      data: { showData },
      showData,
      movie,
    });
  } catch (error) {
    const showData = mockStore.shows.filter((s) =>
      s.movieId.toLowerCase().includes(decodeURIComponent(req.params.movieName).toLowerCase())
    );
    res.json({ success: true, data: { showData }, showData });
  }
});

// ROUTE 3: Get single show details: GET "/api/shows/getshow/:showId"
router.get("/getshow/:showId", async (req, res) => {
  try {
    if (!isDbConnected()) {
      const show = mockStore.shows.find(
        (s) => s.showId === req.params.showId || s._id === req.params.showId
      );
      if (!show) {
        return res.status(404).json({ success: false, error: "Show not found" });
      }
      const theatre = mockStore.theatres.find((t) => t.theatreName === show.theatreName);
      const movie = mockStore.movies.find((m) => m.movieName === show.movieId);
      return res.json({ success: true, show, theatre, movie });
    }

    const show = await Show.findOne({
      $or: [
        { showId: req.params.showId },
        { _id: req.params.showId.match(/^[0-9a-fA-F]{24}$/) ? req.params.showId : null },
      ],
    });

    if (!show) {
      return res.status(404).json({ success: false, error: "Show not found" });
    }

    const theatre = await Theatre.findOne({ theatreName: show.theatreName });
    const movie = await Movie.findOne({
      $or: [
        { _id: show.movieId.match(/^[0-9a-fA-F]{24}$/) ? show.movieId : null },
        { movieName: show.movieId },
      ],
    });

    res.json({ success: true, show, theatre, movie });
  } catch (error) {
    const show = mockStore.shows.find(
      (s) => s.showId === req.params.showId || s._id === req.params.showId
    );
    if (show) return res.json({ success: true, show });
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 4: Add new show: POST "/api/shows/addshow"
router.post("/addshow", async (req, res) => {
  try {
    const { adminEmail, movieId, theatreName, showDate, showtime } = req.body;

    if (!movieId || !theatreName || !showDate || !showtime) {
      return res.status(400).json({ success: false, error: "Please provide all show details" });
    }

    const showId = "SH-" + Date.now().toString().slice(-6);

    const showData = {
      _id: "sh-" + Date.now(),
      adminEmail: adminEmail || "admin@imovies.com",
      showId,
      movieId,
      theatreName,
      showDate,
      showtime,
      tickets: {
        balcony: { bookedSeats: [], price: 250 },
        middle: { bookedSeats: [], price: 180 },
        lower: { bookedSeats: [], price: 120 },
      },
      createdAt: new Date(),
    };

    if (!isDbConnected()) {
      mockStore.shows.unshift(showData);
      mockStore.save && mockStore.save();
      return res.status(201).json({ success: true, show: showData });
    }

    const show = await Show.create(showData);
    res.status(201).json({ success: true, show });
  } catch (error) {
    console.error("Add Show Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 5: Cancel show (sets status to Cancelled & cancels attached customer bookings): PUT "/api/shows/cancelshow/:id"
router.put("/cancelshow/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Helper to cancel attached bookings
    const cancelAttachedBookings = (showIdentifier) => {
      mockStore.bookings.forEach((b) => {
        if (b.showId === showIdentifier || b.showId === id) {
          b.status = "Cancelled";
          b.paymentStatus = "Cancelled";
          b.cancelledReason = "Show cancelled by cinema";
        }
      });
    };

    if (!isDbConnected()) {
      const show = mockStore.shows.find((s) => s._id === id || s.showId === id);
      if (show) {
        show.status = "Cancelled";
        cancelAttachedBookings(show.showId);
        return res.json({ success: true, message: "Show marked as cancelled", show });
      }
      return res.status(404).json({ success: false, error: "Show not found" });
    }

    const show = await Show.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { showId: id }],
    });

    if (show) {
      show.status = "Cancelled";
      await show.save();
      await Booking.updateMany(
        { showId: show.showId },
        { status: "Cancelled", paymentStatus: "Cancelled", cancelledReason: "Show cancelled by cinema" }
      );
      cancelAttachedBookings(show.showId);
      return res.json({ success: true, message: "Show marked as cancelled", show });
    }

    const fallbackShow = mockStore.shows.find((s) => s._id === id || s.showId === id);
    if (fallbackShow) {
      fallbackShow.status = "Cancelled";
      cancelAttachedBookings(fallbackShow.showId);
      return res.json({ success: true, message: "Show marked as cancelled", show: fallbackShow });
    }

    res.status(404).json({ success: false, error: "Show not found" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to cancel show" });
  }
});

// ROUTE 6: Delete show: DELETE "/api/shows/deleteshow/:id"
router.delete("/deleteshow/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const target = mockStore.shows.find((s) => s._id === id || s.showId === id);
    const targetShowId = target ? target.showId : id;

    // Also cancel or flag any bookings that belonged to this show
    mockStore.bookings.forEach((b) => {
      if (b.showId === targetShowId || b.showId === id) {
        b.status = "Cancelled";
        b.paymentStatus = "Cancelled";
        b.cancelledReason = "Show cancelled by cinema";
      }
    });

    mockStore.shows = mockStore.shows.filter((s) => s._id !== id && s.showId !== id);
    mockStore.save && mockStore.save();

    if (isDbConnected()) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        await Show.findByIdAndDelete(id);
      } else {
        await Show.findOneAndDelete({ showId: id });
      }
      await Booking.updateMany(
        { showId: targetShowId },
        { status: "Cancelled", paymentStatus: "Cancelled", cancelledReason: "Show cancelled by cinema" }
      );
    }

    res.json({ success: true, message: "Show deleted successfully and attached bookings updated" });
  } catch (error) {
    mockStore.shows = mockStore.shows.filter((s) => s._id !== req.params.id && s.showId !== req.params.id);
    mockStore.save && mockStore.save();
    res.json({ success: true, message: "Show deleted successfully" });
  }
});

module.exports = router;
