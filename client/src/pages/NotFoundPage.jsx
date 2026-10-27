import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container py-5 text-center my-5">
      <div className="glass-panel p-5 d-inline-block border-danger border-opacity-25 shadow-lg" style={{ maxWidth: '540px' }}>
        <h1 className="display-1 fw-black text-danger brand-font mb-0">404</h1>
        <h3 className="text-white fw-bold mb-3">Page Not Found</h3>
        <p className="text-secondary mb-4">
          The cinema reels you are looking for might have been moved, removed, or are temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-cinema px-4 py-2">
          <i className="bi bi-house me-1"></i> Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
