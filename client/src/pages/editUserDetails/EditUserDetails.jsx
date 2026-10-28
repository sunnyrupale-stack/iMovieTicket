import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { BiArrowBack } from "react-icons/bi";
import "../profile/style.scss";

const EditUserDetails = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      setFormData({
        username: user.username || "",
        phoneNumber: user.phoneNumber || "",
        password: "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/api/auth/updateuser", formData, {
        headers: { "auth-token": token },
      });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Profile updated successfully!");
        navigate("/profile");
      }
    } catch (err) {
      console.error("Update Error:", err);
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <Header />

      <main className="profile-main-content">
        <button onClick={() => navigate(-1)} className="back-link">
          <BiArrowBack size={18} /> Back to Profile
        </button>

        <div className="profile-card edit-card">
          <h2 className="brand-title">
            Edit <span className="red">Details</span>
          </h2>

          <form onSubmit={handleSubmit} className="edit-user-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="imovies-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="e.g. +91 9876543210"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="imovies-input"
              />
            </div>

            <div className="form-group">
              <label>New Password (Optional)</label>
              <input
                type="password"
                name="password"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={handleChange}
                className="imovies-input"
              />
            </div>

            <div className="actions-row">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-imovies-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditUserDetails;
