import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  BiMovie, 
  BiHeart, 
  BiUser, 
  BiLogOut, 
  BiSun, 
  BiSearch, 
  BiPlusCircle, 
  BiCalendarEvent, 
  BiBuilding 
} from "react-icons/bi";
import { IoTicketOutline } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import "./style.scss";

const Header = ({ onSearch, isAdminView = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/home?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    if (isAdminView || adminToken) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      navigate("/admin/login");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <header className="imovies-header">
      <div className="header-container">
        {/* Left: Brand Logo */}
        <Link to={isAdminView ? "/admin" : "/home"} className="brand-logo">
          <span className="brand-i">i</span>
          <span className="brand-movies">Movies</span>
        </Link>

        {/* Middle: Search bar (shown for users on home or movies) */}
        {!isAdminView && (
          <form className="header-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search movies by title, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn" title="Search">
              <BiSearch size={18} />
            </button>
          </form>
        )}

        {/* Right: Actions and Navigation Icons */}
        <nav className="header-nav-icons">
          {/* Theme switch simulation icon as shown in screenshot */}
          <button className="nav-icon-btn" title="Toggle Theme" onClick={() => {}}>
            <BiSun size={20} />
          </button>

          {isAdminView ? (
            /* Admin Header Actions (matching Screenshot 49 & 50) */
            <>
              <Link to="/admin" className={`nav-icon-btn ${location.pathname === "/admin" ? "active" : ""}`} title="Admin Dashboard">
                <BiMovie size={20} />
              </Link>
              <Link to="/admin/addmovie" className={`nav-icon-btn ${location.pathname === "/admin/addmovie" ? "active" : ""}`} title="Add Movie">
                <BiPlusCircle size={20} />
              </Link>
              <Link to="/admin/addtheatre" className={`nav-icon-btn ${location.pathname === "/admin/addtheatre" ? "active" : ""}`} title="Add Theatre">
                <BiBuilding size={20} />
              </Link>
              <Link to="/admin/addshow" className={`nav-icon-btn ${location.pathname === "/admin/addshow" ? "active" : ""}`} title="Add Show">
                <BiCalendarEvent size={20} />
              </Link>
              <Link to="/admin/bookings" className={`nav-icon-btn ${location.pathname === "/admin/bookings" ? "active" : ""}`} title="All Bookings">
                <IoTicketOutline size={20} />
              </Link>
              <button onClick={handleLogout} className="nav-icon-btn logout-btn" title="Logout Admin">
                <BiLogOut size={20} />
              </button>
            </>
          ) : (
            /* User Header Actions (matching Screenshot 52) */
            <>
              <Link to="/home" className={`nav-icon-btn ${location.pathname === "/home" ? "active" : ""}`} title="Home Movies">
                <BiMovie size={20} />
              </Link>
              <Link to="/favorites" className={`nav-icon-btn ${location.pathname === "/favorites" ? "active" : ""}`} title="Watchlist / Favorites">
                <BiHeart size={20} />
              </Link>
              <Link to="/bookings" className={`nav-icon-btn ${location.pathname === "/bookings" ? "active" : ""}`} title="My Bookings">
                <IoTicketOutline size={20} />
              </Link>
              <Link to="/profile" className={`nav-icon-btn ${location.pathname === "/profile" ? "active" : ""}`} title="My Profile">
                <BiUser size={20} />
              </Link>
              {adminToken && (
                <Link to="/admin" className="nav-icon-btn admin-badge" title="Go to Admin Panel">
                  <MdAdminPanelSettings size={20} color="#e50914" />
                </Link>
              )}
              {token ? (
                <button onClick={handleLogout} className="nav-icon-btn logout-btn" title="Logout">
                  <BiLogOut size={20} />
                </button>
              ) : (
                <Link to="/login" className="login-link-btn">
                  Sign In
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
