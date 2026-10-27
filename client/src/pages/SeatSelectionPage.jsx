import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import SeatMap from '../components/SeatMap';

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const socket = useSocket();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('321');

  // Fetch show details
  const fetchShowData = async () => {
    try {
      const res = await api.get(`/shows/${showId}`);
      setShow(res.data?.data);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to load show seating details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowData();
  }, [showId]);

  // Socket.IO real-time synchronization
  useEffect(() => {
    if (!socket || !showId) return;

    // Join room for this show
    socket.emit('joinShow', showId);

    // Listen for real-time seat changes broadcast by other users
    const handleSeatsUpdated = (data) => {
      if (data.showId === showId) {
        setShow((prevShow) => {
          if (!prevShow) return prevShow;
          const updatedSeats = prevShow.seats.map((seat) => {
            if (data.bookedSeatIds.includes(seat.seatId)) {
              return { ...seat, status: data.status };
            }
            return seat;
          });
          return { ...prevShow, seats: updatedSeats };
        });

        // If currently selected seats were booked by someone else, deselect them and alert user
        setSelectedSeats((prevSelected) => {
          const conflicting = prevSelected.filter((s) => data.bookedSeatIds.includes(s.seatId));
          if (conflicting.length > 0 && data.status === 'booked') {
            setErrorMessage(
              `Notice: Seat(s) ${conflicting.map((c) => c.seatId).join(', ')} were just reserved by another guest.`
            );
          }
          return prevSelected.filter((s) => !data.bookedSeatIds.includes(s.seatId));
        });
      }
    };

    socket.on('seatsUpdated', handleSeatsUpdated);

    return () => {
      socket.emit('leaveShow', showId);
      socket.off('seatsUpdated', handleSeatsUpdated);
    };
  }, [socket, showId]);

  // Toggle seat selection
  const handleSeatToggle = (seat) => {
    setErrorMessage('');
    const exists = selectedSeats.some((s) => s.seatId === seat.seatId);

    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatId !== seat.seatId));
    } else {
      // Max 10 seats per booking
      if (selectedSeats.length >= 10) {
        setErrorMessage('You can select a maximum of 10 seats per transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Calculations
  const subtotal = selectedSeats.reduce((acc, s) => acc + (s.price || 12), 0);
  const convenienceFee = selectedSeats.length > 0 ? Math.round(selectedSeats.length * 2.5 * 100) / 100 : 0;
  const taxes = selectedSeats.length > 0 ? Math.round(subtotal * 0.08 * 100) / 100 : 0;
  const totalAmount = Math.round((subtotal + convenienceFee + taxes) * 100) / 100;

  // Checkout trigger
  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (selectedSeats.length === 0) {
      setErrorMessage('Please select at least one seat before proceeding.');
      return;
    }

    setShowPaymentModal(true);
  };

  // Final booking execution
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setErrorMessage('');

    try {
      const seatIds = selectedSeats.map((s) => s.seatId);
      const res = await api.post('/bookings', {
        showId,
        seatIds,
        paymentMethod,
      });

      if (res.data?.success) {
        const booking = res.data.data;
        setShowPaymentModal(false);
        navigate(`/booking-confirmation/${booking._id}`, {
          state: { booking, movie: res.data.movie, cinema: res.data.cinema },
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Booking transaction failed. Please select your seats again.';
      setErrorMessage(errorMsg);
      setShowPaymentModal(false);
      // Re-fetch latest seat state from server
      fetchShowData();
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 my-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading seating layout...</span>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-white">Show not found or no longer available</h3>
        <Link to="/movies" className="btn btn-cinema mt-3">
          Explore Other Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Top Breadcrumb & Show Details Header */}
      <div className="glass-panel p-4 mb-4 border-secondary border-opacity-25">
        <div className="row align-items-center g-3">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Link to={`/movies/${show.movieId?._id}`} className="text-secondary text-decoration-none small">
                <i className="bi bi-arrow-left"></i> Back to Movie
              </Link>
              <span className="text-secondary">&bull;</span>
              <span className="badge bg-danger text-uppercase">{show.movieId?.genre?.[0] || 'Movie'}</span>
            </div>
            <h2 className="text-white fw-bold brand-font mb-1">{show.movieId?.title}</h2>
            <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small">
              <span>
                <i className="bi bi-building text-danger me-1"></i> {show.cinemaId?.name}
              </span>
              <span>&bull;</span>
              <span>
                <i className="bi bi-tv text-danger me-1"></i> {show.screenName}
              </span>
              <span>&bull;</span>
              <span>
                <i className="bi bi-calendar-check text-danger me-1"></i> {show.showDate}
              </span>
              <span>&bull;</span>
              <span className="text-white fw-semibold">
                <i className="bi bi-clock text-danger me-1"></i> {show.startTime}
              </span>
            </div>
          </div>
          <div className="col-lg-4 text-lg-end">
            <span className="badge bg-dark border border-secondary text-secondary px-3 py-2">
              <i className="bi bi-broadcast text-success me-1"></i> Live Availability Active
            </span>
          </div>
        </div>
      </div>

      {/* Error / Alert banner */}
      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Interactive Seating Layout and Summary Sidebar */}
      <div className="row g-4">
        {/* Cinema Seating Visualizer */}
        <div className="col-lg-8">
          <SeatMap
            seats={show.seats}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            ticketPrice={show.ticketPrice}
          />
        </div>

        {/* Booking Summary Sidebar */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="text-white fw-bold mb-3 d-flex align-items-center justify-content-between">
              <span>Booking Summary</span>
              <span className="badge bg-danger rounded-pill fs-6">{selectedSeats.length} Seats</span>
            </h5>

            {/* Selected Seats Badges */}
            <div className="mb-3">
              <label className="text-secondary small fw-semibold d-block mb-2">Selected Seats:</label>
              {selectedSeats.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.seatId}
                      className="badge bg-primary text-white d-flex align-items-center gap-1 py-2 px-3 rounded-pill"
                    >
                      {seat.seatId}
                      <small className="opacity-75">(${seat.price})</small>
                      <i
                        className="bi bi-x ms-1 cursor-pointer"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSeatToggle(seat)}
                      ></i>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-secondary small fst-italic mb-0">
                  Click on the cinema seat layout to select your preferred seats.
                </p>
              )}
            </div>

            <hr className="border-secondary border-opacity-25 my-3" />

            {/* Price Breakdown */}
            <div className="d-flex flex-column gap-2 small mb-3">
              <div className="d-flex justify-content-between text-secondary">
                <span>Tickets Subtotal</span>
                <span className="text-white fw-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary">
                <span>Convenience & Online Fee</span>
                <span className="text-white">${convenienceFee.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary">
                <span>Integrated Taxes (GST/Sales 8%)</span>
                <span className="text-white">${taxes.toFixed(2)}</span>
              </div>
              <hr className="border-secondary border-opacity-25 my-1" />
              <div className="d-flex justify-content-between fs-5 text-white fw-bold">
                <span>Total Amount</span>
                <span className="text-danger">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={selectedSeats.length === 0}
              className="btn btn-cinema w-100 py-3 fw-bold"
            >
              <i className="bi bi-credit-card-2-front"></i> Continue to Checkout
            </button>

            {!isAuthenticated && (
              <small className="text-secondary text-center d-block mt-2" style={{ fontSize: '0.75rem' }}>
                * You will be prompted to sign in before finalizing payment.
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Payment / Checkout Modal */}
      {showPaymentModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-panel border-danger text-light p-2 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold text-white brand-font">Instant Ticket Checkout</h5>
                  <p className="text-secondary small mb-0">Secure 256-bit encrypted reservation</p>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {/* Summary Box */}
                <div className="p-3 rounded-3 mb-3" style={{ background: '#12141c' }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-secondary small">Movie & Screen:</span>
                    <strong className="text-white small">{show.movieId?.title}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-secondary small">Seats:</span>
                    <span className="badge bg-primary">{selectedSeats.map((s) => s.seatId).join(', ')}</span>
                  </div>
                  <div className="d-flex justify-content-between text-white fw-bold border-top border-secondary border-opacity-25 pt-2 mt-2">
                    <span>Payable Amount:</span>
                    <span className="text-danger fs-5">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handleConfirmBooking}>
                  {/* Payment Method Selector */}
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-semibold">Payment Option</label>
                    <div className="d-grid gap-2">
                      {['Credit / Debit Card', 'Instant UPI / QR Code', 'Digital Wallet / Apple Pay'].map((method) => (
                        <div
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`p-2 rounded-2 border d-flex align-items-center justify-content-between cursor-pointer ${
                            paymentMethod === method
                              ? 'border-danger bg-danger bg-opacity-10 text-white'
                              : 'border-secondary border-opacity-25 text-secondary'
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="small fw-semibold">{method}</span>
                          {paymentMethod === method && <i className="bi bi-check-circle-fill text-danger"></i>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'Credit / Debit Card' && (
                    <div className="row g-2 mb-3">
                      <div className="col-12">
                        <label className="form-label text-secondary small">Card Number</label>
                        <input
                          type="text"
                          className="form-control cinema-input form-control-sm"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small">Expiry</label>
                        <input
                          type="text"
                          className="form-control cinema-input form-control-sm"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small">CVV</label>
                        <input
                          type="password"
                          className="form-control cinema-input form-control-sm"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn btn-cinema w-100 py-3 mt-2 fw-bold"
                  >
                    {bookingLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Confirming Reservation...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock-fill me-1"></i> Pay ${totalAmount.toFixed(2)} & Confirm
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;
