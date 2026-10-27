import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../api/axiosConfig';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E50914', '#ffffff', '#3b82f6', '#10b981'],
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }

    if (!booking) {
      const fetchBooking = async () => {
        try {
          const res = await api.get(`/bookings/${bookingId}`);
          setBooking(res.data?.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Could not locate booking records.');
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [bookingId, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 my-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading confirmation...</span>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-white">Booking details unavailable</h3>
        <p className="text-secondary">{error}</p>
        <Link to="/my-bookings" className="btn btn-cinema mt-3">
          Check My Bookings
        </Link>
      </div>
    );
  }

  const movie = booking.movieId;
  const cinema = booking.cinemaId;
  const show = booking.showId;

  return (
    <div className="container py-5">
      {/* Top Success Banner */}
      <div className="text-center mb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success text-white mb-3 shadow"
          style={{ width: '64px', height: '64px', fontSize: '2rem' }}
        >
          <i className="bi bi-check-lg"></i>
        </div>
        <h1 className="display-6 fw-bold text-white brand-font mb-1">Booking Confirmed!</h1>
        <p className="text-secondary">
          Your cinema tickets have been reserved and confirmation email has been dispatched.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          {/* Cinema Ticket Card */}
          <div className="cinema-ticket-card p-4 p-md-5 mb-4 shadow-lg">
            <div className="ticket-notch-left"></div>
            <div className="ticket-notch-right"></div>

            {/* Header: Reference and Status */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pb-3 mb-4 border-bottom border-secondary border-opacity-25">
              <div>
                <span className="text-secondary small text-uppercase fw-semibold d-block">Booking Reference</span>
                <span className="fs-4 fw-bold text-danger font-monospace">{booking.bookingReference}</span>
              </div>
              <div className="text-end">
                <span className="badge bg-success px-3 py-2 text-uppercase fw-bold">
                  <i className="bi bi-check-circle-fill me-1"></i> {booking.bookingStatus}
                </span>
              </div>
            </div>

            {/* Movie and Cinema Information */}
            <div className="row g-4 align-items-center mb-4">
              <div className="col-sm-3 col-4">
                <img
                  src={movie?.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'}
                  alt={movie?.title || 'Movie'}
                  className="rounded-3 w-100 object-fit-cover shadow"
                  style={{ aspectRatio: '2/3' }}
                />
              </div>
              <div className="col-sm-9 col-8">
                <h3 className="text-white fw-bold brand-font mb-1">{movie?.title || 'Selected Movie'}</h3>
                <p className="text-danger fw-semibold mb-2">{cinema?.name}</p>
                <div className="d-flex flex-wrap gap-2 text-secondary small mb-2">
                  <span>{cinema?.address}, {cinema?.city}</span>
                </div>
                <div className="d-flex flex-wrap gap-2 text-light small">
                  <span className="badge bg-dark border border-secondary">
                    <i className="bi bi-display me-1 text-danger"></i> {show?.screenName || 'Main Screen'}
                  </span>
                  <span className="badge bg-dark border border-secondary">
                    <i className="bi bi-clock me-1 text-danger"></i> {show?.startTime}
                  </span>
                  <span className="badge bg-dark border border-secondary">
                    <i className="bi bi-calendar3 me-1 text-danger"></i> {show?.showDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Seats & Payment Breakdown */}
            <div className="p-3 rounded-3 mb-4" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="row g-2 text-center text-sm-start">
                <div className="col-sm-4">
                  <span className="text-secondary small d-block">Reserved Seats</span>
                  <div className="d-flex flex-wrap gap-1 mt-1 justify-content-center justify-content-sm-start">
                    {booking.selectedSeats?.map((s) => (
                      <span key={s.seatId} className="badge bg-primary text-white">
                        {s.seatId}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-sm-4">
                  <span className="text-secondary small d-block">Total Tickets</span>
                  <strong className="text-white fs-6">{booking.numberOfTickets} Ticket(s)</strong>
                </div>
                <div className="col-sm-4 text-sm-end">
                  <span className="text-secondary small d-block">Total Paid</span>
                  <strong className="text-danger fs-5">${booking.totalAmount?.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Barcode & Security Mockup */}
            <div className="text-center pt-2">
              <div
                className="d-inline-block p-2 bg-white rounded-2 mb-2"
                style={{ letterSpacing: '0.25em', fontFamily: 'monospace', color: '#000', fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                ||| | |||| | ||| |||| | || | ||| |||||
              </div>
              <small className="text-secondary d-block" style={{ fontSize: '0.72rem' }}>
                Present this digital pass or physical printout at the cinema turnstile for admission.
              </small>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <button onClick={handlePrint} className="btn btn-outline-cinema py-2 px-4">
              <i className="bi bi-printer"></i> Print / Download Ticket
            </button>
            <Link to="/my-bookings" className="btn btn-cinema py-2 px-4">
              <i className="bi bi-ticket-perforated"></i> View in My Bookings
            </Link>
            <Link to="/" className="btn btn-outline-light py-2 px-3 border-secondary">
              <i className="bi bi-house"></i> Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
