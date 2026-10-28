const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const mockStore = require("../utils/mockStore");
const { sendBookingConfirmationEmail } = require("../utils/mailer");

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to group seats by tier (balcony, middle, lower)
const getSeatsGroupedByTier = (ticketsData) => {
  if (ticketsData.seatsByTier && typeof ticketsData.seatsByTier === "object") {
    return ticketsData.seatsByTier;
  }

  const result = { balcony: [], middle: [], lower: [] };
  const allSeats = Array.isArray(ticketsData.seats) ? ticketsData.seats : [ticketsData.seats];
  const defaultTier = (ticketsData.tier || "middle").toLowerCase();

  allSeats.forEach((seat) => {
    if (!seat && seat !== 0) return;
    const str = String(seat).trim();
    if (str.startsWith("B") || str.startsWith("b")) {
      result.balcony.push(seat);
    } else if (str.startsWith("L") || str.startsWith("l")) {
      result.lower.push(seat);
    } else if (str.startsWith("M") || str.startsWith("m") || (!isNaN(str) && Number(str) >= 300)) {
      result.middle.push(seat);
    } else if (result[defaultTier]) {
      result[defaultTier].push(seat);
    } else {
      result.middle.push(seat);
    }
  });

  return result;
};

// ROUTE 1: Create a new booking: POST "/api/bookings/createbooking"
router.post("/createbooking", async (req, res) => {
  try {
    const { userEmail, showId, ticketsData, totalAmount, paymentMethod } = req.body;

    if (!userEmail || !showId || !ticketsData) {
      return res.status(400).json({ success: false, error: "Missing required booking details" });
    }

    const bookingId = "BK-" + Math.floor(100000 + Math.random() * 900000);

    let poster = ticketsData.poster;
    if (!poster && ticketsData.movieName) {
      const foundMovie = mockStore.movies.find(
        (m) => m.movieName.toLowerCase() === ticketsData.movieName.toLowerCase()
      );
      if (foundMovie && foundMovie.media) {
        poster = foundMovie.media;
      }
    }

    const groupedSeats = getSeatsGroupedByTier(ticketsData);

    const bookingData = {
      _id: "bk-" + Date.now(),
      bookingId,
      userEmail,
      showId,
      ticketsData: {
        ...ticketsData,
        poster: poster || "/posters/ramayana.jpg",
        paymentMethod: paymentMethod || "Online / Card",
        seatsByTier: groupedSeats,
      },
      totalAmount: totalAmount || ticketsData.totalPrice || 260,
      paymentStatus: "Completed",
      status: "Confirmed",
      createdAt: new Date(),
    };

    if (!isDbConnected()) {
      mockStore.bookings.unshift(bookingData);

      // Lock seats across each selected tier in mock show
      const show = mockStore.shows.find((s) => s.showId === showId || s._id === showId);
      if (show && show.tickets) {
        for (const [tierName, seatList] of Object.entries(groupedSeats)) {
          const normTier = tierName.toLowerCase();
          if (seatList.length > 0) {
            if (!show.tickets[normTier]) {
              show.tickets[normTier] = { bookedSeats: [], price: 180 };
            }
            show.tickets[normTier].bookedSeats = Array.from(
              new Set([...(show.tickets[normTier].bookedSeats || []), ...seatList])
            );
          }
        }
      }

      mockStore.save && mockStore.save();

      sendBookingConfirmationEmail(userEmail, {
        bookingId,
        theatreName: ticketsData.theatreName,
        showDate: ticketsData.showDate,
        showtime: ticketsData.showtime,
        seats: ticketsData.seats,
        totalAmount: totalAmount || 260,
      });

      return res.status(201).json({ success: true, booking: bookingData });
    }

    const show = await Show.findOne({
      $or: [{ showId: showId }, { _id: showId.match(/^[0-9a-fA-F]{24}$/) ? showId : null }],
    });

    if (show && show.tickets) {
      for (const [tierName, seatList] of Object.entries(groupedSeats)) {
        const normTier = tierName.toLowerCase();
        if (seatList.length > 0) {
          if (!show.tickets[normTier]) {
            show.tickets[normTier] = { bookedSeats: [], price: 180 };
          }
          show.tickets[normTier].bookedSeats = Array.from(
            new Set([...(show.tickets[normTier].bookedSeats || []), ...seatList])
          );
        }
      }

      show.markModified("tickets");
      await show.save();
    }

    const booking = await Booking.create(bookingData);

    sendBookingConfirmationEmail(userEmail, {
      bookingId,
      theatreName: ticketsData.theatreName || (show && show.theatreName),
      showDate: ticketsData.showDate || (show && show.showDate),
      showtime: ticketsData.showtime || (show && show.showtime),
      seats: ticketsData.seats,
      totalAmount: totalAmount || ticketsData.totalPrice || 260,
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("Create Booking Error:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Helper to release booked seats when a booking is cancelled
const releaseSeatsForBooking = async (booking) => {
  if (!booking || !booking.ticketsData) return;
  const showId = booking.showId;
  const groupedSeats = getSeatsGroupedByTier(booking.ticketsData);

  // In mockStore
  const mockShow = mockStore.shows.find((s) => s.showId === showId || s._id === showId);
  if (mockShow && mockShow.tickets) {
    for (const [tierName, seatList] of Object.entries(groupedSeats)) {
      const normTier = tierName.toLowerCase();
      if (seatList.length > 0 && mockShow.tickets[normTier]) {
        const toRemove = seatList.map((s) => String(s));
        mockShow.tickets[normTier].bookedSeats = (mockShow.tickets[normTier].bookedSeats || []).filter(
          (seat) => !toRemove.includes(String(seat))
        );
      }
    }
  }

  // In MongoDB if connected
  if (isDbConnected()) {
    try {
      const dbShow = await Show.findOne({
        $or: [{ showId: showId }, { _id: showId.match(/^[0-9a-fA-F]{24}$/) ? showId : null }],
      });
      if (dbShow && dbShow.tickets) {
        for (const [tierName, seatList] of Object.entries(groupedSeats)) {
          const normTier = tierName.toLowerCase();
          if (seatList.length > 0 && dbShow.tickets[normTier]) {
            const toRemove = seatList.map((s) => String(s));
            dbShow.tickets[normTier].bookedSeats = (dbShow.tickets[normTier].bookedSeats || []).filter(
              (seat) => !toRemove.includes(String(seat))
            );
          }
        }
        dbShow.markModified("tickets");
        await dbShow.save();
      }
    } catch (err) {
      console.error("Error releasing seats in DB:", err.message);
    }
  }
};

// ROUTE 2: Get bookings by user email: GET "/api/bookings/userbookings/:userEmail"
router.get("/userbookings/:userEmail", async (req, res) => {
  try {
    const userEmail = decodeURIComponent(req.params.userEmail);

    if (!isDbConnected()) {
      const userBookings = mockStore.bookings.filter(
        (b) => b.userEmail.toLowerCase() === userEmail.toLowerCase()
      );
      return res.json({ success: true, bookings: userBookings });
    }

    const bookings = await Booking.find({ userEmail }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    const userBookings = mockStore.bookings.filter(
      (b) => b.userEmail.toLowerCase() === req.params.userEmail.toLowerCase()
    );
    res.json({ success: true, bookings: userBookings });
  }
});

// ROUTE 3: Get all bookings for admin: GET "/api/bookings/allbookings"
router.get("/allbookings", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, bookings: mockStore.bookings });
    }
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: true, bookings: mockStore.bookings });
  }
});

