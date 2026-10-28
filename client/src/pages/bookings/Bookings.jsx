import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import { IoTicketOutline, IoCheckmarkCircle } from "react-icons/io5";
import {
  BiTrash,
  BiQr,
  BiCalendar,
  BiTime,
  BiBuilding,
  BiPrinter,
  BiDownload,
  BiX,
  BiCheckCircle,
  BiXCircle,
} from "react-icons/bi";
import "./style.scss";

const defaultShowcaseBookings = [
  {
    bookingId: "BK-842911",
    status: "Confirmed",
    ticketsData: {
      movieName: "Og",
      theatreName: "Srinivasa",
      showDate: "Sep 25, 2025",
      showtime: "21:00",
      tier: "middle",
      seats: [351, 352],
      totalPrice: 260,
      poster: "/posters/og.jpg",
    },
    totalAmount: 260,
  },
  {
    bookingId: "BK-842912",
    status: "Confirmed",
    ticketsData: {
      movieName: "Og",
      theatreName: "Srinivasa",
      showDate: "Sep 25, 2025",
      showtime: "21:00",
      tier: "balcony",
      seats: [152],
      totalPrice: 1762,
      poster: "/posters/og.jpg",
    },
    totalAmount: 1762,
  },
  {
    bookingId: "BK-842913",
    status: "Confirmed",
    ticketsData: {
      movieName: "The pride of bharat",
      theatreName: "Gokul",
      showDate: "Jan 2, 2026",
      showtime: "21:30",
      tier: "balcony",
      seats: [158],
      totalPrice: 200,
      poster: "/posters/pride_of_bharat.jpg",
    },
    totalAmount: 200,
  },
];

