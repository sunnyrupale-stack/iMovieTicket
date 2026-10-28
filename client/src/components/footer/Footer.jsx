import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const Footer = () => {
  return (
    <footer className="imovies-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-i">i</span>
            <span className="brand-movies">Movies</span>
            <p className="brand-tagline">Movie ticket booking made simple.</p>
          </div>
          <div className="footer-links">
            <Link to="/home">Browse Movies</Link>
            <Link to="/bookings">My Bookings</Link>
            <Link to="/favorites">Watchlist</Link>
            <Link to="/admin/login">Admin Portal</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} iMovies. Developed for MERN Stack Full Stack Development Project.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
