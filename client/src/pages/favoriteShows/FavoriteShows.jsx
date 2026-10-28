import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Loader from "../../components/loader/Loader";
import { BiHeart, BiTrash, BiCalendar, BiTime } from "react-icons/bi";
import "./style.scss";

const FavoriteShows = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchFavorites = async () => {
    if (!user || !user.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/api/favorite/getfavorites/${encodeURIComponent(user.email)}`);
      if (res.data.success) {
        setFavorites(res.data.favorites || []);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      toast.error("Could not load your favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (movieId, movieName) => {
    try {
      const res = await api.post("/api/favorite/removefavorite", {
        userEmail: user.email,
        movieId,
      });
      if (res.data.success) {
        setFavorites(favorites.filter((f) => f.movieId !== movieId));
        toast.info(`Removed ${movieName || "movie"} from watchlist`);
      }
    } catch (err) {
      toast.error("Failed to remove from watchlist");
    }
  };

  return (
    <div className="favorites-page-container">
      <Header />

      <main className="favorites-main-content">
        <h1 className="brand-title">
          Your <span className="red">Watchlist</span>
        </h1>

        {loading ? (
          <Loader />
        ) : !user ? (
          <div className="empty-box">
            <BiHeart size={48} color="#e50914" />
            <p>Please login to view your saved watchlist.</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="empty-box">
            <BiHeart size={48} color="#94a3b8" />
            <p>Your watchlist is currently empty. Browse movies to add your favorites!</p>
            <button onClick={() => navigate("/home")} className="btn-imovies-primary">
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((fav) => {
              const movie = fav.movieData || {};
              return (
                <div key={fav._id} className="favorite-card">
                  <div className="poster-container">
                    <img
                      src={movie.media || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800"}
                      alt={movie.movieName || "Movie Poster"}
                      className="poster-img"
                    />
                    <button
                      className="remove-fav-btn"
                      onClick={() => handleRemoveFavorite(fav.movieId, movie.movieName)}
                      title="Remove from Watchlist"
                    >
                      <BiTrash size={16} />
                    </button>
                  </div>

                  <div className="fav-info">
                    <h3 className="movie-title">{movie.movieName || "Movie"}</h3>
                    <div className="meta-row">
                      <span>{movie.runtime || "150 min"}</span>
                      <span>★ {movie.rating || 8.5}/10</span>
                    </div>
                    <button
                      className="btn-book"
                      onClick={() => navigate(`/movieshows/${encodeURIComponent(movie.movieName || "")}`)}
                    >
                      Book Tickets
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FavoriteShows;
