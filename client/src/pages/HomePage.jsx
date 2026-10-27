import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';

const HomePage = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [nowShowing, setNowShowing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popular, setPopular] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [nowShowingRes, upcomingRes, allRes] = await Promise.all([
          api.get('/movies/now-showing'),
          api.get('/movies/upcoming'),
          api.get('/movies?sort=rating_desc&limit=6'),
        ]);

        const showingData = nowShowingRes.data?.data || [];
        const upcomingData = upcomingRes.data?.data || [];
        const popularData = allRes.data?.data || [];

        setNowShowing(showingData);
        setUpcoming(upcomingData);
        setPopular(popularData);

        // Featured banner selects highest rated or first now showing
        if (showingData.length > 0) {
          setFeaturedMovie(showingData[0]);
        } else if (popularData.length > 0) {
          setFeaturedMovie(popularData[0]);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 my-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading movies...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner Section */}
      {featuredMovie && <HeroBanner movie={featuredMovie} />}

      <div className="container pb-5">
        {/* Quick Search Bar */}
        <div className="row justify-content-center mb-5" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
          <div className="col-lg-9 col-md-11">
            <div className="glass-panel p-3 p-md-4 shadow-lg border-danger border-opacity-25">
              <form onSubmit={handleSearchSubmit} className="d-flex flex-column flex-md-row gap-3">
                <div className="input-group flex-grow-1">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-search text-danger"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control cinema-input border-start-0"
                    placeholder="Search movies by title, director, or actor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-cinema px-4">
                  <i className="bi bi-search"></i> Search Movies
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Now Showing Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-danger rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>
                  IN THEATERS
                </span>
                <span className="text-secondary small">Experience in Dolby & IMAX</span>
              </div>
              <h2 className="text-white fw-bold mb-0">Now Showing</h2>
            </div>
            <Link to="/movies?status=now_showing" className="text-danger text-decoration-none fw-semibold small">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {nowShowing.slice(0, 4).map((movie) => (
              <div key={movie._id} className="col-xl-3 col-lg-4 col-md-6">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>

        {/* Cinema Experience Banner */}
        <section className="my-5 p-4 p-md-5 rounded-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #161820 0%, #1e1115 100%)', border: '1px solid rgba(229,9,20,0.3)' }}>
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-danger text-white mb-2 px-3 py-1 text-uppercase" style={{ letterSpacing: '0.1em' }}>
                Ultra Premium Cinema
              </span>
              <h2 className="display-6 fw-bold text-white mb-3">
                Next-Generation Cinema Sound & Optics
              </h2>
              <p className="text-secondary lead mb-4" style={{ fontSize: '1rem' }}>
                Every auditorium is engineered with dual 4K laser projection, immersive Dolby Atmos sound arrays, and ergonomic heated recliners for the ultimate movie-going spectacle.
              </p>
              <div className="d-flex flex-wrap gap-4 text-light small">
                <div>
                  <h4 className="text-danger fw-black mb-0">100%</h4>
                  <span className="text-secondary">Laser Projection</span>
                </div>
                <div>
                  <h4 className="text-danger fw-black mb-0">128</h4>
                  <span className="text-secondary">Sound Channels</span>
                </div>
                <div>
                  <h4 className="text-danger fw-black mb-0">0s</h4>
                  <span className="text-secondary">Queue Wait Time</span>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-center mt-4 mt-lg-0">
              <Link to="/movies" className="btn btn-cinema btn-lg px-4 py-3">
                <i className="bi bi-ticket-perforated"></i> Reserve Your Experience
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming Movies Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-primary rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>
                  COMING SOON
                </span>
                <span className="text-secondary small">Advance Booking Opening Soon</span>
              </div>
              <h2 className="text-white fw-bold mb-0">Upcoming Blockbusters</h2>
            </div>
            <Link to="/movies?status=upcoming" className="text-danger text-decoration-none fw-semibold small">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {upcoming.slice(0, 4).map((movie) => (
              <div key={movie._id} className="col-xl-3 col-lg-4 col-md-6">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-warning text-dark rounded-pill px-2 py-1 fw-bold" style={{ fontSize: '0.7rem' }}>
                  CRITICS' CHOICE
                </span>
                <span className="text-secondary small">Highest Rated by Audiences</span>
              </div>
              <h2 className="text-white fw-bold mb-0">Popular & Trending</h2>
            </div>
          </div>

          <div className="row g-4">
            {popular.slice(0, 4).map((movie) => (
              <div key={movie._id} className="col-xl-3 col-lg-4 col-md-6">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
