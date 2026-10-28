import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const Landing = () => {
  return (
    <div className="landing-page-container">
      <div className="landing-overlay">
        <div className="landing-content">
          <h1 className="landing-title">
            Welcome to <span className="red-accent">iMovies</span>
          </h1>
          <p className="landing-subtitle">
            Your ultimate destination for the latest blockbusters and timeless classics
          </p>
          <div className="landing-actions">
            <Link to="/login" className="btn-signin">
              Sign In
            </Link>
            <Link to="/register" className="btn-signup">
              Sign Up
            </Link>
          </div>
          <div className="landing-admin-link">
            <Link to="/admin/login">Admin Portal Access →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
