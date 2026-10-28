import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import { BiTrash, BiSearch } from "react-icons/bi";
import { IoTicketOutline } from "react-icons/io5";
import "./style.scss";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/bookings/allbookings");
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error("Error fetching all bookings:", err);
      toast.error("Could not load bookings list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(`Cancel booking ${bookingId} and release seats back to inventory?`)) return;

    try {
      const res = await axios.delete(`/api/bookings/cancelbooking/${bookingId}`);
      if (res.data.success) {
        toast.info("Booking cancelled and seats released");
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

  const handleDeletePermanently = async (bookingId) => {
    if (!window.confirm(`Permanently delete booking record ${bookingId}?`)) return;

    try {
      const res = await axios.delete(`/api/bookings/deletebooking/${bookingId}`);
      if (res.data.success) {
        toast.info("Booking permanently removed");
        setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
      }
    } catch (err) {
      toast.error("Failed to delete booking");
    }
  };

  const confirmedCount = bookings.filter(
    (b) => b.status !== "Cancelled" && b.paymentStatus !== "Cancelled"
  ).length;
  const cancelledCount = bookings.filter(
    (b) => b.status === "Cancelled" || b.paymentStatus === "Cancelled"
  ).length;

  const filtered = bookings.filter((b) => {
    const isCancelled = b.status === "Cancelled" || b.paymentStatus === "Cancelled";
    if (statusFilter === "confirmed" && isCancelled) return false;
    if (statusFilter === "cancelled" && !isCancelled) return false;

    const term = search.toLowerCase();
    const emailMatch = (b.userEmail || "").toLowerCase().includes(term);
    const movieMatch = (b.ticketsData?.movieName || "").toLowerCase().includes(term);
    const idMatch = (b.bookingId || "").toLowerCase().includes(term);
    return emailMatch || movieMatch || idMatch;
  });

  return (
    <div className="admin-bookings-page">
      <Header isAdminView={true} />

      <main className="admin-bookings-main">
        <div className="admin-header-flex">
          <h1 className="brand-title">
            All Customer <span className="red">Bookings</span>
          </h1>

          {/* Filter Tabs */}
          <div className="status-tabs-row">
            <button
              className={`status-tab-btn ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All ({bookings.length})
            </button>
            <button
              className={`status-tab-btn confirmed ${statusFilter === "confirmed" ? "active" : ""}`}
              onClick={() => setStatusFilter("confirmed")}
            >
              Confirmed ({confirmedCount})
            </button>
            <button
              className={`status-tab-btn cancelled ${statusFilter === "cancelled" ? "active" : ""}`}
              onClick={() => setStatusFilter("cancelled")}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>
        </div>

        <div className="search-filter-box">
          <BiSearch size={20} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by customer email, movie, or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="empty-box">
            <IoTicketOutline size={48} color="#94a3b8" />
            <p>No bookings found matching "{search}".</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer Email</th>
                  <th>Movie & Cinema</th>
                  <th>Showtime</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const isCancelled =
                    b.status === "Cancelled" || b.paymentStatus === "Cancelled";

                  return (
                    <tr key={b._id} className={isCancelled ? "row-cancelled" : ""}>
                      <td className="id-col">{b.bookingId}</td>
                      <td className="email-col">{b.userEmail}</td>
                      <td>
                        <strong>{b.ticketsData?.movieName || "Movie"}</strong>
                        <br />
                        <small className="muted">{b.ticketsData?.theatreName}</small>
                      </td>
                      <td>
                        {b.ticketsData?.showDate}
                        <br />
                        <small className="muted">{b.ticketsData?.showtime}</small>
                      </td>
                      <td>
                        {Array.isArray(b.ticketsData?.seats)
                          ? b.ticketsData.seats.join(", ")
                          : b.ticketsData?.seats}
                      </td>
                      <td className="amount-col">₹{b.totalAmount}</td>
                      <td>
                        {isCancelled ? (
                          <span className="status-pill cancelled">Cancelled</span>
                        ) : (
                          <span className="status-pill confirmed">Confirmed</span>
                        )}
                      </td>
                      <td>
                        {isCancelled ? (
                          <button
                            className="btn-trash-table"
                            onClick={() => handleDeletePermanently(b.bookingId)}
                            title="Delete Record Permanently"
                          >
                            <BiTrash size={16} />
                          </button>
                        ) : (
                          <button
                            className="btn-cancel-table"
                            onClick={() => handleCancelBooking(b.bookingId)}
                            title="Cancel Booking & Release Seats"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminBookings;
