import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('imovies_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('imovies_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('imovies_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.response?.data?.message || err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('imovies_token', receivedToken);
      localStorage.setItem('imovies_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, phone = '') => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      const { token: receivedToken, user: receivedUser } = res.data;

      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('imovies_token', receivedToken);
      localStorage.setItem('imovies_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check inputs.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore network errors during logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('imovies_token');
      localStorage.removeItem('imovies_user');
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
