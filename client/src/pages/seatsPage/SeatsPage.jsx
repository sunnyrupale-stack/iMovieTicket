import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import { BiArrowBack, BiCheckShield, BiCreditCard, BiQrScan } from "react-icons/bi";
import "./style.scss";

const SeatsPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTier, setSelectedTier] = useState("middle");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [processingPayment, setProcessingPayment] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/shows/getshow/${showId}`);
        if (res.data.success) {
          setShow(res.data.show);
          if (res.data.movie) setMovie(res.data.movie);
        } else {
          toast.error("Show not found");
        }
      } catch (err) {
        console.error("Error fetching show details:", err);
        toast.error("Failed to load show details");
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId]);

  if (loading) {
    return (
      <div className="seats-page-container">
        <Header />
        <Loader />
        <Footer />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="seats-page-container">
        <Header />
        <div className="error-box">
          <p>Show information could not be loaded.</p>
          <button onClick={() => navigate(-1)} className="btn-imovies-primary">
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const tickets = show.tickets || {};
  const balconyPrice = tickets.balcony?.price || 250;
  const middlePrice = tickets.middle?.price || 180;
  const lowerPrice = tickets.lower?.price || 120;

  const bookedBalcony = tickets.balcony?.bookedSeats || [];
  const bookedMiddle = tickets.middle?.bookedSeats || [351, 352];
  const bookedLower = tickets.lower?.bookedSeats || [];

  // Generate seat grid for tiers
  const generateSeats = (prefix, count, bookedList, tierName) => {
    const seats = [];
    for (let i = 1; i <= count; i++) {
      const seatNumber = prefix === "M" ? 300 + i : `${prefix}${i}`;
      const isBooked = bookedList.includes(seatNumber) || bookedList.includes(i);
      const isSelected = selectedSeats.some((s) => s.id === seatNumber);

      seats.push({
        id: seatNumber,
        number: seatNumber,
        isBooked,
        isSelected,
        tier: tierName,
        price: tierName === "balcony" ? balconyPrice : tierName === "middle" ? middlePrice : lowerPrice,
      });
    }
    return seats;
  };

  const balconySeats = generateSeats("B", 20, bookedBalcony, "balcony");
  const middleSeats = generateSeats("M", 55, bookedMiddle, "middle");
  const lowerSeats = generateSeats("L", 20, bookedLower, "lower");

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    if (selectedSeats.some((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 8) {
        toast.warning("Maximum 8 seats can be selected per booking");
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convFee = selectedSeats.length > 0 ? Math.round(subtotal * 0.05) : 0;
  const totalAmount = subtotal + convFee;

  const seatsByTier = {
    balcony: selectedSeats.filter((s) => s.tier === "balcony").map((s) => s.id),
    middle: selectedSeats.filter((s) => s.tier === "middle").map((s) => s.id),
    lower: selectedSeats.filter((s) => s.tier === "lower").map((s) => s.id),
  };

  const distinctTiers = Array.from(new Set(selectedSeats.map((s) => s.tier)));
  const tierDisplayName =
    distinctTiers.length === 1
      ? distinctTiers[0].charAt(0).toUpperCase() + distinctTiers[0].slice(1)
      : distinctTiers
          .map((t) => (t === "balcony" ? "Balcony" : t === "middle" ? "Middle" : "Lower"))
          .join(" & ");

  const handleProceedToPayment = () => {
    if (!user || !user.email) {
      toast.info("Please login to complete your ticket booking");
      navigate("/login", { state: { returnUrl: `/seats/${showId}` } });
      return;
    }
    if (selectedSeats.length === 0) {
      toast.warning("Please select at least one seat to proceed");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmBooking = async () => {
    setProcessingPayment(true);
    try {
      const ticketsData = {
        seats: selectedSeats.map((s) => s.id),
        tier: tierDisplayName,
        seatsByTier,
        theatreName: show.theatreName,
        movieName: show.movieId,
        showDate: show.showDate,
        showtime: show.showtime,
        seatCount: selectedSeats.length,
        totalPrice: totalAmount,
        poster: movie?.media || undefined,
      };

      const res = await api.post("/api/bookings/createbooking", {
        userEmail: user.email,
        showId: show.showId || show._id,
        ticketsData,
        totalAmount,
        paymentMethod,
      });

      if (res.data.success) {
        toast.success("Payment Successful! Booking confirmed.");
        setShowPaymentModal(false);
        navigate("/bookings");
      } else {
        toast.error(res.data.error || "Booking failed");
      }
    } catch (err) {
      console.error("Booking Error:", err);
      toast.error("Could not process booking. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="seats-page-container">
      <Header />

      <main className="seats-main-content">
        <div className="show-info-header">
          <button onClick={() => navigate(-1)} className="back-link">
            <BiArrowBack size={18} /> Back
          </button>
          <div className="show-meta-text">
            <h2>{show.movieId}</h2>
            <p>
              {show.theatreName} • {show.showDate} at {show.showtime}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="seats-legend">
          <div className="legend-item">
            <span className="seat-box available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="seat-box selected"></span>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <span className="seat-box booked"></span>
            <span>Booked</span>
          </div>
        </div>

        {/* Screen Cinema Curvature */}
        <div className="screen-container">
          <div className="cinema-screen"></div>
          <span className="screen-label">ALL EYES THIS WAY (SCREEN)</span>
        </div>

        {/* Tiers and Seats Layout */}
        <div className="seating-layout">
          {/* Balcony Section */}
          <div className="seat-tier-section">
            <div className="tier-header">
              <span className="tier-name">Balcony</span>
              <span className="tier-price">₹{balconyPrice}</span>
            </div>
            <div className="seats-grid balcony-grid">
              {balconySeats.map((seat) => (
                <button
                  key={seat.id}
                  className={`seat-btn ${seat.isBooked ? "booked" : seat.isSelected ? "selected" : "available"}`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.isBooked}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>

          {/* Middle Section */}
          <div className="seat-tier-section">
            <div className="tier-header">
              <span className="tier-name">Middle Class</span>
              <span className="tier-price">₹{middlePrice}</span>
            </div>
            <div className="seats-grid middle-grid">
              {middleSeats.map((seat) => (
                <button
                  key={seat.id}
                  className={`seat-btn ${seat.isBooked ? "booked" : seat.isSelected ? "selected" : "available"}`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.isBooked}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>

          {/* Lower Section */}
          <div className="seat-tier-section">
            <div className="tier-header">
              <span className="tier-name">Lower Class</span>
              <span className="tier-price">₹{lowerPrice}</span>
            </div>
            <div className="seats-grid lower-grid">
              {lowerSeats.map((seat) => (
                <button
                  key={seat.id}
                  className={`seat-btn ${seat.isBooked ? "booked" : seat.isSelected ? "selected" : "available"}`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.isBooked}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Summary Footer Bar */}
        {selectedSeats.length > 0 && (
          <div className="booking-summary-bar">
            <div className="summary-left">
              <div className="summary-details-block">
                <span className="selected-seats-label">
                  Selected Seats ({selectedSeats.length}):
                </span>
                <div className="tier-pills-list">
                  {distinctTiers.map((t) => {
                    const inTier = selectedSeats.filter((s) => s.tier === t);
                    const tierName =
                      t === "balcony" ? "Balcony" : t === "middle" ? "Middle" : "Lower";
                    return (
                      <span key={t} className={`tier-summary-badge ${t}`}>
                        <span className="tier-badge-label">{tierName}:</span>{" "}
                        <span className="tier-badge-seats">
                          {inTier.map((s) => s.id).join(", ")}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="summary-right">
              <div className="price-display">
                <span className="total-label">Total:</span>
                <span className="total-amount">₹{totalAmount}</span>
              </div>
              <button onClick={handleProceedToPayment} className="btn-proceed-pay">
                Proceed to Pay
              </button>
            </div>
          </div>
        )}

        {/* Payment Confirmation Modal */}
        {showPaymentModal && (
          <div className="payment-modal-backdrop" onClick={() => setShowPaymentModal(false)}>
            <div className="payment-modal-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">Payment & Booking Review</h3>

              <div className="booking-review-details">
                <p>
                  <strong>Movie:</strong> {show.movieId}
                </p>
                <p>
                  <strong>Cinema:</strong> {show.theatreName}
                </p>
                <p>
                  <strong>Time:</strong> {show.showDate} • {show.showtime}
                </p>

                {/* Multi-Section Itemized Breakdown */}
                <div className="sections-review-box">
                  <span className="box-header">Ticket Breakdown by Section:</span>
                  {distinctTiers.map((t) => {
                    const inTier = selectedSeats.filter((s) => s.tier === t);
                    const tierPrice =
                      t === "balcony" ? balconyPrice : t === "middle" ? middlePrice : lowerPrice;
                    const tierSub = inTier.length * tierPrice;
                    const tierLabel =
                      t === "balcony"
                        ? "Balcony Class"
                        : t === "middle"
                        ? "Middle Class"
                        : "Lower Class";

                    return (
                      <div key={t} className="section-review-row">
                        <div className="section-left">
                          <span className={`section-pill ${t}`}>{tierLabel}</span>
                          <span className="seats-text">
                            ({inTier.map((s) => s.id).join(", ")})
                          </span>
                        </div>
                        <span className="section-price">
                          {inTier.length} × ₹{tierPrice} = <strong>₹{tierSub}</strong>
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="price-breakdown">
                  <div className="row-item">
                    <span>Tickets Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="row-item">
                    <span>Convenience Fee (incl. GST)</span>
                    <span>₹{convFee}</span>
                  </div>
                  <div className="row-item total-row">
                    <span>Grand Total</span>
                    <span className="red-text">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="payment-method-selector">
                <label>Select Payment Method:</label>
                <div className="methods-group">
                  <button
                    className={`method-btn ${paymentMethod === "Card" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("Card")}
                  >
                    <BiCreditCard size={18} /> Card / Netbanking
                  </button>
                  <button
                    className={`method-btn ${paymentMethod === "UPI" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("UPI")}
                  >
                    <BiQrScan size={18} /> UPI (GPay/PhonePe)
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={processingPayment}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm-pay"
                  onClick={handleConfirmBooking}
                  disabled={processingPayment}
                >
                  {processingPayment ? "Processing Payment..." : `Pay ₹${totalAmount}`}
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

export default SeatsPage;
