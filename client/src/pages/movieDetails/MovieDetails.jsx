import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import { BiCalendar, BiTime, BiStar, BiHeart, BiSolidHeart, BiArrowBack } from "react-icons/bi";
import "./style.scss";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 9, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/movie/getmovie/${id}`);
      if (res.data.success) {
        setMovie(res.data.movie);
      }

      // Fetch reviews
      const reviewsRes = await api.get(`/api/review/getreviews/${id}`);
      if (reviewsRes.data.success) {
        setReviews(reviewsRes.data.reviews || []);
      }

      // Check favorite
      if (user && user.email) {
        const favRes = await api.get(`/api/favorite/getfavorites/${user.email}`);
        if (favRes.data.success) {
          setIsFavorited(favRes.data.favorites.some((f) => f.movieId === id));
        }
      }
    } catch (err) {
      console.error("Error fetching movie details:", err);
      toast.error("Could not load movie details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!user || !user.email) {
      toast.info("Please login to save to your watchlist");
      return;
    }

    try {
      if (isFavorited) {
        await api.post("/api/favorite/removefavorite", {
          userEmail: user.email,
          movieId: id,
        });
        setIsFavorited(false);
        toast.info("Removed from watchlist");
      } else {
        await api.post("/api/favorite/addfavorite", {
          userEmail: user.email,
          movieId: id,
          movieData: movie,
        });
        setIsFavorited(true);
        toast.success("Added to watchlist");
      }
    } catch (error) {
      toast.error("Failed to update watchlist");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.email) {
      toast.info("Please log in to leave a review");
      navigate("/login");
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Please enter your review comment");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post("/api/review/addreview", {
        movieId: id,
        userEmail: user.email,
        username: user.username,
        rating: Number(newReview.rating),
        comment: newReview.comment,
      });

      if (res.data.success) {
        toast.success("Thank you for your review!");
        setReviews([res.data.review, ...reviews]);
        setNewReview({ rating: 9, comment: "" });
      }
    } catch (err) {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="movie-details-page">
        <Header />
        <Loader />
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-page">
        <Header />
        <div className="not-found-container">
          <h2>Movie Not Found</h2>
          <Link to="/home" className="btn-imovies-primary">
            Back to Movies
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Coming Soon";

  // Embeddable YouTube URL helper
  const getEmbedTrailerUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getEmbedTrailerUrl(movie.trailerUrl);

  return (
    <div className="movie-details-page">
      <Header />

      <main className="movie-details-main">
        <button onClick={() => navigate(-1)} className="back-btn">
          <BiArrowBack size={18} /> Back
        </button>

        {/* Hero Section */}
        <div className="movie-hero-card">
          <div className="poster-col">
            <img src={movie.media} alt={movie.movieName} className="details-poster" />
          </div>

          <div className="info-col">
            <div className="title-row">
              <h1 className="movie-heading">{movie.movieName}</h1>
              <button
                className={`fav-button ${isFavorited ? "active" : ""}`}
                onClick={handleToggleFavorite}
                title={isFavorited ? "Remove from watchlist" : "Add to watchlist"}
              >
                {isFavorited ? <BiSolidHeart size={24} color="#e50914" /> : <BiHeart size={24} />}
              </button>
            </div>

            <div className="meta-badges">
              <span className="badge-cert">{movie.certification || "UA"}</span>
              <span className="badge-meta">
                <BiTime size={15} /> {movie.runtime || "150 min"}
              </span>
              <span className="badge-meta">
                <BiCalendar size={15} /> {formattedDate}
              </span>
              <span className="badge-rating">
                <BiStar size={16} color="#f5c518" /> {movie.rating || 8.5}/10
              </span>
            </div>

            <div className="genres-list">
              {movie.genres &&
                movie.genres.map((g, idx) => (
                  <span key={idx} className="genre-tag">
                    {g}
                  </span>
                ))}
            </div>

            <div className="description-box">
              <h3>Synopsis</h3>
              <p>{movie.description}</p>
            </div>

            {movie.cast && movie.cast.length > 0 && (
              <div className="cast-box">
                <h4>Starring:</h4>
                <p>{Array.isArray(movie.cast) ? movie.cast.join(", ") : movie.cast}</p>
              </div>
            )}

            <div className="hero-cta">
              <button
                className="btn-imovies-primary book-now-btn"
                onClick={() => navigate(`/movieshows/${encodeURIComponent(movie.movieName)}`)}
              >
                Book Tickets Now
              </button>
            </div>
          </div>
        </div>

        {/* Trailer Video Section */}
        {embedUrl && (
          <div className="trailer-section">
            <h2 className="section-title">
              Official <span className="red-text">Trailer</span>
            </h2>
            <div className="trailer-video-wrapper">
              <iframe
                src={embedUrl}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2 className="section-title">
            Audience <span className="red-text">Reviews</span> ({reviews.length})
          </h2>

          <div className="add-review-card">
            <h3>Leave a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="rating-select-row">
                <label>Your Rating:</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                  className="imovies-input rating-dropdown"
                >
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      ★ {num} / 10
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Write your honest movie review here..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="imovies-input review-textarea"
                rows="3"
                required
              ></textarea>

              <button type="submit" className="btn-imovies-primary" disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="review-card">
                  <div className="review-header">
                    <span className="reviewer-name">{r.username || r.userEmail}</span>
                    <span className="review-rating">★ {r.rating}/10</span>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                  <span className="review-date">
                    {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;
