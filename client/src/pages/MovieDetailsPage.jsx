import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShow, setSelectedShow] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate date options (today + next 3 days)
  const [dateOptions, setDateOptions] = useState([]);

  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const label =
        i === 0
          ? 'Today'
          : i === 1
          ? 'Tomorrow'
          : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dates.push({ iso, label, fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
    }
    setDateOptions(dates);
    setSelectedDate(dates[0].iso);
  }, []);

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      setLoading(true);
      try {
        const [movieRes, showsRes, cinemasRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/movies/${id}/shows`),
          api.get('/cinemas'),
        ]);

        const movieData = movieRes.data?.data;
        const showsData = showsRes.data?.data || [];
        const cinemasData = cinemasRes.data?.data || [];

        setMovie(movieData);
        setShows(showsData);
        setCinemas(cinemasData);

        if (cinemasData.length > 0) {
          setSelectedCinemaId(cinemasData[0]._id);
        }
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 my-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading movie details...</span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-white">Movie not found</h3>
        <Link to="/movies" className="btn btn-cinema mt-3">
          Back to Movies
        </Link>
      </div>
    );
  }

  // Filter shows by selected cinema and date
  const filteredShows = shows.filter((s) => {
    const cinemaMatch = !selectedCinemaId || s.cinemaId?._id === selectedCinemaId;
    const dateMatch = !selectedDate || s.showDate === selectedDate;
    return cinemaMatch && dateMatch;
  });

  const durationHours = Math.floor(movie.duration / 60);
  const durationMins = movie.duration % 60;

  return (
    <div>
      {/* Cinematic Banner Backdrop Header */}
      <div
        className="position-relative w-100"
        style={{
          minHeight: '480px',
          background: `linear-gradient(to right, #090a0d 0%, rgba(9, 10, 13, 0.9) 35%, rgba(9, 10, 13, 0.7) 100%), linear-gradient(to top, #090a0d 0%, transparent 80%), url(${movie.bannerUrl || movie.posterUrl}) center/cover no-repeat`,
        }}
      >
        <div className="container py-5">
          <div className="row g-4 align-items-center pt-4">
            {/* Poster Card */}
            <div className="col-lg-3 col-md-4">
              <div
                className="rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25"
                style={{ aspectRatio: '2/3', background: '#14161e' }}
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="col-lg-9 col-md-8 text-white">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className={`badge ${movie.status === 'upcoming' ? 'bg-primary' : 'bg-danger'} px-3 py-1 text-uppercase`}>
                  {movie.status === 'upcoming' ? 'Coming Soon' : 'Now Showing'}
                </span>
                <span className="badge bg-dark border border-secondary text-warning">
                  <i className="bi bi-star-fill text-warning me-1"></i> {movie.rating?.toFixed(1) || '8.5'}/10
                </span>
                <span className="badge bg-dark border border-secondary text-light">
                  {movie.ageRating || 'UA'}
                </span>
              </div>

              <h1 className="display-4 fw-black text-uppercase brand-font mb-3">{movie.title}</h1>

              {/* Meta details */}
              <div className="d-flex flex-wrap align-items-center gap-3 text-secondary mb-3 small">
                <span>
                  <i className="bi bi-clock text-danger me-1"></i> {durationHours}h {durationMins}m
                </span>
                <span>&bull;</span>
                <span>
                  <i className="bi bi-translate text-danger me-1"></i> {movie.language?.join(', ')}
                </span>
                <span>&bull;</span>
                <span>
                  <i className="bi bi-calendar-event text-danger me-1"></i>{' '}
                  {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Genres */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {movie.genre?.map((g, idx) => (
                  <span
                    key={idx}
                    className="badge bg-secondary bg-opacity-25 border border-secondary border-opacity-25 text-light px-3 py-1"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-light text-opacity-75 lead mb-4" style={{ fontSize: '1rem', maxWidth: '800px' }}>
                {movie.description}
              </p>

              {/* Cast & Crew */}
              <div className="row g-3 small text-secondary">
                <div className="col-md-6">
                  <span className="d-block text-white fw-bold mb-1">
                    <i className="bi bi-person-video text-danger me-1"></i> Director
                  </span>
                  <span>{movie.director || 'Not Specified'}</span>
                </div>
                <div className="col-md-6">
                  <span className="d-block text-white fw-bold mb-1">
                    <i className="bi bi-people text-danger me-1"></i> Star Cast
                  </span>
                  <span>{movie.cast?.join(', ') || 'Ensemble Cast'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes and Cinema Booking Section */}
      <div className="container py-5">
        <div className="d-flex align-items-center gap-2 mb-4">
          <div className="bg-danger rounded-2 p-2 text-white">
            <i className="bi bi-calendar3 fs-5"></i>
          </div>
          <div>
            <h3 className="text-white fw-bold mb-0">Select Cinema & Showtimes</h3>
            <small className="text-secondary">Choose your preferred theater, date, and showtime to proceed to seat selection</small>
          </div>
        </div>

        {/* Date Selector Tabs */}
        <div className="glass-panel p-3 mb-4">
          <div className="d-flex gap-2 overflow-auto pb-2">
            {dateOptions.map((opt) => (
              <button
                key={opt.iso}
                onClick={() => {
                  setSelectedDate(opt.iso);
                  setSelectedShow(null);
                }}
                className={`btn py-2 px-3 text-center rounded-3 border transition-smooth ${
                  selectedDate === opt.iso
                    ? 'btn-danger text-white border-danger shadow-sm'
                    : 'btn-dark text-secondary border-secondary border-opacity-25'
                }`}
                style={{ minWidth: '110px' }}
              >
                <div className="fw-bold" style={{ fontSize: '0.85rem' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '0.75rem' }}>{opt.fullDate}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cinema & Shows Grid */}
        <div className="row g-4">
          {cinemas.map((cinema) => {
            const cinemaShows = shows.filter(
              (s) => s.cinemaId?._id === cinema._id && (!selectedDate || s.showDate === selectedDate)
            );

            return (
              <div key={cinema._id} className="col-12">
                <div className="glass-panel p-4 border-secondary border-opacity-25">
                  <div className="row align-items-start g-3">
                    {/* Cinema Details */}
                    <div className="col-lg-4 col-md-5">
                      <h5 className="text-white fw-bold mb-1">
                        <i className="bi bi-building me-2 text-danger"></i>
                        {cinema.name}
                      </h5>
                      <p className="text-secondary small mb-2">{cinema.address}, {cinema.city}</p>
                      <div className="d-flex flex-wrap gap-1">
                        {cinema.facilities?.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="badge bg-secondary bg-opacity-25 text-light text-uppercase"
                            style={{ fontSize: '0.65rem' }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Showtimes Buttons */}
                    <div className="col-lg-8 col-md-7">
                      <span className="d-block text-secondary small fw-semibold mb-2">Available Showtimes:</span>
                      {cinemaShows.length > 0 ? (
                        <div className="d-flex flex-wrap gap-3">
                          {cinemaShows.map((show) => {
                            const isSelected = selectedShow?._id === show._id;
                            return (
                              <button
                                key={show._id}
                                onClick={() => setSelectedShow(show)}
                                className={`btn text-start p-3 rounded-3 border transition-smooth ${
                                  isSelected
                                    ? 'btn-danger text-white border-danger shadow'
                                    : 'btn-dark text-light border-secondary border-opacity-50'
                                }`}
                                style={{ minWidth: '150px' }}
                              >
                                <div className="fw-bold fs-6">{show.startTime}</div>
                                <div
                                  className={`small ${isSelected ? 'text-white' : 'text-danger'} fw-semibold`}
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {show.screenName}
                                </div>
                                <div className="small text-secondary" style={{ fontSize: '0.72rem' }}>
                                  Starts at ${show.ticketPrice?.standard || 12}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-secondary small py-3">
                          <i className="bi bi-calendar-x me-2"></i> No showtimes scheduled for this date. Please check another day.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Show Sticky Bottom Bar */}
        {selectedShow && (
          <div
            className="sticky-bottom glass-panel p-3 p-md-4 mt-5 border-danger shadow-lg d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 animate__animated animate__fadeInUp"
            style={{ zIndex: 1020 }}
          >
            <div>
              <span className="badge bg-danger text-white mb-1">Selected Showtime</span>
              <h5 className="text-white fw-bold mb-0">
                {selectedShow.cinemaId?.name} &bull; {selectedShow.startTime}
              </h5>
              <small className="text-secondary">
                {selectedShow.screenName} &bull; Date: {selectedShow.showDate}
              </small>
            </div>
            <div>
              <button
                onClick={() => navigate(`/seat-selection/${selectedShow._id}`)}
                className="btn btn-cinema btn-lg px-4 py-3"
              >
                <i className="bi bi-grid-3x3-gap-fill"></i> Select Seats & Book Tickets
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
