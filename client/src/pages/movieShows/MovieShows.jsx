import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import "./style.scss";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import useFetch from "../../hooks/useFetch";
import { BiCameraMovie, BiCalendar, BiBuilding, BiTime } from "react-icons/bi";
import { TbMovieOff } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";

const MovieShows = () => {
  const navigate = useNavigate();
  const { movieName } = useParams();
  const { resData, loading, error } = useFetch(
    `/api/shows/getmovieshows/${encodeURIComponent(movieName)}`
  );

  const [selectedDate, setSelectedDate] = useState("");

  const showsData = useMemo(() => {
    const list = resData?.data?.showData || resData?.showData || [];
    return [...list].sort(function (a, b) {
      const dateA = new Date(a.showDate || a.showdate);
      const dateB = new Date(b.showDate || b.showdate);
      return dateA - dateB;
    });
  }, [resData]);

  // Unique available dates
  const availableDates = useMemo(() => {
    const dates = showsData.map((s) => s.showDate || s.showdate);
    return Array.from(new Set(dates));
  }, [showsData]);

  // Set default selected date once loaded
  React.useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates]);

  // Filter shows by selected date
  const filteredShows = useMemo(() => {
    if (!selectedDate) return showsData;
    return showsData.filter((s) => (s.showDate || s.showdate) === selectedDate);
  }, [showsData, selectedDate]);

  // Group shows by Theatre
  const showsByTheatre = useMemo(() => {
    const grouped = {};
    filteredShows.forEach((show) => {
      const theatre = show.theatreName || "Cinema Hall";
      if (!grouped[theatre]) {
        grouped[theatre] = [];
      }
      grouped[theatre].push(show);
    });
    return grouped;
  }, [filteredShows]);

  const convertTo12HourFormat = (time24) => {
    if (!time24) return "";
    if (time24.includes("AM") || time24.includes("PM")) return time24;
    const [hours, minutes] = time24.split(":");
    let h = parseInt(hours, 10);
    const m = minutes || "00";
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  return (
    <div className="movie-shows-page">
      <Header />

      <main className="movie-shows-main">
        <div className="movie-shows-header">
          <h1 className="movie-title">
            Select Show for <span className="red-accent">{decodeURIComponent(movieName)}</span>
          </h1>
          <p className="subtitle">Pick a date and cinema hall to choose your seats</p>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="error-message">
            <TbMovieOff size={48} color="#e50914" />
            <p>Could not find active shows for this movie.</p>
            <button onClick={() => navigate("/home")} className="btn-imovies-outline">
              Browse Other Movies
            </button>
          </div>
        ) : showsData.length === 0 ? (
          <div className="no-shows-found">
            <TbMovieOff size={48} color="#94a3b8" />
            <p>No showtimes currently scheduled for {decodeURIComponent(movieName)}.</p>
            <button onClick={() => navigate("/home")} className="btn-imovies-primary">
              View Available Movies
            </button>
          </div>
        ) : (
          <>
            {/* Date Picker Bar */}
            <div className="date-selector-bar">
              {availableDates.map((d) => {
                const dateObj = new Date(d);
                const dayName = isNaN(dateObj) ? "Day" : dateObj.toLocaleDateString("en-US", { weekday: "short" });
                const dayNum = isNaN(dateObj) ? d : dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

                return (
                  <button
                    key={d}
                    className={`date-pill ${selectedDate === d ? "active" : ""}`}
                    onClick={() => setSelectedDate(d)}
                  >
                    <span className="day-name">{dayName}</span>
                    <span className="day-num">{dayNum}</span>
                  </button>
                );
              })}
            </div>

            {/* Theatres & Showtimes */}
            <div className="theatres-list">
              {Object.keys(showsByTheatre).map((theatreName) => (
                <div key={theatreName} className="theatre-show-card">
                  <div className="theatre-info">
                    <h3 className="theatre-name">
                      <BiBuilding size={20} color="#e50914" />
                      {theatreName}
                    </h3>
                    <span className="theatre-tag">Dolby 7.1 • 4K Laser</span>
                  </div>

                  <div className="showtimes-grid">
                    {showsByTheatre[theatreName].map((show) => (
                      <button
                        key={show.showId || show._id}
                        className="showtime-btn"
                        onClick={() => navigate(`/seats/${show.showId || show._id}`)}
                      >
                        <span className="time-text">
                          <BiTime size={14} />
                          {convertTo12HourFormat(show.showtime)}
                        </span>
                        <span className="pricing-preview">
                          From ₹{show.tickets?.lower?.price || 120}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MovieShows;
