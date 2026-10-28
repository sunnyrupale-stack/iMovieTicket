import axios from "axios";

// In production (Vercel), __BACKEND_URL__ is injected by vite.config.js
// from the VITE_API_URL environment variable set in Vercel dashboard.
// In development, it falls back to empty string so Vite proxy handles /api calls.
// eslint-disable-next-line no-undef
const baseURL = typeof __BACKEND_URL__ !== "undefined" ? __BACKEND_URL__ : "";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
