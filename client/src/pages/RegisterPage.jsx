import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'None', percent: 0, color: 'secondary' };
    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    if (score <= 25) return { label: 'Weak', percent: 25, color: 'danger' };
    if (score <= 50) return { label: 'Fair', percent: 50, color: 'warning' };
    if (score <= 75) return { label: 'Good', percent: 75, color: 'info' };
    return { label: 'Strong', percent: 100, color: 'success' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    const result = await register(name.trim(), email.trim(), password, phone.trim());
    setLoading(false);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setErrorMessage(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7 col-sm-10">
          <div className="glass-panel p-4 p-md-5 shadow-lg border-secondary border-opacity-25">
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-danger rounded-3 text-white mb-2"
                style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}
              >
                <i className="bi bi-person-plus-fill"></i>
              </div>
              <h2 className="text-white fw-bold brand-font mb-1">Create Account</h2>
              <p className="text-secondary small">Join IMovies to book cinema tickets and earn member perks</p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i>
                <div>{errorMessage}</div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control cinema-input border-start-0"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Phone Number (Optional)</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-phone"></i>
                  </span>
                  <input
                    type="tel"
                    className="form-control cinema-input border-start-0"
                    placeholder="+1 555-0123"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-2">
                <label className="form-label text-secondary small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control cinema-input border-start-0 border-end-0"
                    placeholder="Create a strong password (min 6 chars)"
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

              {/* Password Strength Meter */}
              {password && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between text-secondary" style={{ fontSize: '0.72rem' }}>
                    <span>Password Strength:</span>
                    <strong className={`text-${strength.color}`}>{strength.label}</strong>
                  </div>
                  <div className="progress mt-1" style={{ height: '4px' }}>
                    <div
                      className={`progress-bar bg-${strength.color}`}
                      role="progressbar"
                      style={{ width: `${strength.percent}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="form-label text-secondary small fw-semibold">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-check2-circle"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control cinema-input border-start-0"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
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
                    Creating Your Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-1"></i> Register Account
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center text-secondary small">
                Already registered?{' '}
                <Link to="/login" className="text-danger text-decoration-none fw-semibold">
                  Sign In Instead
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
