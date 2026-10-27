import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = ({ movie }) => {
  if (!movie) return null;

  const durationHours = Math.floor(movie.duration / 60);
  const durationMins = movie.duration % 60;

  return (
    <div
      className="position-relative w-100 overflow-hidden mb-5"
      style={{
        minHeight: '75vh',
        background: `linear-gradient(to right, #090a0d 0%, rgba(9, 10, 13, 0.85) 45%, rgba(9, 10, 13, 0.25) 100%), linear-gradient(to top, #090a0d 0%, transparent 60%), url(${movie.bannerUrl || movie.posterUrl}) center/cover no-repeat`,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="container py-5 my-4">
        <div className="row align-items-center">
          <div className="col-lg-8 col-xl-7">
            {/* Top Tag */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge bg-danger text-white px-3 py-2 text-uppercase fw-bold" style={{ letterSpacing: '0.1em' }}>
                <i className="bi bi-fire me-1"></i> Featured Premiere
              </span>
              <span className="badge bg-dark border border-secondary text-light px-3 py-2">
                <i className="bi bi-star-fill text-warning me-1"></i> {movie.rating?.toFixed(1) || '8.9'} Rating
              </span>
              <span className="badge bg-dark border border-secondary text-secondary px-2 py-1">
                {movie.ageRating || 'UA'}
              </span>
            </div>

            {/* Movie Title */}
            <h1 className="display-4 fw-black text-white text-uppercase brand-font mb-3" style={{ lineHeight: 1.1 }}>
              {movie.title}
            </h1>

            {/* Metadata */}
            <div className="d-flex flex-wrap align-items-center gap-3 text-secondary mb-3 small">
              <span className="text-light">
                <i className="bi bi-clock text-danger me-1"></i> {durationHours}h {durationMins}m
              </span>
              <span>&bull;</span>
              <span className="text-light">
                <i className="bi bi-translate text-danger me-1"></i> {movie.language?.join(', ')}
              </span>
              <span>&bull;</span>
              <span className="text-light">
                <i className="bi bi-person-video text-danger me-1"></i> Dir: {movie.director}
              </span>
            </div>

            {/* Genres */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              {movie.genre?.map((g, idx) => (
                <span
                  key={idx}
                  className="badge bg-secondary bg-opacity-25 border border-secondary border-opacity-50 text-white px-3 py-2"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="lead text-light text-opacity-75 mb-4 line-clamp-3" style={{ maxWidth: '640px', fontSize: '1.05rem' }}>
              {movie.description}
            </p>

            {/* CTA Buttons */}
            <div className="d-flex flex-wrap gap-3">
              <Link to={`/movies/${movie._id}`} className="btn btn-cinema btn-lg px-4 py-3">
                <i className="bi bi-ticket-perforated-fill fs-5"></i> Book Tickets Now
              </Link>
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-cinema btn-lg px-4 py-3"
                >
                  <i className="bi bi-play-circle fs-5"></i> Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
