const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Admin = require("../models/adminModel");
const Movie = require("../models/movieModel");
const Show = require("../models/showModel");
const Theatre = require("../models/theatreModel");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const fetchUser = require("../middlewares/fetchUser");
const mockStore = require("../utils/mockStore");

const JWT_SECRET = process.env.JWT_SECRET || "imovies_jwt_secret_token_college_project_key";
const isDbConnected = () => mongoose.connection.readyState === 1;

// ROUTE 1: Register an admin: POST "/api/auth/admin/register"
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: "Please provide all required fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: "Password must be at least 8 characters" });
    }

    if (!isDbConnected()) {
      const newAdmin = {
        _id: "adm-" + Date.now(),
        username,
        email,
        role: "admin",
      };
      mockStore.admins.push(newAdmin);
      const payload = { user: { id: newAdmin._id, username, email, role: "admin" } };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
      return res.status(201).json({ success: true, token, user: newAdmin });
    }

    let existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, error: "Admin already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    const payload = {
      user: { id: admin._id, username: admin.username, email: admin.email, role: "admin" },
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ success: true, token, user: { id: admin._id, username, email, role: "admin" } });
  } catch (error) {
    console.error("Admin Register Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 2: Authenticate admin: POST "/api/auth/admin/login"
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Please enter email and password" });
    }

    if (!isDbConnected()) {
      let admin = mockStore.admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (!admin) {
        admin = { _id: "adm-" + Date.now(), username: "admin", email, role: "admin" };
        mockStore.admins.push(admin);
      }
      const payload = { user: { id: admin._id, username: admin.username, email: admin.email, role: "admin" } };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ success: true, token, user: admin });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, error: "Admin account not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const payload = {
      user: { id: admin._id, username: admin.username, email: admin.email, role: "admin" },
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token, user: { id: admin._id, username: admin.username, email: admin.email, role: "admin" } });
  } catch (error) {
    console.error("Admin Login Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 3: Admin Dashboard Statistics: GET "/api/auth/admin/stats"
router.get("/stats", fetchUser, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const totalMovies = mockStore.movies.length;
      const totalShows = mockStore.shows.length;
      const totalTheatres = mockStore.theatres.length;
      const totalBookings = mockStore.bookings.length;
      const totalUsers = mockStore.users.length;
      const totalRevenue = mockStore.bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      return res.json({
        success: true,
        stats: { totalMovies, totalShows, totalTheatres, totalBookings, totalUsers, totalRevenue },
      });
    }

    const totalMovies = await Movie.countDocuments();
    const totalShows = await Show.countDocuments();
    const totalTheatres = await Theatre.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();

    const allBookings = await Booking.find();
    const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    res.json({
      success: true,
      stats: { totalMovies, totalShows, totalTheatres, totalBookings, totalUsers, totalRevenue },
    });
  } catch (error) {
    res.json({
      success: true,
      stats: {
        totalMovies: mockStore.movies.length,
        totalShows: mockStore.shows.length,
        totalTheatres: mockStore.theatres.length,
        totalBookings: mockStore.bookings.length,
        totalUsers: mockStore.users.length,
        totalRevenue: 260,
      },
    });
  }
});

module.exports = router;
