import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./style.scss";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/admin/register", {
        username,
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.user));
        toast.success("Admin registered successfully!");
        navigate("/admin");
      } else {
        toast.error(response.data.error || "Admin registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2 className="auth-logo">
          <span className="logo-white">i</span>
          <span className="logo-red">Movies</span>
        </h2>
        <h3 className="auth-subtitle">Admin Registration</h3>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Admin Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Admin Username"
              value={formData.username}
              onChange={handleChange}
              className="imovies-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Admin Email"
              value={formData.email}
              onChange={handleChange}
              className="imovies-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password (min 8 chars)"
              value={formData.password}
              onChange={handleChange}
              className="imovies-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="imovies-input"
              required
            />
          </div>

          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>Show Password</span>
            </label>
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Registering Admin..." : "Submit"}
          </button>
        </form>

        <div className="auth-footer-links">
          <p>
            Already an Admin? <Link to="/admin/login">Admin Login</Link>
          </p>
          <p className="admin-switch">
            <Link to="/register">← Back to User Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
