import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, confirmed, cancelled
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setAlertMessage({ type: 'danger', text: 'Failed to load bookings history.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);

    try {
      const res = await api.patch(`/bookings/${cancelModalBooking._id}/cancel`);
      if (res.data?.success) {
        setAlertMessage({
          type: 'success',
          text: `Booking ${cancelModalBooking.bookingReference} has been successfully cancelled and refunded.`,
        });
        setCancelModalBooking(null);
        // Refresh bookings
        fetchBookings();
      }
    } catch (err) {
      setAlertMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to cancel booking.',
      });
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'confirmed') return b.bookingStatus === 'confirmed';
    if (activeTab === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  return (
    <div className="container py-5">
      {/* Page Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
        <div>
          <h1 className="display-5 fw-bold text-white brand-font mb-2">My Bookings</h1>
          <p className="text-secondary mb-0">View all your cinema reservations, passes, and cancellation receipts.</p>
        </div>
        <Link to="/movies" className="btn btn-cinema btn-sm py-2 px-3 mt-3 mt-sm-0">
          <i className="bi bi-plus-lg"></i> Book New Tickets
        </Link>
      </div>

      {/* Alert Notice */}
      {alertMessage.text && (
        <div className={`alert alert-${alertMessage.type} alert-dismissible fade show mb-4`} role="alert">
          {alertMessage.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlertMessage({ type: '', text: '' })}
          ></button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="glass-panel p-2 mb-4 d-inline-flex gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`btn btn-sm py-2 px-4 rounded-3 border-0 transition-smooth ${
            activeTab === 'all' ? 'btn-danger text-white' : 'text-secondary'
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`btn btn-sm py-2 px-4 rounded-3 border-0 transition-smooth ${
            activeTab === 'confirmed' ? 'btn-danger text-white' : 'text-secondary'
          }`}
        >
          Confirmed ({bookings.filter((b) => b.bookingStatus === 'confirmed').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`btn btn-sm py-2 px-4 rounded-3 border-0 transition-smooth ${
            activeTab === 'cancelled' ? 'btn-danger text-white' : 'text-secondary'
          }`}
        >
          Cancelled ({bookings.filter((b) => b.bookingStatus === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading bookings...</span>
          </div>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {filteredBookings.map((b) => {
            const isConfirmed = b.bookingStatus === 'confirmed';

            return (
              <div key={b._id} className="glass-panel p-4 border-secondary border-opacity-25 shadow-sm">
                <div className="row g-4 align-items-center">
                  {/* Poster */}
                  <div className="col-lg-2 col-md-3 col-4">
                    <img
                      src={b.movieId?.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'}
                      alt={b.movieId?.title || 'Movie'}
                      className="rounded-3 w-100 object-fit-cover shadow"
                      style={{ aspectRatio: '2/3' }}
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="col-lg-7 col-md-6 col-8">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                      <span className="font-monospace text-danger fw-bold">{b.bookingReference}</span>
                      <span
                        className={`badge ${
                          isConfirmed ? 'bg-success' : 'bg-secondary'
                        } text-uppercase px-2 py-1`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {b.bookingStatus}
                      </span>
                      <span className="text-secondary small">
                        Booked on {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h4 className="text-white fw-bold mb-1">{b.movieId?.title || 'Cinema Ticket'}</h4>
                    <p className="text-secondary small mb-2">
                      <i className="bi bi-geo-alt text-danger me-1"></i> {b.cinemaId?.name} ({b.showId?.screenName})
                    </p>

                    <div className="d-flex flex-wrap gap-2 text-light small mb-3">
                      <span className="badge bg-dark border border-secondary">
                        <i className="bi bi-calendar-event text-danger me-1"></i> {b.showId?.showDate}
                      </span>
                      <span className="badge bg-dark border border-secondary">
                        <i className="bi bi-clock text-danger me-1"></i> {b.showId?.startTime}
                      </span>
                      <span className="badge bg-dark border border-secondary">
                        {b.numberOfTickets} Ticket(s)
                      </span>
                    </div>

                    {/* Seats */}
                    <div className="d-flex align-items-center gap-1 flex-wrap">
                      <span className="text-secondary small me-1">Seats:</span>
                      {b.selectedSeats?.map((s) => (
                        <span key={s.seatId} className="badge bg-primary px-2 py-1">
                          {s.seatId}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="col-lg-3 col-md-3 text-md-end border-top border-md-top-0 border-secondary border-opacity-25 pt-3 pt-md-0">
                    <span className="text-secondary small d-block mb-1">Total Paid:</span>
                    <h3 className="text-danger fw-bold mb-3">${b.totalAmount?.toFixed(2)}</h3>

                    <div className="d-flex flex-column gap-2">
                      <button
                        onClick={() => setSelectedBookingForModal(b)}
                        className="btn btn-outline-cinema btn-sm py-2"
                      >
                        <i className="bi bi-ticket-perforated"></i> View Pass
                      </button>

                      {isConfirmed && (
                        <button
                          onClick={() => setCancelModalBooking(b)}
                          className="btn btn-sm btn-outline-danger py-2"
                        >
                          <i className="bi bi-x-circle"></i> Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5 glass-panel p-5">
          <div className="text-secondary fs-1 mb-3">
            <i className="bi bi-ticket-perforated"></i>
          </div>
          <h4 className="text-white fw-bold mb-2">No Bookings Found</h4>
          <p className="text-secondary mb-4">
            You haven't reserved any cinema tickets under this filter tab yet.
          </p>
          <Link to="/movies" className="btn btn-cinema px-4">
            Browse Currently Showing Movies
          </Link>
        </div>
      )}

      {/* View Pass Modal */}
      {selectedBookingForModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content cinema-ticket-card p-4 text-light shadow-lg">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-danger">DIGITAL ADMISSION PASS</span>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedBookingForModal(null)}
                ></button>
              </div>

              <div className="text-center my-2">
                <span className="text-secondary small text-uppercase">Reference</span>
                <h4 className="text-danger font-monospace fw-bold mb-2">
                  {selectedBookingForModal.bookingReference}
                </h4>
                <h3 className="text-white fw-bold brand-font mb-1">
                  {selectedBookingForModal.movieId?.title}
                </h3>
                <p className="text-secondary small mb-3">
                  {selectedBookingForModal.cinemaId?.name} &bull; {selectedBookingForModal.showId?.screenName}
                </p>
              </div>

              <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <div className="row g-2 text-center small">
                  <div className="col-4">
                    <span className="text-secondary d-block">Date</span>
                    <strong className="text-white">{selectedBookingForModal.showId?.showDate}</strong>
                  </div>
                  <div className="col-4">
                    <span className="text-secondary d-block">Time</span>
                    <strong className="text-white">{selectedBookingForModal.showId?.startTime}</strong>
                  </div>
                  <div className="col-4">
                    <span className="text-secondary d-block">Tickets</span>
                    <strong className="text-white">{selectedBookingForModal.numberOfTickets}</strong>
                  </div>
                </div>
              </div>

              <div className="text-center mb-3">
                <span className="text-secondary small d-block mb-1">Reserved Seats</span>
                <div className="d-flex justify-content-center gap-1 flex-wrap">
                  {selectedBookingForModal.selectedSeats?.map((s) => (
                    <span key={s.seatId} className="badge bg-primary px-3 py-2 fs-6">
                      {s.seatId}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center pt-2 border-top border-secondary border-opacity-25">
                <div
                  className="d-inline-block p-2 bg-white rounded-2 mb-1"
                  style={{ letterSpacing: '0.25em', fontFamily: 'monospace', color: '#000', fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  ||| | |||| | ||| |||| | || |
                </div>
                <small className="text-secondary d-block">Scan at theater turnstile</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-panel border-danger text-light p-3 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-white">Confirm Cancellation</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setCancelModalBooking(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-secondary mb-3">
                  Are you sure you want to cancel booking{' '}
                  <strong className="text-white font-monospace">{cancelModalBooking.bookingReference}</strong> for{' '}
                  <strong className="text-white">{cancelModalBooking.movieId?.title}</strong>?
                </p>
                <div className="p-3 rounded-3 mb-3 bg-dark border border-secondary border-opacity-25 small text-secondary">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Seats to be released:</span>
                    <span className="text-white">
                      {cancelModalBooking.selectedSeats?.map((s) => s.seatId).join(', ')}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Refund Amount:</span>
                    <span className="text-success fw-bold">${cancelModalBooking.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Refund Method:</span>
                    <span className="text-white">{cancelModalBooking.paymentMethod}</span>
                  </div>
                </div>
                <div className="alert alert-warning py-2 small mb-0">
                  <i className="bi bi-info-circle me-1"></i> Under the cancellation policy, seats will immediately be made available to other moviegoers.
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setCancelModalBooking(null)}
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleCancelBooking}
                  className="btn btn-danger"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm & Release Seats'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
