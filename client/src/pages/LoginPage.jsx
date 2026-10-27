import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(redirectUrl, { replace: true });
    } else {
      setErrorMessage(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'admin') {
      setEmail('admin@imovies.com');
      setPassword('Admin@12345');
    } else {
      setEmail('user@imovies.com');
      setPassword('User@12345');
    }
    setErrorMessage('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7 col-sm-10">
          <div className="glass-panel p-4 p-md-5 shadow-lg border-secondary border-opacity-25">
            {/* Logo and Welcome */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-danger rounded-3 text-white mb-2"
                style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}
              >
                <i className="bi bi-film"></i>
              </div>
              <h2 className="text-white fw-bold brand-font mb-1">Welcome Back</h2>
              <p className="text-secondary small">Sign in to manage your tickets and book cinema shows</p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i>
                <div>{errorMessage}</div>
              </div>
            )}

            {/* Quick Demo Fill Buttons */}
            <div className="p-3 rounded-3 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-secondary small fw-semibold d-block mb-2 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                <i className="bi bi-lightning-charge-fill text-warning me-1"></i> 1-Click Demo Evaluation:
              </span>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin')}
                  className="btn btn-sm btn-outline-warning flex-grow-1"
                >
                  <i className="bi bi-shield-lock me-1"></i> Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('user')}
                  className="btn btn-sm btn-outline-info flex-grow-1"
                >
                  <i className="bi bi-person me-1"></i> User Demo
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control cinema-input border-start-0"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="form-label text-secondary small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control cinema-input border-start-0 border-end-0"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-dark border-secondary text-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-cinema w-100 py-3 fw-bold mb-3"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-1"></i> Sign In to Account
                  </>
                )}
              </button>

              {/* Register Link */}
              <div className="text-center text-secondary small">
                Don't have an account?{' '}
                <Link to="/register" className="text-danger text-decoration-none fw-semibold">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
