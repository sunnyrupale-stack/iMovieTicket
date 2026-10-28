import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./style.scss";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast.error("Please fill in both email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", credentials);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Welcome back! Login successful");
        navigate("/home");
      } else {
        toast.error(response.data.error || "Login failed");
      }
    } catch (error) {
      if (!error.response) {
        toast.error("Cannot connect to server. Please check that the backend is running on port 3000.");
      } else {
        toast.error(error.response.data?.error || "Invalid email or password");
      }
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
        <h3 className="auth-subtitle">Login</h3>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
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
              placeholder="Enter your password"
              value={credentials.password}
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
            {loading ? "Authenticating..." : "Submit"}
          </button>
        </form>

        <div className="auth-footer-links">
          <p>
            Create an account? <Link to="/register">Register</Link>
          </p>
          <p className="admin-switch">
            <Link to="/admin/login">Login as Admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
