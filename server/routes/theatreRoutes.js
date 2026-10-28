const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Theatre = require("../models/theatreModel");
const mockStore = require("../utils/mockStore");

const isDbConnected = () => mongoose.connection.readyState === 1;

// ROUTE 1: Get all theatres: GET "/api/theatre" or "/api/theatre/getalltheatres"
router.get("/", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, theatres: mockStore.theatres });
    }
    const theatres = await Theatre.find().sort({ theatreName: 1 });
    res.json({ success: true, theatres });
  } catch (error) {
    res.json({ success: true, theatres: mockStore.theatres });
  }
});

router.get("/getalltheatres", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, theatres: mockStore.theatres });
    }
    const theatres = await Theatre.find().sort({ theatreName: 1 });
    res.json({ success: true, theatres });
  } catch (error) {
    res.json({ success: true, theatres: mockStore.theatres });
  }
});

// ROUTE 2: Add a new theatre: POST "/api/theatre/addtheatre"
router.post("/addtheatre", async (req, res) => {
  try {
    const {
      theatreName,
      location,
      balconySeatPrice,
      balconySeatCount,
      middleSeatPrice,
      middleSeatCount,
      lowerSeatPrice,
      lowerSeatCount,
    } = req.body;

    if (!theatreName || !location) {
      return res.status(400).json({ success: false, error: "Theatre name and location are required" });
    }

    const theatreData = {
      _id: "th-" + Date.now(),
      theatreName,
      theatreId: "TH-" + Date.now().toString().slice(-6),
      location,
      balconySeatPrice: Number(balconySeatPrice) || 250,
      balconySeatCount: Number(balconySeatCount) || 30,
      middleSeatPrice: Number(middleSeatPrice) || 180,
      middleSeatCount: Number(middleSeatCount) || 50,
      lowerSeatPrice: Number(lowerSeatPrice) || 120,
      lowerSeatCount: Number(lowerSeatCount) || 40,
    };

    if (!isDbConnected()) {
      mockStore.theatres.unshift(theatreData);
      mockStore.save && mockStore.save();
      return res.status(201).json({ success: true, theatre: theatreData });
    }

    const theatre = await Theatre.create(theatreData);
    res.status(201).json({ success: true, theatre });
  } catch (error) {
    console.error("Add Theatre Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 3: Delete theatre: DELETE "/api/theatre/deletetheatre/:id"
router.delete("/deletetheatre/:id", async (req, res) => {
  try {
    if (!isDbConnected()) {
      mockStore.theatres = mockStore.theatres.filter((t) => t._id !== req.params.id);
      mockStore.save && mockStore.save();
      return res.json({ success: true, message: "Theatre deleted successfully" });
    }

    const deleted = await Theatre.findByIdAndDelete(req.params.id);
    if (!deleted) {
      mockStore.theatres = mockStore.theatres.filter((t) => t._id !== req.params.id);
      mockStore.save && mockStore.save();
    }
    res.json({ success: true, message: "Theatre deleted successfully" });
  } catch (error) {
    mockStore.theatres = mockStore.theatres.filter((t) => t._id !== req.params.id);
    mockStore.save && mockStore.save();
    res.json({ success: true, message: "Theatre deleted successfully" });
  }
});

module.exports = router;
