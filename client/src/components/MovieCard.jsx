import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  if (!movie) return null;

  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Coming Soon';

  const durationHours = Math.floor(movie.duration / 60);
  const durationMins = movie.duration % 60;
  const durationText = `${durationHours}h ${durationMins}m`;

  return (
    <div className="movie-card">
      {/* Poster Container */}
      <div className="movie-poster-wrap">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie-poster-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Rating Badge */}
        {movie.rating && (
          <div className="movie-rating-badge">
            <i className="bi bi-star-fill text-warning"></i>
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Status Badge */}
        <div className={`movie-status-badge ${movie.status === 'upcoming' ? 'bg-primary' : 'bg-danger'}`}>
          {movie.status === 'upcoming' ? 'Upcoming' : 'Now Showing'}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          {/* Genre Badges */}
          <div className="d-flex flex-wrap gap-1 mb-2">
            {movie.genre?.slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="badge bg-secondary bg-opacity-25 text-light text-uppercase"
                style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}
              >
                {g}
              </span>
            ))}
          </div>

          {/* Title */}
          <h5 className="text-white text-truncate mb-2 fw-bold" title={movie.title}>
            {movie.title}
          </h5>

          {/* Metadata Row */}
          <div className="d-flex align-items-center justify-content-between text-secondary small mb-3">
            <span className="d-flex align-items-center gap-1">
              <i className="bi bi-clock text-danger"></i> {durationText}
            </span>
            <span className="d-flex align-items-center gap-1">
              <i className="bi bi-translate text-danger"></i> {movie.language?.[0] || 'English'}
            </span>
          </div>

          <div className="text-secondary small mb-3">
            <i className="bi bi-calendar3 me-1 text-danger"></i> {formattedDate}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/movies/${movie._id}`}
          className="btn btn-cinema w-100 py-2 small"
        >
          <i className="bi bi-ticket-perforated"></i>{' '}
          {movie.status === 'upcoming' ? 'View Details' : 'Book Tickets'}
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
