import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="pt-5 pb-4 mt-auto" style={{ background: '#08090c', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container">
        <div className="row g-4 pb-4 border-bottom border-secondary border-opacity-25">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
              <div
                className="d-flex align-items-center justify-content-center bg-danger rounded-3 text-white"
                style={{ width: '36px', height: '36px' }}
              >
                <i className="bi bi-film"></i>
              </div>
              <span className="fw-black brand-font fs-4 text-white">
                I<span className="text-danger">MOVIES</span>
              </span>
            </Link>
            <p className="text-secondary small pe-lg-4 mb-3">
              IMovies delivers a premier digital cinema experience. Discover upcoming blockbusters,
              explore real-time showtimes across luxury screens, and reserve your perfect seats in seconds.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Explore
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/movies" className="text-secondary text-decoration-none hover-white">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?status=upcoming" className="text-secondary text-decoration-none hover-white">
                  Upcoming Movies
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary text-decoration-none hover-white">
                  About IMovies
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-secondary text-decoration-none hover-white">
                  My Tickets
                </Link>
              </li>
            </ul>
          </div>

          {/* Cinema Technologies */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Screen Formats
            </h6>
            <div className="d-flex flex-column gap-2 small text-secondary">
              <span className="d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-danger"></i> IMAX with Laser 4K
              </span>
              <span className="d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-danger"></i> Dolby Atmos Sound Matrix
              </span>
              <span className="d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-danger"></i> 4DX Dynamic Motion
              </span>
              <span className="d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-danger"></i> VIP Luxury Recliners
              </span>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ letterSpacing: '0.05em' }}>
              Help & Concierge
            </h6>
            <p className="text-secondary small mb-2">
              <i className="bi bi-envelope me-2 text-danger"></i> support@imovies.com
            </p>
            <p className="text-secondary small mb-2">
              <i className="bi bi-telephone me-2 text-danger"></i> +1 (800) 466-8437 (IMOVIES)
            </p>
            <p className="text-secondary small mb-0">
              <i className="bi bi-geo-alt me-2 text-danger"></i> 742 Evergreen Promenade, NY
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 text-secondary small">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} <strong className="text-white">IMovies</strong>. All rights reserved.
          </p>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <span className="badge bg-secondary bg-opacity-25 text-light px-2 py-1">MERN Stack</span>
            <span className="badge bg-secondary bg-opacity-25 text-light px-2 py-1">Socket.IO Live</span>
            <span className="badge bg-secondary bg-opacity-25 text-light px-2 py-1">Bootstrap 5</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
