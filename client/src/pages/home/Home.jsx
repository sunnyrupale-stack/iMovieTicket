import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import { BiCalendar, BiInfoCircle, BiX, BiPlay, BiTime, BiStar, BiHeart, BiSolidHeart } from "react-icons/bi";
import "./style.scss";

const GENRES = ["All", "Action", "Drama", "Thriller", "Sci-Fi", "Mythology", "Comedy", "History", "Adventure", "Fantasy", "Horror"];

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [activeModalMovie, setActiveModalMovie] = useState(null);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const navigate = useNavigate();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `/api/movie?search=${encodeURIComponent(searchQuery)}`
        : `/api/movie`;
      const response = await api.get(url);
      if (response.data.success) {
        setMovies(response.data.movies || []);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Could not load movies");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.email) return;
    try {
      const res = await api.get(`/api/favorite/getfavorites/${encodeURIComponent(user.email)}`);
      if (res.data.success && res.data.favorites) {
        setFavoriteMovieIds(res.data.favorites.map((f) => f.movieId));
      }
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchUserFavorites();
  }, [searchQuery]);

  const handleToggleWishlist = async (movie) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.email) {
      toast.info("Please login to add movies to your wishlist");
      navigate("/login");
      return;
    }

    const isFav = favoriteMovieIds.includes(movie._id);
    try {
      if (isFav) {
        await api.post("/api/favorite/removefavorite", {
          userEmail: user.email,
          movieId: movie._id,
        });
        setFavoriteMovieIds((prev) => prev.filter((id) => id !== movie._id));
        toast.info(`Removed "${movie.movieName}" from your watchlist`);
      } else {
        await api.post("/api/favorite/addfavorite", {
          userEmail: user.email,
          movieId: movie._id,
          movieData: movie,
        });
        setFavoriteMovieIds((prev) => [...prev, movie._id]);
        toast.success(`Added "${movie.movieName}" to your watchlist!`);
      }
    } catch (err) {
      toast.error("Failed to update watchlist");
    }
  };

  const filteredMovies = movies.filter((movie) => {
    if (selectedGenre === "All") return true;
    return movie.genres && movie.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());
  });

  return (
    <div className="home-page-container">
      <Header />

      <main className="home-main-content">
        <div className="home-header-section">
          <h1 className="available-movies-title">
            Available <span className="red-accent">Movies</span>
          </h1>

          {/* Genre filter tags */}
          <div className="genre-filter-bar">
            {GENRES.map((genre) => (
              <button
                key={genre}
                className={`genre-pill ${selectedGenre === genre ? "active" : ""}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : filteredMovies.length === 0 ? (
          <div className="no-movies-found">
            <p>No movies available matching your selection.</p>
            {selectedGenre !== "All" && (
              <button onClick={() => setSelectedGenre("All")} className="btn-imovies-outline">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map((movie) => {
              const formattedDate = movie.releaseDate
                ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Coming Soon";

              const genreString = Array.isArray(movie.genres) ? movie.genres.join(", ") : movie.genres || "";

              return (
                <div
                  key={movie._id}
                  className="movie-card"
                  onClick={() => navigate(`/movieshows/${encodeURIComponent(movie.movieName)}`)}
                  title={`Book tickets for ${movie.movieName}`}
                >
                  <div className="poster-wrapper">
                    <img
                      src={movie.media || "/posters/og.jpg"}
                      alt={movie.movieName}
                      className="movie-poster"
                      loading="lazy"
                    />
                    <button
                      className={`wishlist-heart-btn ${favoriteMovieIds.includes(movie._id) ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(movie);
                      }}
                      title={
                        favoriteMovieIds.includes(movie._id)
                          ? "Remove from Watchlist"
                          : "Add to Watchlist"
                      }
                    >
                      {favoriteMovieIds.includes(movie._id) ? (
                        <BiSolidHeart size={15} color="#e50914" />
                      ) : (
                        <BiHeart size={15} />
                      )}
                    </button>
                    <button
                      className="info-circle-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalMovie(movie);
                      }}
                      title="View Movie Details"
                    >
                      <BiInfoCircle size={14} />
                    </button>
                  </div>

                  <div className="movie-info">
                    <h3 className="movie-title">{movie.movieName}</h3>
                    <div className="release-date">
                      <BiCalendar size={12} />
                      <span>{formattedDate}</span>
                    </div>
                    {genreString && (
                      <div className="genre-capsule-wrapper">
                        <span className="genre-capsule">{genreString}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Movie Details Modal (Screenshot 43 & 52) */}
        {activeModalMovie && (
          <div className="popup-overlay" onClick={() => setActiveModalMovie(null)}>
            <div className="movie-details-popup" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setActiveModalMovie(null)} aria-label="Close">
                <BiX size={22} />
              </button>

              <div className="popup-body">
                <div className="popup-poster-col">
                  <img
                    src={activeModalMovie.media || "/posters/og.jpg"}
                    alt={activeModalMovie.movieName}
                    className="popup-poster"
                  />
                </div>

                <div className="popup-info-col">
                  <h2 className="popup-title">{activeModalMovie.movieName}</h2>
                  
                  <div className="popup-meta-row">
                    <span className="popup-cert">{activeModalMovie.certification || "UA"}</span>
                    <span className="popup-runtime">
                      <BiTime size={14} /> {activeModalMovie.runtime || "160 min"}
                    </span>
                    <span className="popup-date">
                      <BiCalendar size={14} />{" "}
                      {activeModalMovie.releaseDate
                        ? new Date(activeModalMovie.releaseDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Coming Soon"}
                    </span>
                    {activeModalMovie.rating && (
                      <span className="popup-rating">
                        <BiStar size={14} color="#f5c518" /> {activeModalMovie.rating}/10
                      </span>
                    )}
                  </div>

                  <p className="popup-desc">{activeModalMovie.description}</p>

                  <div className="popup-genres">
                    <strong>Genres: </strong>
                    {Array.isArray(activeModalMovie.genres)
                      ? activeModalMovie.genres.join(", ")
                      : activeModalMovie.genres}
                  </div>

                  {activeModalMovie.cast && activeModalMovie.cast.length > 0 && (
                    <div className="popup-cast">
                      <strong>Cast: </strong>
                      {activeModalMovie.cast.join(", ")}
                    </div>
                  )}

                  <div className="popup-actions">
                    <button
                      className="btn-book-popup"
                      onClick={() => {
                        navigate(`/movieshows/${encodeURIComponent(activeModalMovie.movieName)}`);
                      }}
                    >
                      Book Tickets
                    </button>
                    <button
                      className={`btn-wishlist-popup ${
                        favoriteMovieIds.includes(activeModalMovie._id) ? "active" : ""
                      }`}
                      onClick={() => handleToggleWishlist(activeModalMovie)}
                      title={
                        favoriteMovieIds.includes(activeModalMovie._id)
                          ? "Remove from Watchlist"
                          : "Add to Watchlist"
                      }
                    >
                      {favoriteMovieIds.includes(activeModalMovie._id) ? (
                        <>
                          <BiSolidHeart size={17} color="#e50914" /> In Watchlist
                        </>
                      ) : (
                        <>
                          <BiHeart size={17} /> Add to Watchlist
                        </>
                      )}
                    </button>
                    {activeModalMovie.trailerUrl && (
                      <a
                        href={activeModalMovie.trailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-trailer-popup"
                      >
                        <BiPlay size={18} /> Watch Trailer
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
