import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top glass-nav py-3" style={{ zIndex: 1030 }}>
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div
            className="d-flex align-items-center justify-content-center bg-danger rounded-3 text-white shadow-sm"
            style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}
          >
            <i className="bi bi-film"></i>
          </div>
          <div>
            <span className="fw-black brand-font fs-4 text-white">
              I<span className="text-danger">MOVIES</span>
            </span>
            <small
              className="d-block text-secondary text-uppercase fw-semibold"
              style={{ fontSize: '0.65rem', letterSpacing: '0.12em', marginTop: '-4px' }}
            >
              Movie Ticket Booking
            </small>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-2 text-white"></i>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <i className="bi bi-house me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/movies">
                <i className="bi bi-camera-reels me-1"></i> Movies
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-bookings">
                  <i className="bi bi-ticket-perforated me-1"></i> My Bookings
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                <i className="bi bi-info-circle me-1"></i> About Us
              </NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link text-warning fw-bold" to="/admin">
                  <i className="bi bi-speedometer2 me-1"></i> Admin Panel
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Buttons */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 py-2 px-3 rounded-pill border-secondary"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-white fw-semibold small">{user?.name?.split(' ')[0]}</span>
                  {isAdmin && <span className="badge bg-warning text-dark ms-1">Admin</span>}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border-secondary"
                  aria-labelledby="userDropdown"
                  style={{ background: '#181b24', minWidth: '200px' }}
                >
                  <li className="px-3 py-2 border-bottom border-secondary mb-1">
                    <p className="mb-0 fw-bold text-white small">{user?.name}</p>
                    <p className="mb-0 text-secondary text-truncate" style={{ fontSize: '0.78rem' }}>
                      {user?.email}
                    </p>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item py-2" to="/admin">
                        <i className="bi bi-shield-lock me-2 text-warning"></i> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item py-2" to="/my-bookings">
                      <i className="bi bi-ticket-perforated me-2 text-danger"></i> My Bookings
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider border-secondary" />
                  </li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-cinema py-2 px-3 small">
                  <i className="bi bi-box-arrow-in-right"></i> Sign In
                </Link>
                <Link to="/register" className="btn btn-cinema py-2 px-3 small">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
