import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, movies, shows, bookings, users, cinemas
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionAlert, setActionAlert] = useState({ type: '', text: '' });

  // Movie Modal State (Add / Edit)
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    posterUrl: '',
    bannerUrl: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 120,
    releaseDate: new Date().toISOString().split('T')[0],
    cast: 'Actor One, Actor Two',
    director: '',
    rating: 8.5,
    status: 'now_showing',
    trailerUrl: '',
    ageRating: 'UA',
  });

  // Show Schedule Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showForm, setShowForm] = useState({
    movieId: '',
    cinemaId: '',
    screenName: '',
    showDate: new Date().toISOString().split('T')[0],
    startTime: '06:30 PM',
    priceStandard: 12,
    pricePremium: 18,
    priceVip: 28,
  });

  // Cinema Modal State
  const [showCinemaModal, setShowCinemaModal] = useState(false);
  const [cinemaForm, setCinemaForm] = useState({
    name: '',
    location: '',
    address: '',
    city: '',
    screenName: 'Screen 1 - IMAX',
    totalSeats: 120,
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, moviesRes, showsRes, cinemasRes, bookingsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/movies'),
        api.get('/shows'),
        api.get('/cinemas'),
        api.get('/admin/bookings'),
        api.get('/admin/users'),
      ]);

      setStats(statsRes.data?.data);
      setMovies(moviesRes.data?.data || []);
      setShows(showsRes.data?.data || []);
      setCinemas(cinemasRes.data?.data || []);
      setBookings(bookingsRes.data?.data || []);
      setUsers(usersRes.data?.data || []);

      if (moviesRes.data?.data?.length > 0 && cinemasRes.data?.data?.length > 0) {
        setShowForm((prev) => ({
          ...prev,
          movieId: moviesRes.data.data[0]._id,
          cinemaId: cinemasRes.data.data[0]._id,
          screenName: cinemasRes.data.data[0].screens?.[0]?.screenName || 'Screen 1',
        }));
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setActionAlert({ type: 'danger', text: 'Error fetching administrative records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Movie Save (Create or Update)
  const handleSaveMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movieForm,
        genre: typeof movieForm.genre === 'string' ? movieForm.genre.split(',').map((s) => s.trim()) : movieForm.genre,
        language: typeof movieForm.language === 'string' ? movieForm.language.split(',').map((s) => s.trim()) : movieForm.language,
        cast: typeof movieForm.cast === 'string' ? movieForm.cast.split(',').map((s) => s.trim()) : movieForm.cast,
        duration: Number(movieForm.duration),
        rating: Number(movieForm.rating),
      };

      if (editingMovie) {
        await api.put(`/admin/movies/${editingMovie._id}`, payload);
        setActionAlert({ type: 'success', text: `Movie "${payload.title}" updated successfully!` });
      } else {
        await api.post('/admin/movies', payload);
        setActionAlert({ type: 'success', text: `Movie "${payload.title}" created successfully!` });
      }

      setShowMovieModal(false);
      setEditingMovie(null);
      fetchDashboardData();
    } catch (err) {
      setActionAlert({ type: 'danger', text: err.response?.data?.message || 'Failed to save movie.' });
    }
  };

  // Movie Delete
  const handleDeleteMovie = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/admin/movies/${id}`);
      setActionAlert({ type: 'success', text: `Movie "${title}" deleted.` });
      fetchDashboardData();
    } catch (err) {
      setActionAlert({ type: 'danger', text: err.response?.data?.message || 'Failed to delete movie.' });
    }
  };

  // Show Schedule Save
  const handleScheduleShow = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        movieId: showForm.movieId,
        cinemaId: showForm.cinemaId,
        screenName: showForm.screenName,
        showDate: showForm.showDate,
        startTime: showForm.startTime,
        ticketPrice: {
          standard: Number(showForm.priceStandard),
          premium: Number(showForm.pricePremium),
          vip: Number(showForm.priceVip),
        },
      };

      await api.post('/admin/shows', payload);
      setActionAlert({ type: 'success', text: 'Show successfully scheduled with seating map generated!' });
      setShowScheduleModal(false);
      fetchDashboardData();
    } catch (err) {
      setActionAlert({ type: 'danger', text: err.response?.data?.message || 'Failed to schedule show.' });
    }
  };

  // Show Delete / Cancel
  const handleDeleteShow = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled show?')) return;
    try {
      await api.delete(`/admin/shows/${id}`);
      setActionAlert({ type: 'success', text: 'Show status set to cancelled.' });
      fetchDashboardData();
    } catch (err) {
      setActionAlert({ type: 'danger', text: err.response?.data?.message || 'Failed to cancel show.' });
    }
  };

  // Cinema Save
  const handleSaveCinema = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: cinemaForm.name,
        location: cinemaForm.location,
        address: cinemaForm.address,
        city: cinemaForm.city,
        screens: [
          {
            screenNumber: 1,
            screenName: cinemaForm.screenName,
            totalSeats: Number(cinemaForm.totalSeats),
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            seatsPerRow: 12,
          },
        ],
      };

      await api.post('/admin/cinemas', payload);
      setActionAlert({ type: 'success', text: `Cinema "${cinemaForm.name}" created.` });
      setShowCinemaModal(false);
      fetchDashboardData();
    } catch (err) {
      setActionAlert({ type: 'danger', text: err.response?.data?.message || 'Failed to add cinema.' });
    }
  };

  // Booking Status Update
  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await api.patch(`/admin/bookings/${id}/status`, { bookingStatus: status });
      setActionAlert({ type: 'success', text: `Booking status updated to ${status}.` });
      fetchDashboardData();
    } catch (err) {
      setActionAlert({ type: 'danger', text: err.response?.data?.message || 'Failed to update status.' });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 my-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading administrative records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-md-5">
      {/* Top Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="badge bg-warning text-dark px-3 py-1 fw-bold text-uppercase mb-1">
            <i className="bi bi-shield-lock-fill me-1"></i> Admin Console
          </span>
          <h2 className="text-white fw-bold brand-font mb-0">Management Dashboard</h2>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => {
              setEditingMovie(null);
              setMovieForm({
                title: '',
                description: '',
                posterUrl: '',
                bannerUrl: '',
                genre: 'Action, Sci-Fi',
                language: 'English',
                duration: 120,
                releaseDate: new Date().toISOString().split('T')[0],
                cast: '',
                director: '',
                rating: 8.5,
                status: 'now_showing',
                trailerUrl: '',
                ageRating: 'UA',
              });
              setShowMovieModal(true);
            }}
            className="btn btn-cinema btn-sm py-2 px-3"
          >
            <i className="bi bi-film"></i> Add Movie
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="btn btn-outline-cinema btn-sm py-2 px-3"
          >
            <i className="bi bi-calendar-plus"></i> Schedule Show
          </button>
        </div>
      </div>

      {/* Global Action Alert */}
      {actionAlert.text && (
        <div className={`alert alert-${actionAlert.type} alert-dismissible fade show mb-4`} role="alert">
          {actionAlert.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setActionAlert({ type: '', text: '' })}
          ></button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-xl-2 col-md-4 col-6">
          <div className="glass-panel p-3 border-danger border-opacity-50">
            <span className="text-secondary small d-block">Gross Revenue</span>
            <h3 className="text-danger fw-bold mb-0">${stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="glass-panel p-3 border-secondary border-opacity-25">
            <span className="text-secondary small d-block">Total Bookings</span>
            <h3 className="text-white fw-bold mb-0">{stats?.totalBookings || 0}</h3>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="glass-panel p-3 border-secondary border-opacity-25">
            <span className="text-secondary small d-block">Active Movies</span>
            <h3 className="text-white fw-bold mb-0">{stats?.totalMovies || 0}</h3>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="glass-panel p-3 border-secondary border-opacity-25">
            <span className="text-secondary small d-block">Cinemas & Screens</span>
            <h3 className="text-white fw-bold mb-0">{stats?.totalCinemas || 0}</h3>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="glass-panel p-3 border-secondary border-opacity-25">
            <span className="text-secondary small d-block">Active Shows</span>
            <h3 className="text-white fw-bold mb-0">{stats?.totalShows || 0}</h3>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-6">
          <div className="glass-panel p-3 border-secondary border-opacity-25">
            <span className="text-secondary small d-block">Registered Users</span>
            <h3 className="text-white fw-bold mb-0">{stats?.totalUsers || 0}</h3>
          </div>
        </div>
      </div>

      {/* Sub-Nav Tabs */}
      <div className="glass-panel p-2 mb-4 d-flex flex-wrap gap-2">
        {[
          { id: 'overview', label: 'Overview', icon: 'bi-grid-fill' },
          { id: 'movies', label: `Movies (${movies.length})`, icon: 'bi-film' },
          { id: 'shows', label: `Shows (${shows.length})`, icon: 'bi-clock-fill' },
          { id: 'cinemas', label: `Cinemas (${cinemas.length})`, icon: 'bi-building' },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: 'bi-ticket-perforated-fill' },
          { id: 'users', label: `Users (${users.length})`, icon: 'bi-people-fill' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn btn-sm py-2 px-3 rounded-3 border-0 transition-smooth d-flex align-items-center gap-1 ${
              activeTab === tab.id ? 'btn-danger text-white fw-bold' : 'text-secondary'
            }`}
          >
            <i className={`bi ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="glass-panel p-4 border-secondary border-opacity-25">
          <h4 className="text-white fw-bold mb-3">Recent Ticket Reservations</h4>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="text-secondary small text-uppercase">
                <tr>
                  <th>Ref #</th>
                  <th>Movie</th>
                  <th>Customer</th>
                  <th>Tickets</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 8).map((b) => (
                  <tr key={b._id}>
                    <td className="font-monospace text-danger fw-bold">{b.bookingReference}</td>
                    <td className="text-white fw-semibold">{b.movieId?.title || 'Unknown Movie'}</td>
                    <td className="text-secondary small">
                      {b.userId?.name} <span className="d-block text-muted">{b.userId?.email}</span>
                    </td>
                    <td>{b.numberOfTickets} seats</td>
                    <td className="text-danger fw-bold">${b.totalAmount?.toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge ${
                          b.bookingStatus === 'confirmed' ? 'bg-success' : 'bg-secondary'
                        } text-uppercase`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="text-secondary small">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. MOVIES MANAGEMENT */}
      {activeTab === 'movies' && (
        <div className="glass-panel p-4 border-secondary border-opacity-25">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-white fw-bold mb-0">Movie Catalog</h4>
            <button
              onClick={() => {
                setEditingMovie(null);
                setShowMovieModal(true);
              }}
              className="btn btn-cinema btn-sm"
            >
              <i className="bi bi-plus-lg"></i> Add New Movie
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="text-secondary small text-uppercase">
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Duration</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id}>
                    <td style={{ width: '60px' }}>
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="rounded"
                        style={{ width: '45px', height: '60px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <strong className="text-white d-block">{m.title}</strong>
                      <small className="text-secondary">Dir: {m.director || 'N/A'}</small>
                    </td>
                    <td>{m.genre?.join(', ')}</td>
                    <td>{m.duration} mins</td>
                    <td>
                      <span className="badge bg-dark border border-warning text-warning">
                        ★ {m.rating}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          m.status === 'upcoming' ? 'bg-primary' : 'bg-danger'
                        } text-uppercase`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => {
                          setEditingMovie(m);
                          setMovieForm({
                            title: m.title,
                            description: m.description,
                            posterUrl: m.posterUrl,
                            bannerUrl: m.bannerUrl,
                            genre: m.genre?.join(', '),
                            language: m.language?.join(', '),
                            duration: m.duration,
                            releaseDate: new Date(m.releaseDate).toISOString().split('T')[0],
                            cast: m.cast?.join(', '),
                            director: m.director,
                            rating: m.rating,
                            status: m.status,
                            trailerUrl: m.trailerUrl || '',
                            ageRating: m.ageRating || 'UA',
                          });
                          setShowMovieModal(true);
                        }}
                        className="btn btn-sm btn-outline-info me-2"
                        title="Edit Movie"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(m._id, m.title)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Movie"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SHOWS MANAGEMENT */}
      {activeTab === 'shows' && (
        <div className="glass-panel p-4 border-secondary border-opacity-25">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-white fw-bold mb-0">Scheduled Shows</h4>
            <button onClick={() => setShowScheduleModal(true)} className="btn btn-cinema btn-sm">
              <i className="bi bi-plus-lg"></i> Schedule Show
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="text-secondary small text-uppercase">
                <tr>
                  <th>Movie</th>
                  <th>Cinema & Screen</th>
                  <th>Date & Time</th>
                  <th>Prices</th>
                  <th>Seat Capacity</th>
                  <th>Status</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((s) => {
                  const bookedCount = s.seats?.filter((st) => st.status === 'booked').length || 0;
                  const totalCount = s.seats?.length || 0;

                  return (
                    <tr key={s._id}>
                      <td className="text-white fw-semibold">{s.movieId?.title || 'Unknown'}</td>
                      <td>
                        <span className="d-block text-light">{s.cinemaId?.name}</span>
                        <small className="text-secondary">{s.screenName}</small>
                      </td>
                      <td>
                        <span className="d-block text-white">{s.showDate}</span>
                        <small className="text-danger fw-bold">{s.startTime}</small>
                      </td>
                      <td className="small text-secondary">
                        ${s.ticketPrice?.standard} / ${s.ticketPrice?.premium} / ${s.ticketPrice?.vip}
                      </td>
                      <td>
                        <span className="badge bg-dark border border-secondary text-light">
                          {bookedCount} / {totalCount} booked
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${s.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="text-end">
                        {s.status === 'active' && (
                          <button
                            onClick={() => handleDeleteShow(s._id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Cancel Show
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. CINEMAS MANAGEMENT */}
      {activeTab === 'cinemas' && (
        <div className="glass-panel p-4 border-secondary border-opacity-25">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-white fw-bold mb-0">Cinema Theaters</h4>
            <button onClick={() => setShowCinemaModal(true)} className="btn btn-cinema btn-sm">
              <i className="bi bi-plus-lg"></i> Add Cinema
            </button>
          </div>

          <div className="row g-4">
            {cinemas.map((c) => (
              <div key={c._id} className="col-lg-4 col-md-6">
                <div className="p-3 rounded-3 h-100" style={{ background: '#13151d', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h5 className="text-white fw-bold mb-1">{c.name}</h5>
                  <p className="text-secondary small mb-2">{c.address}, {c.city}</p>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {c.facilities?.map((f, i) => (
                      <span key={i} className="badge bg-secondary bg-opacity-25 text-light small">
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="border-top border-secondary border-opacity-25 pt-2 small text-secondary">
                    <strong>Screens:</strong> {c.screens?.map((s) => s.screenName).join(', ') || 'Screen 1'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="glass-panel p-4 border-secondary border-opacity-25">
          <h4 className="text-white fw-bold mb-3">All Customer Bookings</h4>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="text-secondary small text-uppercase">
                <tr>
                  <th>Ref #</th>
                  <th>Movie</th>
                  <th>Customer</th>
                  <th>Cinema</th>
                  <th>Seats</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="text-end">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="font-monospace text-danger fw-bold">{b.bookingReference}</td>
                    <td className="text-white fw-semibold">{b.movieId?.title}</td>
                    <td className="small text-secondary">
                      {b.userId?.name}
                      <span className="d-block text-muted">{b.userId?.email}</span>
                    </td>
                    <td className="small text-secondary">{b.cinemaId?.name}</td>
                    <td>
                      {b.selectedSeats?.map((s) => (
                        <span key={s.seatId} className="badge bg-primary me-1">
                          {s.seatId}
                        </span>
                      ))}
                    </td>
                    <td className="text-danger fw-bold">${b.totalAmount?.toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge ${
                          b.bookingStatus === 'confirmed' ? 'bg-success' : 'bg-secondary'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="text-end">
                      <select
                        className="form-select form-select-sm cinema-input d-inline-block"
                        style={{ width: '130px' }}
                        value={b.bookingStatus}
                        onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                      >
                        <option value="confirmed" className="bg-dark text-light">Confirmed</option>
                        <option value="completed" className="bg-dark text-light">Completed</option>
                        <option value="cancelled" className="bg-dark text-light">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="glass-panel p-4 border-secondary border-opacity-25">
          <h4 className="text-white fw-bold mb-3">Registered Users</h4>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="text-secondary small text-uppercase">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="text-white fw-semibold">{u.name}</td>
                    <td className="text-secondary">{u.email}</td>
                    <td className="text-secondary small">{u.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-secondary small">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MOVIE MODAL (ADD / EDIT) */}
      {showMovieModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content glass-panel border-danger text-light shadow-lg">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold text-white">
                  {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowMovieModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveMovie}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small text-secondary">Movie Title</label>
                      <input
                        type="text"
                        className="form-control cinema-input"
                        value={movieForm.title}
                        onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Status</label>
                      <select
                        className="form-select cinema-input"
                        value={movieForm.status}
                        onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                      >
                        <option value="now_showing" className="bg-dark text-light">Now Showing</option>
                        <option value="upcoming" className="bg-dark text-light">Upcoming</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small text-secondary">Description / Synopsis</label>
                      <textarea
                        rows="3"
                        className="form-control cinema-input"
                        value={movieForm.description}
                        onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Poster Image URL</label>
                      <input
                        type="url"
                        className="form-control cinema-input"
                        placeholder="https://..."
                        value={movieForm.posterUrl}
                        onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Banner Backdrop URL</label>
                      <input
                        type="url"
                        className="form-control cinema-input"
                        placeholder="https://..."
                        value={movieForm.bannerUrl}
                        onChange={(e) => setMovieForm({ ...movieForm, bannerUrl: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Genres (comma separated)</label>
                      <input
                        type="text"
                        className="form-control cinema-input"
                        placeholder="Action, Sci-Fi"
                        value={movieForm.genre}
                        onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Languages</label>
                      <input
                        type="text"
                        className="form-control cinema-input"
                        placeholder="English, Spanish"
                        value={movieForm.language}
                        onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Duration (minutes)</label>
                      <input
                        type="number"
                        className="form-control cinema-input"
                        value={movieForm.duration}
                        onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Director</label>
                      <input
                        type="text"
                        className="form-control cinema-input"
                        value={movieForm.director}
                        onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Rating (0 - 10)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="form-control cinema-input"
                        value={movieForm.rating}
                        onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Release Date</label>
                      <input
                        type="date"
                        className="form-control cinema-input"
                        value={movieForm.releaseDate}
                        onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small text-secondary">Cast Members (comma separated)</label>
                      <input
                        type="text"
                        className="form-control cinema-input"
                        value={movieForm.cast}
                        onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowMovieModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-cinema">
                    {editingMovie ? 'Save Changes' : 'Create Movie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE SHOW MODAL */}
      {showScheduleModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-panel border-danger text-light shadow-lg">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold text-white">Schedule New Cinema Show</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowScheduleModal(false)}
                ></button>
              </div>
              <form onSubmit={handleScheduleShow}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Select Movie</label>
                    <select
                      className="form-select cinema-input"
                      value={showForm.movieId}
                      onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                      required
                    >
                      {movies.map((m) => (
                        <option key={m._id} value={m._id} className="bg-dark text-light">
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-secondary">Select Cinema</label>
                    <select
                      className="form-select cinema-input"
                      value={showForm.cinemaId}
                      onChange={(e) => {
                        const cin = cinemas.find((c) => c._id === e.target.value);
                        setShowForm({
                          ...showForm,
                          cinemaId: e.target.value,
                          screenName: cin?.screens?.[0]?.screenName || 'Screen 1',
                        });
                      }}
                      required
                    >
                      {cinemas.map((c) => (
                        <option key={c._id} value={c._id} className="bg-dark text-light">
                          {c.name} ({c.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-secondary">Show Date</label>
                      <input
                        type="date"
                        className="form-control cinema-input"
                        value={showForm.showDate}
                        onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-secondary">Start Time</label>
                      <input
                        type="text"
                        className="form-control cinema-input"
                        placeholder="e.g. 07:15 PM"
                        value={showForm.startTime}
                        onChange={(e) => setShowForm({ ...showForm, startTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small text-secondary">Standard Price ($)</label>
                      <input
                        type="number"
                        className="form-control cinema-input"
                        value={showForm.priceStandard}
                        onChange={(e) => setShowForm({ ...showForm, priceStandard: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small text-secondary">Premium Price ($)</label>
                      <input
                        type="number"
                        className="form-control cinema-input"
                        value={showForm.pricePremium}
                        onChange={(e) => setShowForm({ ...showForm, pricePremium: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small text-secondary">VIP Price ($)</label>
                      <input
                        type="number"
                        className="form-control cinema-input"
                        value={showForm.priceVip}
                        onChange={(e) => setShowForm({ ...showForm, priceVip: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowScheduleModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-cinema">
                    Schedule Show & Generate Seats
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ADD CINEMA MODAL */}
      {showCinemaModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-panel border-danger text-light shadow-lg">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold text-white">Add New Cinema Complex</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCinemaModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveCinema}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Cinema Name</label>
                    <input
                      type="text"
                      className="form-control cinema-input"
                      placeholder="e.g. IMovies Cinema Royale"
                      value={cinemaForm.name}
                      onChange={(e) => setCinemaForm({ ...cinemaForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Location Area</label>
                    <input
                      type="text"
                      className="form-control cinema-input"
                      placeholder="e.g. City Mall"
                      value={cinemaForm.location}
                      onChange={(e) => setCinemaForm({ ...cinemaForm, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-8">
                      <label className="form-label small text-secondary">Full Address</label>
                      <input
                        type="text"
                        className="form-control cinema-input"
                        value={cinemaForm.address}
                        onChange={(e) => setCinemaForm({ ...cinemaForm, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small text-secondary">City</label>
                      <input
                        type="text"
                        className="form-control cinema-input"
                        value={cinemaForm.city}
                        onChange={(e) => setCinemaForm({ ...cinemaForm, city: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCinemaModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-cinema">
                    Save Cinema
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
