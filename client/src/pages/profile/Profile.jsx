import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import { BiUser, BiEnvelope, BiPhone, BiEdit, BiLogOut } from "react-icons/bi";
import { IoTicketOutline } from "react-icons/io5";
import "./style.scss";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/auth/getuser", {
          headers: { "auth-token": token },
        });
        if (res.data.success) {
          setProfileData(res.data.user);
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const user = profileData || storedUser;

  return (
    <div className="profile-page-container">
      <Header />

      <main className="profile-main-content">
        <h1 className="brand-title">
          User <span className="red">Profile</span>
        </h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="profile-card">
            <div className="profile-avatar-circle">
              <BiUser size={56} color="#e50914" />
            </div>

            <h2 className="profile-username">{user.username || "Movie Fan"}</h2>
            <span className="profile-badge">{user.role || "Standard User"}</span>

            <div className="profile-details-list">
              <div className="detail-row">
                <span className="detail-label">
                  <BiEnvelope size={16} /> Email Address
                </span>
                <span className="detail-val">{user.email || "user@example.com"}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">
                  <BiPhone size={16} /> Phone Number
                </span>
                <span className="detail-val">{user.phoneNumber || "Not provided"}</span>
              </div>
            </div>

            <div className="profile-actions-grid">
              <Link to="/edituserdetails" className="btn-profile-action edit-btn">
                <BiEdit size={18} /> Edit Profile
              </Link>
              <Link to="/bookings" className="btn-profile-action">
                View My Bookings
              </Link>
              <Link to="/favorites" className="btn-profile-action">
                View Watchlist
              </Link>
              <button onClick={handleLogout} className="btn-profile-action logout-btn">
                <BiLogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
