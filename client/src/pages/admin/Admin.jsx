import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import { BiTrash, BiPlusCircle, BiCalendarEvent, BiBuilding, BiFilm, BiMoney } from "react-icons/bi";
import "./style.scss";

const Admin = () => {
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const adminToken = localStorage.getItem("adminToken");

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const headers = { "auth-token": adminToken };

      const [showsRes, bookingsRes, statsRes] = await Promise.all([
        axios.get("/api/shows/getallshows"),
        axios.get("/api/bookings/allbookings"),
        axios.get("/api/auth/admin/stats", { headers }).catch(() => ({ data: { stats: null } })),
      ]);

      if (showsRes.data.success) {
        setShows(showsRes.data.shows || []);
      }
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings || []);
      }
      if (statsRes.data?.stats) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error("Admin Data Error:", err);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const formatSeats = (data) => {
    if (!data) return "Standard";
    if (data.seatsByTier && typeof data.seatsByTier === "object") {
      const parts = [];
      if (data.seatsByTier.balcony?.length) parts.push(`Balcony: ${data.seatsByTier.balcony.join(", ")}`);
      if (data.seatsByTier.middle?.length) parts.push(`Middle: ${data.seatsByTier.middle.join(", ")}`);
      if (data.seatsByTier.lower?.length) parts.push(`Lower: ${data.seatsByTier.lower.join(", ")}`);
      if (parts.length > 0) return parts.join(" • ");
    }
    return Array.isArray(data.seats) ? data.seats.join(", ") : data.seats || "Standard";
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCancelShow = async (id, movieName) => {
    if (!window.confirm(`Cancel show for ${movieName}? All attached customer bookings will also be marked as Cancelled and seats released.`)) return;

    try {
      const res = await axios.put(`/api/shows/cancelshow/${id}`);
      if (res.data.success) {
        toast.info("Show marked as Cancelled and customer bookings updated");
        setShows((prev) =>
          prev.map((s) => (s._id === id || s.showId === id ? { ...s, status: "Cancelled" } : s))
        );
        // Refresh bookings to reflect cancellations
        const bRes = await axios.get("/api/bookings/allbookings");
        if (bRes.data.success) setBookings(bRes.data.bookings || []);
      }
    } catch (err) {
      toast.error("Failed to cancel show");
    }
  };

  const handleDeleteShow = async (id, movieName) => {
    if (!window.confirm(`Delete show for ${movieName} permanently?`)) return;

    try {
      const res = await axios.delete(`/api/shows/deleteshow/${id}`);
      if (res.data.success) {
        toast.info("Show deleted successfully");
        setShows(shows.filter((s) => s._id !== id && s.showId !== id));
      }
    } catch (err) {
      toast.error("Failed to delete show");
    }
  };

  return (
    <div className="admin-page-container">
      <Header isAdminView={true} />

      <main className="admin-main-content">
        {/* Quick Admin Actions Bar */}
        <div className="admin-actions-bar">
          <Link to="/admin/addmovie" className="btn-admin-nav">
            <BiPlusCircle size={18} /> Add Movie
          </Link>
          <Link to="/admin/addtheatre" className="btn-admin-nav">
            <BiBuilding size={18} /> Add Theatre
          </Link>
          <Link to="/admin/addshow" className="btn-admin-nav">
            <BiCalendarEvent size={18} /> Add Show
          </Link>
          <Link to="/admin/bookings" className="btn-admin-nav">
            All Bookings ({bookings.length})
          </Link>
        </div>

        {/* Dashboard Stats */}
        {stats && (
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">Total Movies</span>
              <span className="stat-val">{stats.totalMovies}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Active Shows</span>
              <span className="stat-val">{shows.filter((s) => s.status !== "Cancelled").length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Theatres</span>
              <span className="stat-val">{stats.totalTheatres}</span>
            </div>
            <div className="stat-card revenue">
              <span className="stat-label">Confirmed Revenue</span>
              <span className="stat-val">
                ₹{bookings
                  .filter((b) => b.status !== "Cancelled" && b.paymentStatus !== "Cancelled")
                  .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0)}
              </span>
            </div>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Admin Shows Section (matching Screenshot 49) */}
            <section className="admin-section">
              <h2 className="section-heading">
                Admin <span className="red">Shows</span>
              </h2>

              {shows.length === 0 ? (
                <p className="no-items">No active shows scheduled. Click "Add Show" to create one.</p>
              ) : (
                <div className="shows-cards-grid">
                  {shows.map((show) => {
                    const isShowCancelled = show.status === "Cancelled";

                    return (
                      <div
                        key={show._id || show.showId}
                        className={`admin-show-card ${isShowCancelled ? "show-cancelled" : ""}`}
                      >
                        <div className="card-top-icon">
                          <BiFilm size={20} color={isShowCancelled ? "#94a3b8" : "#e50914"} />
                        </div>
                        <div className="show-info">
                          <p>
                            <strong>Movie:</strong> {show.movieId}
                          </p>
                          <p>
                            <strong>Theatre:</strong> {show.theatreName}
                          </p>
                          <p>
                            <strong>Showdate:</strong> {show.showDate}
                          </p>
                          <p>
                            <strong>Showtime:</strong> {show.showtime}
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            <span className={`show-status-tag ${isShowCancelled ? "cancelled" : "active"}`}>
                              {show.status || "Active"}
                            </span>
                          </p>
                        </div>
                        <div className="card-bottom-actions">
                          {!isShowCancelled && (
                            <button
                              className="btn-cancel-show"
                              onClick={() => handleCancelShow(show._id || show.showId, show.movieId)}
                              title="Cancel Show"
                            >
                              Cancel Show
                            </button>
                          )}
                          <button
                            className="btn-trash-action"
                            onClick={() => handleDeleteShow(show._id || show.showId, show.movieId)}
                            title="Delete Show"
                          >
                            <BiTrash size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* All Bookings Section (matching Screenshot 49) */}
            <section className="admin-section">
              <div className="section-header-flex">
                <h2 className="section-heading">
                  All <span className="red">Bookings</span>
                </h2>
                <Link to="/admin/bookings" className="view-all-link">
                  View Full Table ({bookings.length}) →
                </Link>
              </div>

              {bookings.length === 0 ? (
                <p className="no-items">No customer bookings recorded yet.</p>
              ) : (
                <div className="admin-bookings-list">
                  {bookings.slice(0, 10).map((b) => {
                    const isCancelled =
                      b.status === "Cancelled" || b.paymentStatus === "Cancelled";

                    return (
                      <div
                        key={b._id}
                        className={`admin-booking-row ${isCancelled ? "booking-cancelled" : ""}`}
                      >
                        <div className="booking-col">
                          <span className="user-email-tag">{b.userEmail}</span>
                          <span className="booking-id-tag">ID: {b.bookingId}</span>
                        </div>
                        <div className="booking-col">
                          <span className="movie-tag">{b.ticketsData?.movieName || "Movie"}</span>
                          <span className="theatre-tag">{b.ticketsData?.theatreName}</span>
                        </div>
                        <div className="booking-col">
                          <span>
                            {b.ticketsData?.showDate} • {b.ticketsData?.showtime}
                          </span>
                          <span className="seats-tag">
                            Seats: {formatSeats(b.ticketsData)}
                          </span>
                        </div>
                        <div className="booking-col right">
                          <span className="amount-tag">₹{b.totalAmount}</span>
                          <span className={`status-badge ${isCancelled ? "cancelled" : "confirmed"}`}>
                            {isCancelled ? "Cancelled" : "Confirmed"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
