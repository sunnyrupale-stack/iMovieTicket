const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const fetchUser = require("../middlewares/fetchUser");
const mockStore = require("../utils/mockStore");

const JWT_SECRET = process.env.JWT_SECRET || "imovies_jwt_secret_token_college_project_key";
const isDbConnected = () => mongoose.connection.readyState === 1;

// ROUTE 1: Register a new user: POST "/api/auth/register"
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: "Please fill in all required fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: "Password must be at least 8 characters long" });
    }

    if (!isDbConnected()) {
      let existingUser = mockStore.users.find((u) => u.email === email);
      if (existingUser) {
        return res.status(400).json({ success: false, error: "User with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: "usr-" + Date.now(),
        username,
        email,
        password: hashedPassword,
        role: "user",
      };
      mockStore.users.push(newUser);

      const payload = {
        user: { id: newUser._id, username: newUser.username, email: newUser.email, role: "user" },
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      return res.status(201).json({
        success: true,
        token,
        user: { id: newUser._id, username: newUser.username, email: newUser.email, role: "user" },
      });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "User with this email already exists" });
    }

    let existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, error: "Username already taken, please choose another" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    const payload = {
      user: { id: user._id, username: user.username, email: user.email, role: "user" },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email, role: "user" },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 2: Authenticate a user: POST "/api/auth/login"
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Please provide email and password" });
    }

    if (!isDbConnected()) {
      let user = mockStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      // In offline mode, if sample user or any user tries login, facilitate smooth development
      if (!user) {
        // Auto-provision demo user account
        user = {
          _id: "usr-" + Date.now(),
          username: email.split("@")[0],
          email,
          role: "user",
        };
        mockStore.users.push(user);
      }

      const payload = {
        user: { id: user._id, username: user.username, email: user.email, role: user.role || "user" },
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role || "user",
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid credentials. User does not exist." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials. Incorrect password." });
    }

    const payload = {
      user: { id: user._id, username: user.username, email: user.email, role: user.role || "user" },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 3: Get logged-in user details: GET "/api/auth/getuser"
router.get("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!isDbConnected()) {
      const user = mockStore.users.find((u) => u._id === userId || u.email === req.user.email);
      return res.json({
        success: true,
        user: user || { id: userId, username: req.user.username || "Tanishq", email: req.user.email, role: "user" },
      });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.json({
        success: true,
        user: { id: userId, username: req.user.username || "Tanishq", email: req.user.email, role: "user" },
      });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({
      success: true,
      user: { id: req.user.id, username: req.user.username || "Tanishq", email: req.user.email, role: "user" },
    });
  }
});

// ROUTE 4: Update user details: PUT "/api/auth/updateuser"
router.put("/updateuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, phoneNumber } = req.body;

    if (!isDbConnected()) {
      const u = mockStore.users.find((user) => user._id === userId || user.email === req.user.email);
      if (u) {
        if (username) u.username = username;
        if (phoneNumber) u.phoneNumber = phoneNumber;
      }
      return res.json({
        success: true,
        user: u || { id: userId, username, phoneNumber, email: req.user.email, role: "user" },
      });
    }

    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (phoneNumber !== undefined) updatedFields.phoneNumber = phoneNumber;

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedFields }, { new: true }).select("-password");
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
