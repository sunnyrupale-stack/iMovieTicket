const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const showRoutes = require("./routes/showRoutes");
const theatreRoutes = require("./routes/theatreRoutes");
const movieRoutes = require("./routes/movieRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

require("dotenv").config({ path: "./.env" });

// Prefer IPv4 results to avoid ::1 (IPv6) connections when providers expect IPv4
const dns = require("dns");
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const { verifyTransport } = require("./utils/mailer");
const cron = require("node-cron");
const { sendReminderEmails } = require("./utils/reminderService");
const { cleanupOldBookings } = require("./utils/cleanupService");
const connectToMongo = require("./utils/db");
const seedDatabase = require("./utils/seeder");

const app = express();
const cors = require("cors");
app.use(cors());

const path = require("path");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Mount API routes exactly matching curriculum specification
app.use("/api/auth", authRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/theatre", theatreRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth/admin", adminRoutes);
app.use("/api/review", reviewRoutes);

// Root health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "iMovies API Server is running smoothly", status: "online" });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ success: false, error: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Connect to Database
  await connectToMongo();

  // Seed default data if database is connected
  try {
    await seedDatabase();
  } catch (err) {
    console.log("Seeding notice:", err.message);
  }

  // Verify mailer configuration
  verifyTransport();

  // Schedule background jobs
  try {
    cron.schedule("0 * * * *", () => {
      sendReminderEmails();
    });
    cron.schedule("0 0 * * *", () => {
      cleanupOldBookings();
    });
  } catch (err) {
    console.log("Cron notice:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
  });
};

startServer();

module.exports = app;
