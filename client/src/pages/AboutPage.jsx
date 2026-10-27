import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const techStack = [
    {
      category: 'Frontend Architecture',
      icon: 'bi-window-desktop',
      color: 'text-info',
      items: ['React.js 18', 'React Router v6', 'Bootstrap 5', 'Custom CSS3 Cinematic Theme', 'Axios Client', 'Context API'],
    },
    {
      category: 'Backend & APIs',
      icon: 'bi-server',
      color: 'text-success',
      items: ['Node.js', 'Express.js', 'RESTful MVC Architecture', 'JWT Authentication', 'Bcryptjs Hashing', 'Socket.IO'],
    },
    {
      category: 'Database & Concurrency',
      icon: 'bi-database-fill-gear',
      color: 'text-warning',
      items: ['MongoDB', 'Mongoose ODM', 'Atomic findOneAndUpdate Locking', 'MongoMemoryServer Zero-Config Fallback'],
    },
    {
      category: 'Cinema Booking Features',
      icon: 'bi-film',
      color: 'text-danger',
      items: ['Real-Time Seat Synchronization', 'Dynamic Price Calculation', 'Instant Ticket Generation', 'Admin Dashboard'],
    },
  ];

  return (
    <div className="container py-5">
      {/* Hero Intro */}
      <div className="text-center max-w-700 mx-auto mb-5">
        <span className="badge bg-danger text-uppercase px-3 py-2 fw-bold mb-3" style={{ letterSpacing: '0.1em' }}>
          About IMovies
        </span>
        <h1 className="display-4 fw-black text-white brand-font mb-3">
          Movie Ticket Booking Made Simple
        </h1>
        <p className="lead text-secondary" style={{ maxWidth: '750px', margin: '0 auto' }}>
          IMovies is an enterprise-grade MERN stack movie ticket booking platform crafted to deliver
          a frictionless, high-speed, and immersive cinema discovery and reservation experience.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="glass-panel p-4 p-md-5 h-100 border-secondary border-opacity-25">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-danger rounded-3 text-white mb-3"
              style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}
            >
              <i className="bi bi-compass-fill"></i>
            </div>
            <h3 className="text-white fw-bold brand-font mb-2">Our Mission</h3>
            <p className="text-secondary leading-relaxed mb-0">
              To eliminate ticket queues and fragmented booking portals by providing movie lovers
              with instantaneous access to accurate showtimes, rich cinematic previews, and interactive
              seat selection backed by robust concurrency control.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-panel p-4 p-md-5 h-100 border-secondary border-opacity-25">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-primary rounded-3 text-white mb-3"
              style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}
            >
              <i className="bi bi-eye-fill"></i>
            </div>
            <h3 className="text-white fw-bold brand-font mb-2">Our Vision</h3>
            <p className="text-secondary leading-relaxed mb-0">
              To pioneer the future of digital cinema hospitality with real-time room synchronization,
              transparent pricing breakdowns, responsive mobile-first interfaces, and administrative tooling
              that makes managing cinema operations effortless.
            </p>
          </div>
        </div>
      </div>

      {/* Key Objectives */}
      <div className="glass-panel p-4 p-md-5 mb-5 border-secondary border-opacity-25">
        <h3 className="text-white fw-bold brand-font mb-4 text-center">Core Objectives & Capabilities</h3>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="d-flex gap-3">
              <i className="bi bi-shield-check text-danger fs-3"></i>
              <div>
                <h5 className="text-white fw-bold mb-1">Guaranteed Seat Isolation</h5>
                <p className="text-secondary small mb-0">
                  Atomic database operations prevent double-booking collisions, ensuring that no two guests can ever reserve the same cinema seat.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex gap-3">
              <i className="bi bi-broadcast text-danger fs-3"></i>
              <div>
                <h5 className="text-white fw-bold mb-1">Real-Time WebSockets</h5>
                <p className="text-secondary small mb-0">
                  Socket.IO room broadcasts immediately notify viewers when seats are taken or cancelled without requiring manual page refreshes.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex gap-3">
              <i className="bi bi-palette text-danger fs-3"></i>
              <div>
                <h5 className="text-white fw-bold mb-1">Cinematic Dark UI</h5>
                <p className="text-secondary small mb-0">
                  Custom dark aesthetic inspired by modern theater atmospheres, complete with responsive layouts, glassmorphism, and visual seating tiers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies Used Grid */}
      <div className="mb-5">
        <h3 className="text-white fw-bold brand-font mb-4 text-center">Technologies & Architecture</h3>
        <div className="row g-4">
          {techStack.map((stack, idx) => (
            <div key={idx} className="col-lg-3 col-md-6">
              <div className="glass-panel p-4 h-100 border-secondary border-opacity-25">
                <i className={`bi ${stack.icon} ${stack.color} fs-2 mb-2 d-block`}></i>
                <h5 className="text-white fw-bold mb-3">{stack.category}</h5>
                <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary mb-0">
                  {stack.items.map((item, i) => (
                    <li key={i} className="d-flex align-items-center gap-2">
                      <i className="bi bi-check2 text-danger"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="text-center p-5 rounded-4 glass-panel border-danger border-opacity-25">
        <h3 className="text-white fw-bold mb-2">Ready to Catch the Next Blockbuster?</h3>
        <p className="text-secondary mb-4">Explore currently running shows and reserve the best seats in the house.</p>
        <Link to="/movies" className="btn btn-cinema btn-lg px-4 py-3">
          <i className="bi bi-ticket-perforated"></i> Browse All Movies
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
