import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import { BiTrash, BiImageAdd } from "react-icons/bi";
import "./style.scss";

const AddMovie = () => {
  const [formData, setFormData] = useState({
    movieName: "",
    description: "",
    genres: "",
    releaseDate: "",
    runtime: "",
    certification: "UA",
    trailerUrl: "",
    media: "",
  });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMovies, setFetchingMovies] = useState(true);

  const fetchMovies = async () => {
    try {
      setFetchingMovies(true);
      const res = await api.get("/api/movie");
      if (res.data.success) {
        setMovies(res.data.movies || []);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setFetchingMovies(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.movieName || !formData.description) {
      toast.error("Please fill in the required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/movie/addmovie", formData);
      if (res.data.success) {
        toast.success("Movie added successfully!");
        setFormData({
          movieName: "",
          description: "",
          genres: "",
          releaseDate: "",
          runtime: "",
          certification: "UA",
          trailerUrl: "",
          media: "",
        });
        fetchMovies();
      }
    } catch (err) {
      console.error("Add Movie Error:", err);
      toast.error(err.response?.data?.error || "Failed to add movie");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (id, movieName) => {
    if (!window.confirm(`Delete movie ${movieName}?`)) return;

    try {
      const res = await api.delete(`/api/movie/deletemovie/${id}`);
      if (res.data.success) {
        toast.info("Movie deleted successfully");
        setMovies(movies.filter((m) => m._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete movie");
    }
  };

  return (
    <div className="add-movie-page-container">
      <Header isAdminView={true} />

      <main className="add-movie-main-content">
        {/* Add Movie Form matching Screenshot 50 */}
        <div className="add-movie-form-card">
          {/* Media / Poster preview box with red border matching Screenshot 50 */}
          <div className="poster-preview-box">
            {formData.media ? (
              <img src={formData.media} alt="Preview" className="poster-preview-img" />
            ) : (
              <div className="empty-preview">
                <BiImageAdd size={36} color="#e50914" />
                <span className="preview-hint">Enter poster URL or image below</span>
              </div>
            )}
          </div>

          <h2 className="add-movie-title">
            Add <span className="red">Movie</span>
          </h2>

          <form onSubmit={handleSubmit} className="movie-form-grid">
            {/* Left Column */}
            <div className="form-col-left">
              <div className="form-group">
                <label>Movie</label>
                <input
                  type="text"
                  name="movieName"
                  placeholder="Enter movie name"
                  value={formData.movieName}
                  onChange={handleChange}
                  className="imovies-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Genres</label>
                <input
                  type="text"
                  name="genres"
                  placeholder="Enter movie genres sep..."
                  value={formData.genres}
                  onChange={handleChange}
                  className="imovies-input"
                />
              </div>

              <div className="form-group">
                <label>Runtime</label>
                <input
                  type="text"
                  name="runtime"
                  placeholder="Enter runtime in minute"
                  value={formData.runtime}
                  onChange={handleChange}
                  className="imovies-input"
                />
              </div>

              <div className="form-group">
                <label>Trailer URL (YouTube)</label>
                <input
                  type="text"
                  name="trailerUrl"
                  placeholder="https://www.youtube.com/..."
                  value={formData.trailerUrl}
                  onChange={handleChange}
                  className="imovies-input"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="form-col-right">
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Enter movie description"
                  value={formData.description}
                  onChange={handleChange}
                  className="imovies-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Release Date</label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="imovies-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Certification</label>
                <input
                  type="text"
                  name="certification"
                  placeholder="Enter movie certification"
                  value={formData.certification}
                  onChange={handleChange}
                  className="imovies-input"
                />
              </div>

              <div className="form-group">
                <label>Poster Image URL</label>
                <input
                  type="text"
                  name="media"
                  placeholder="e.g. /posters/rrr.jpg or https://..."
                  value={formData.media}
                  onChange={handleChange}
                  className="imovies-input"
                />
              </div>
            </div>

            <div className="form-actions span-2">
              <button type="submit" className="btn-submit-movie" disabled={loading}>
                {loading ? "Adding Movie..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Available Movies Bar & Grid (matching Screenshot 50) */}
        <div className="available-movies-section">
          <div className="available-movies-ribbon">
            <h2>Available Movies</h2>
          </div>

          {fetchingMovies ? (
            <Loader />
          ) : (
            <div className="admin-movie-grid">
              {movies.map((movie) => (
                <div key={movie._id} className="admin-movie-card">
                  <div className="poster-box">
                    <img
                      src={
                        movie.media ||
                        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800"
                      }
                      alt={movie.movieName}
                      className="admin-movie-img"
                    />
                    <button
                      className="delete-movie-icon"
                      onClick={() => handleDeleteMovie(movie._id, movie.movieName)}
                      title="Delete Movie"
                    >
                      <BiTrash size={16} />
                    </button>
                  </div>
                  <div className="info-box">
                    <h4>{movie.movieName}</h4>
                    <span className="date-tag">
                      {movie.releaseDate
                        ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Available"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddMovie;
