import React from "react";
import "./style.scss";

const Loader = () => {
  return (
    <div className="imovies-loader-container">
      <div className="imovies-spinner"></div>
      <p className="loading-text">Loading iMovies...</p>
    </div>
  );
};

export default Loader;
