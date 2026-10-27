import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import MovieCard from '../components/MovieCard';

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || 'All');
  const [language, setLanguage] = useState(searchParams.get('language') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating_desc');

  const genresList = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Fantasy', 'Thriller', 'Comedy', 'Mystery', 'Music'];
  const languagesList = ['All', 'English', 'Hindi', 'Spanish', 'French', 'Japanese', 'German'];

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (genre !== 'All') params.append('genre', genre);
        if (language !== 'All') params.append('language', language);
        if (status !== 'All') params.append('status', status);
        if (sort) params.append('sort', sort);

        const res = await api.get(`/movies?${params.toString()}`);
        setMovies(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [search, genre, language, status, sort]);

  const handleResetFilters = () => {
    setSearch('');
    setGenre('All');
    setLanguage('All');
    setStatus('All');
    setSort('rating_desc');
    setSearchParams({});
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="display-5 fw-bold text-white mb-2">Explore Movies</h1>
        <p className="text-secondary">
          Browse through our curated catalog of current blockbusters, upcoming previews, and cinematic masterpieces.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 mb-5 border-secondary border-opacity-25 shadow-sm">
        <div className="row g-3">
          {/* Search Input */}
          <div className="col-lg-4 col-md-6">
            <label className="form-label text-secondary small fw-semibold">Search By Title</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search text-danger"></i>
              </span>
              <input
                type="text"
                className="form-control cinema-input border-start-0"
                placeholder="Search title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Genre Filter */}
          <div className="col-lg-2 col-md-3 col-6">
            <label className="form-label text-secondary small fw-semibold">Genre</label>
            <select
              className="form-select cinema-input"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {genresList.map((g) => (
                <option key={g} value={g} className="bg-dark text-light">
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="col-lg-2 col-md-3 col-6">
            <label className="form-label text-secondary small fw-semibold">Language</label>
            <select
              className="form-select cinema-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languagesList.map((l) => (
                <option key={l} value={l} className="bg-dark text-light">
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-lg-2 col-md-6 col-6">
            <label className="form-label text-secondary small fw-semibold">Status</label>
            <select
              className="form-select cinema-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All" className="bg-dark text-light">All Statuses</option>
              <option value="now_showing" className="bg-dark text-light">Now Showing</option>
              <option value="upcoming" className="bg-dark text-light">Upcoming</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="col-lg-2 col-md-6 col-6">
            <label className="form-label text-secondary small fw-semibold">Sort By</label>
            <select
              className="form-select cinema-input"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="rating_desc" className="bg-dark text-light">Highest Rated</option>
              <option value="date_desc" className="bg-dark text-light">Latest Release</option>
              <option value="title_asc" className="bg-dark text-light">Title (A - Z)</option>
              <option value="title_desc" className="bg-dark text-light">Title (Z - A)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        {(search || genre !== 'All' || language !== 'All' || status !== 'All') && (
          <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top border-secondary border-opacity-25">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="text-secondary small">Active Filters:</span>
              {search && <span className="badge bg-secondary">Search: {search}</span>}
              {genre !== 'All' && <span className="badge bg-secondary">Genre: {genre}</span>}
              {language !== 'All' && <span className="badge bg-secondary">Lang: {language}</span>}
              {status !== 'All' && <span className="badge bg-danger">Status: {status}</span>}
            </div>
            <button
              onClick={handleResetFilters}
              className="btn btn-sm btn-outline-secondary py-1 px-3 text-white"
            >
              <i className="bi bi-x-circle me-1"></i> Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
          <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading movies...</span>
          </div>
        </div>
      ) : movies.length > 0 ? (
        <div className="row g-4">
          {movies.map((movie) => (
            <div key={movie._id} className="col-xl-3 col-lg-4 col-md-6">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 glass-panel p-5">
          <div className="text-secondary mb-3 fs-1">
            <i className="bi bi-film"></i>
          </div>
          <h4 className="text-white fw-bold mb-2">No Movies Found</h4>
          <p className="text-secondary mb-4">
            We couldn't find any movies matching your current search or filter criteria.
          </p>
          <button onClick={handleResetFilters} className="btn btn-cinema px-4">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