// ROUTE 4: Cancel a booking (updates status to Cancelled & releases seats): DELETE or PUT "/api/bookings/cancelbooking/:bookingId"
const cancelBookingHandler = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    if (!isDbConnected()) {
      const mockBooking = mockStore.bookings.find((b) => b.bookingId === bookingId);
      if (mockBooking) {
        await releaseSeatsForBooking(mockBooking);
        mockBooking.status = "Cancelled";
        mockBooking.paymentStatus = "Cancelled";
        mockBooking.cancelledAt = new Date();
        mockStore.save && mockStore.save();
        return res.json({
          success: true,
          message: "Booking cancelled successfully and seats released",
          booking: mockBooking,
        });
      }
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      const mockBooking = mockStore.bookings.find((b) => b.bookingId === bookingId);
      if (mockBooking) {
        await releaseSeatsForBooking(mockBooking);
        mockBooking.status = "Cancelled";
        mockBooking.paymentStatus = "Cancelled";
        mockBooking.cancelledAt = new Date();
        mockStore.save && mockStore.save();
        return res.json({
          success: true,
          message: "Booking cancelled successfully and seats released",
          booking: mockBooking,
        });
      }
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    await releaseSeatsForBooking(booking);
    booking.status = "Cancelled";
    booking.paymentStatus = "Cancelled";
    booking.cancelledAt = new Date();
    await booking.save();
    mockStore.save && mockStore.save();

    res.json({
      success: true,
      message: "Booking cancelled successfully and seats released",
      booking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to cancel booking" });
  }
};

router.delete("/cancelbooking/:bookingId", cancelBookingHandler);
router.put("/cancelbooking/:bookingId", cancelBookingHandler);
router.post("/cancelbooking/:bookingId", cancelBookingHandler);

// ROUTE 5: Permanently delete a booking: DELETE "/api/bookings/deletebooking/:bookingId"
router.delete("/deletebooking/:bookingId", async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const target = mockStore.bookings.find((b) => b.bookingId === bookingId);
    if (target && target.status !== "Cancelled") {
      await releaseSeatsForBooking(target);
    }
    mockStore.bookings = mockStore.bookings.filter((b) => b.bookingId !== bookingId);
    mockStore.save && mockStore.save();

    if (isDbConnected()) {
      const dbBooking = await Booking.findOne({ bookingId });
      if (dbBooking && dbBooking.status !== "Cancelled") {
        await releaseSeatsForBooking(dbBooking);
      }
      await Booking.findOneAndDelete({ bookingId });
    }

    res.json({ success: true, message: "Booking permanently deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete booking" });
  }
});

module.exports = router;
