import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import { BiCalendarEvent } from "react-icons/bi";
import "./style.scss";

const AddShow = () => {
  const [formData, setFormData] = useState({
    theatreName: "",
    movieId: "",
    showDate: "",
    showtime: "",
  });
  const [theatres, setTheatres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(true);

  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setFetchingOptions(true);
        const [theatresRes, moviesRes] = await Promise.all([
          axios.get("/api/theatre"),
          axios.get("/api/movie"),
        ]);
        if (theatresRes.data.success) {
          setTheatres(theatresRes.data.theatres || []);
        }
        if (moviesRes.data.success) {
          setMovies(moviesRes.data.movies || []);
        }
      } catch (err) {
        console.error("Error fetching options for show:", err);
      } finally {
        setFetchingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.theatreName || !formData.movieId || !formData.showDate || !formData.showtime) {
      toast.error("Please fill in all show fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/shows/addshow", {
        adminEmail: admin.email || "admin@imovies.com",
        theatreName: formData.theatreName,
        movieId: formData.movieId,
        showDate: formData.showDate,
        showtime: formData.showtime,
      });

      if (res.data.success) {
        toast.success("Showtime scheduled successfully!");
        setFormData({
          theatreName: "",
          movieId: "",
          showDate: "",
          showtime: "",
        });
      }
    } catch (err) {
      toast.error("Failed to add showtime");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-show-page-container">
      <Header isAdminView={true} />

      <main className="add-show-main-content">
        <h1 className="brand-title">
          Add <span className="red">Show</span>
        </h1>

        {fetchingOptions ? (
          <Loader />
        ) : (
          <div className="show-form-card">
            <form onSubmit={handleSubmit} className="show-form">
              <div className="form-group">
                <label>Theatres</label>
                <select
                  name="theatreName"
                  value={formData.theatreName}
                  onChange={handleChange}
                  className="imovies-input"
                  required
                >
                  <option value="">Select Theatre</option>
                  {theatres.map((t) => (
                    <option key={t._id} value={t.theatreName}>
                      {t.theatreName} ({t.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Movies</label>
                <select
                  name="movieId"
                  value={formData.movieId}
                  onChange={handleChange}
                  className="imovies-input"
                  required
                >
                  <option value="">Select Movie</option>
                  {movies.map((m) => (
                    <option key={m._id} value={m.movieName}>
                      {m.movieName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Show Date</label>
                <input
                  type="date"
                  name="showDate"
                  value={formData.showDate}
                  onChange={handleChange}
                  className="imovies-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Showtime</label>
                <input
                  type="time"
                  name="showtime"
                  value={formData.showtime}
                  onChange={handleChange}
                  className="imovies-input"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit-show" disabled={loading}>
                  {loading ? "Scheduling..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AddShow;