const resolveMoviePoster = (data) => {
  if (data.poster && data.poster !== "/posters/og.jpg") return data.poster;
  const name = (data.movieName || "").toLowerCase();
  if (name.includes("ramayana")) return "/posters/ramayana.jpg";
  if (name.includes("pushpa")) return "/posters/pushpa_2.jpg";
  if (name.includes("kalki")) return "/posters/kalki_2898_ad.jpg";
  if (name.includes("deadpool")) return "/posters/deadpool_wolverine.jpg";
  if (name.includes("dune")) return "/posters/dune_2.jpg";
  if (name.includes("gladiator")) return "/posters/gladiator_2.jpg";
  if (name.includes("oppenheimer")) return "/posters/oppenheimer.jpg";
  if (name.includes("rrr")) return "/posters/rrr.jpg";
  if (name.includes("baahubali")) return "/posters/baahubali2.jpg";
  if (name.includes("raja")) return "/posters/rajasaab.jpg";
  if (name.includes("toxic")) return "/posters/toxic.jpg";
  if (name.includes("avatar")) return "/posters/avatar.jpg";
  if (name.includes("baaghi")) return "/posters/baaghi4.jpg";
  if (name.includes("bharat") || name.includes("pride")) return "/posters/pride_of_bharat.jpg";
  if (name.includes("og")) return "/posters/og.jpg";
  return data.poster || "/posters/ramayana.jpg";
};

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printModalData, setPrintModalData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchBookings = async () => {
    if (!user || !user.email) {
      setBookings(defaultShowcaseBookings);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`/api/bookings/userbookings/${encodeURIComponent(user.email)}`);
      if (res.data.success && Array.isArray(res.data.bookings)) {
        setBookings(res.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this ticket booking? Your seats will be released immediately and refund initiated."
      )
    )
      return;

    try {
      const res = await axios.delete(`/api/bookings/cancelbooking/${bookingId}`);
      if (res.data.success) {
        toast.info("Booking cancelled successfully and seats released");
        setBookings((prev) =>
          prev.map((b) =>
            b.bookingId === bookingId
              ? { ...b, status: "Cancelled", paymentStatus: "Cancelled" }
              : b
          )
        );
      }
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Remove this ticket permanently from your booking history?")) return;

    try {
      const res = await axios.delete(`/api/bookings/deletebooking/${bookingId}`);
      if (res.data.success) {
        toast.info("Ticket removed from your history");
        setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
      }
    } catch (err) {
      setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
    }
  };

  const handleOpenPrintModal = (ticketInfo) => {
    setPrintModalData(ticketInfo);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  const displayedBookings = bookings;

  return (
    <div className="bookings-page-container">
      <Header />

      <main className="bookings-main-content">
        <h1 className="brand-title">
          Your <span className="red">Bookings</span>
        </h1>

        {loading ? (
          <Loader />
        ) : displayedBookings.length === 0 ? (
          <div className="no-bookings-view">
            <IoTicketOutline size={60} color="#e50914" />
            <h2>No Bookings Found</h2>
            <p>
              {!user
                ? "Please sign in to view your booked tickets."
                : "You don't have any active or previous bookings right now."}
            </p>
            <button
              onClick={() => navigate(!user ? "/login" : "/home")}
              className="btn-browse-movies"
            >
              {!user ? "Sign In" : "Explore Movies"}
            </button>
          </div>
        ) : (
          <div className="bookings-grid">
            {displayedBookings.map((booking) => {
              const data = booking.ticketsData || {};
              // Format seats and section/tier for single or multi-tier bookings
              let seatsFormatted = Array.isArray(data.seats) ? data.seats.join(", ") : data.seats || "Standard";
              if (data.seatsByTier && typeof data.seatsByTier === "object") {
                const parts = [];
                if (data.seatsByTier.balcony?.length) parts.push(`Balcony: ${data.seatsByTier.balcony.join(", ")}`);
                if (data.seatsByTier.middle?.length) parts.push(`Middle: ${data.seatsByTier.middle.join(", ")}`);
                if (data.seatsByTier.lower?.length) parts.push(`Lower: ${data.seatsByTier.lower.join(", ")}`);
                if (parts.length > 0) seatsFormatted = parts.join(" • ");
              } else if (Array.isArray(data.seats)) {
                const bSeats = data.seats.filter((s) => String(s).toUpperCase().startsWith("B"));
                const mSeats = data.seats.filter(
                  (s) => String(s).toUpperCase().startsWith("M") || (!isNaN(s) && Number(s) >= 300)
                );
                const lSeats = data.seats.filter((s) => String(s).toUpperCase().startsWith("L"));
                const multiSectionsCount =
                  (bSeats.length > 0 ? 1 : 0) + (mSeats.length > 0 ? 1 : 0) + (lSeats.length > 0 ? 1 : 0);
                if (multiSectionsCount > 1) {
                  const parts = [];
                  if (bSeats.length) parts.push(`Balcony: ${bSeats.join(", ")}`);
                  if (mSeats.length) parts.push(`Middle: ${mSeats.join(", ")}`);
                  if (lSeats.length) parts.push(`Lower: ${lSeats.join(", ")}`);
                  if (parts.length > 0) seatsFormatted = parts.join(" • ");
                }
              }

              let tierName = "Standard";
              if (data.tier) {
                if (data.tier.includes("&")) {
                  tierName = data.tier;
                } else {
                  tierName = data.tier.charAt(0).toUpperCase() + data.tier.slice(1);
                }
              }

              const price = booking.totalAmount || data.totalPrice || 260;
              const displayBookingId =
                booking.bookingId || "BK-" + (booking._id ? booking._id.slice(-6).toUpperCase() : "842911");
              const posterUrl = resolveMoviePoster(data);
              const isCancelled = booking.status === "Cancelled" || booking.paymentStatus === "Cancelled";

              const qrDataString = `iMovies ${isCancelled ? "CANCELLED" : "Verified"} Ticket\nBooking ID: ${displayBookingId}\nMovie: ${data.movieName || "Movie"}\nTheatre: ${data.theatreName || "Srinivasa"}\nDate: ${data.showDate || "Nov 5, 2026"} @ ${data.showtime || "6:00 PM"}\nTier: ${tierName}\nSeats: ${seatsFormatted}\nStatus: ${isCancelled ? "CANCELLED" : "CONFIRMED"}\nAmount: Rs. ${price}`;

              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(
                qrDataString
              )}`;

              const ticketInfo = {
                displayBookingId,
                movieName: data.movieName || "Movie",
                theatreName: data.theatreName || "Srinivasa",
                showDate: data.showDate || "Nov 5, 2026",
                showtime: data.showtime || "6:00 PM",
                tierName,
                seats: seatsFormatted,
                price,
                posterUrl,
                qrUrl,
                isCancelled,
                userEmail: booking.userEmail || user?.email || "customer@example.com",
              };

              return (
                <div
                  key={booking.bookingId || booking._id}
                  className={`booking-card ${isCancelled ? "card-cancelled" : ""}`}
                >
                  {/* Left Column: Movie Banner & Scannable QR */}
                  <div className="ticket-poster-side">
                    <div className="poster-container">
                      <img
                        src={posterUrl}
                        alt={`${data.movieName || "Movie"} Banner`}
                        className="ticket-poster"
                      />
                      <span className="poster-banner-badge">Movie Banner</span>
                    </div>

                    <div className="card-qr-section" title="Point your phone camera to scan this digital ticket">
                      <img src={qrUrl} alt="Scannable QR Code" className="ticket-qr-img" />
                      <div className="qr-caption">
                        <BiQr size={13} />
                        <span>{isCancelled ? "Cancelled" : "Scannable QR"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Ticket Details & Actions */}
                  <div className="ticket-info-side">
                    <div className="ticket-options-row">
                      <div className="badge-group">
                        {isCancelled ? (
                          <span className="status-badge-cancelled" title="Ticket Status: Cancelled">
                            <BiXCircle size={13} /> CANCELLED
                          </span>
                        ) : (
                          <span className="status-badge-confirmed" title="Ticket Status: Confirmed">
                            <IoCheckmarkCircle size={13} /> CONFIRMED
                          </span>
                        )}
                        <span className="booking-id-badge" title="Booking Reference ID">
                          {displayBookingId}
                        </span>
                      </div>

                      {isCancelled ? (
                        <button
                          className="btn-trash-action-mini"
                          onClick={() => handleDeleteBooking(booking.bookingId)}
                          title="Remove ticket from history"
                        >
                          <BiTrash size={16} />
                        </button>
                      ) : (
                        <button
                          className="btn-cancel-ticket-text"
                          onClick={() => handleCancelBooking(booking.bookingId)}
                          title="Cancel Booking & Release Seats"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    <div className="ticket-details-list">
                      <div className="ticket-row booking-id-row">
                        <span className="label">Booking ID:</span>
                        <span className="value booking-id-text">{displayBookingId}</span>
                      </div>
                      <div className="ticket-row">
                        <span className="label">Movie:</span>
                        <span className="value movie-title-val">{data.movieName || "Movie"}</span>
                      </div>
                      <div className="ticket-row">
                        <span className="label">Theatre:</span>
                        <span className="value">{data.theatreName || "Srinivasa"}</span>
                      </div>
                      <div className="ticket-row">
                        <span className="label">Showdate:</span>
                        <span className="value">{data.showDate || "Nov 5, 2026"}</span>
                      </div>
                      <div className="ticket-row">
                        <span className="label">showtime:</span>
                        <span className="value">{data.showtime || "6:00 PM"}</span>
                      </div>
                      <div className="ticket-row">
                        <span className="label">Section / Tier:</span>
                        <span className="value tier-val">{tierName}</span>
                      </div>
                      <div className="ticket-row">
                        <span className="label">Seats:</span>
                        <span className="value seats-val">{seatsFormatted}</span>
                      </div>
                      <div className="ticket-row status-row">
                        <span className="label">Status:</span>
                        {isCancelled ? (
                          <span className="value status-text cancelled-text">
                            <BiXCircle size={14} color="#ef4444" /> CANCELLED (Seats Released & Refunded)
                          </span>
                        ) : (
                          <span className="value status-text">
                            <BiCheckCircle size={14} color="#22c55e" /> CONFIRMED
                          </span>
                        )}
                      </div>
                      <div className="ticket-row price-row">
                        <span className="label">Total Price:</span>
                        <span className="value">{price}₹</span>
                      </div>
                    </div>

                    {/* Download / Print Ticket Button */}
                    <div className="ticket-card-actions">
                      <button
                        className="btn-print-ticket"
                        onClick={() => handleOpenPrintModal(ticketInfo)}
                        title="Download or Print Ticket"
                      >
                        <BiPrinter size={15} /> Download / Print Ticket
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Printable Ticket Modal */}
        {printModalData && (
          <div className="ticket-modal-overlay" onClick={() => setPrintModalData(null)}>
            <div className="ticket-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-bar">
                <div className="modal-logo">
                  <span className="brand-red">i</span>Movies <span>Digital Boarding Pass</span>
                </div>
                <button
                  className="btn-modal-close"
                  onClick={() => setPrintModalData(null)}
                  title="Close"
                >
                  <BiX size={22} />
                </button>
              </div>

              <div className="modal-ticket-body printable-ticket-area">
                <div className="print-ticket-left">
                  <img
                    src={printModalData.posterUrl}
                    alt={printModalData.movieName}
                    className="print-poster"
                  />
                  <div className="print-status-tag">
                    <IoCheckmarkCircle size={15} /> STATUS: CONFIRMED
                  </div>
                </div>

                <div className="print-ticket-center">
                  <h2 className="print-movie-title">{printModalData.movieName}</h2>
                  <div className="print-cinema-hall">
                    <BiBuilding size={16} /> {printModalData.theatreName}
                  </div>

                  <div className="print-grid-details">
                    <div className="print-cell">
                      <span className="cell-label">BOOKING ID</span>
                      <span className="cell-value highlight">{printModalData.displayBookingId}</span>
                    </div>
                    <div className="print-cell">
                      <span className="cell-label">SHOW DATE</span>
                      <span className="cell-value">{printModalData.showDate}</span>
                    </div>
                    <div className="print-cell">
                      <span className="cell-label">SHOWTIME</span>
                      <span className="cell-value">{printModalData.showtime}</span>
                    </div>
                    <div className="print-cell">
                      <span className="cell-label">TIER</span>
                      <span className="cell-value">{printModalData.tierName}</span>
                    </div>
                    <div className="print-cell full-width">
                      <span className="cell-label">CONFIRMED SEATS</span>
                      <span className="cell-value seats-highlight">{printModalData.seats}</span>
                    </div>
                    <div className="print-cell">
                      <span className="cell-label">TOTAL PAID</span>
                      <span className="cell-value price-highlight">₹{printModalData.price}</span>
                    </div>
                    <div className="print-cell">
                      <span className="cell-label">CUSTOMER</span>
                      <span className="cell-value">{printModalData.userEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="print-ticket-right">
                  <div className="print-qr-container">
                    <img
                      src={printModalData.qrUrl}
                      alt="Scannable Ticket QR"
                      className="print-qr-code"
                    />
                    <span className="print-qr-text">Scan at entrance</span>
                  </div>
                  <div className="barcode-strip">
                    ||| | ||||| || |||| ||| ||||| | ||
                  </div>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button className="btn-cancel-modal" onClick={() => setPrintModalData(null)}>
                  Close
                </button>
                <button className="btn-action-print" onClick={handleTriggerPrint}>
                  <BiPrinter size={18} /> Print / Save as PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Bookings;
