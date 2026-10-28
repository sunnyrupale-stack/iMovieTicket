import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import UserProtection from "./components/protection/UserProtection";
import AdminProtection from "./components/protection/AdminProtection";

const Landing = lazy(() => import("./pages/landing/Landing"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const Home = lazy(() => import("./pages/home/Home"));
const AddShow = lazy(() => import("./pages/addShow/AddShow"));
const SeatsPage = lazy(() => import("./pages/seatsPage/SeatsPage"));
const AdminLogin = lazy(() => import("./pages/login/AdminLogin"));
const MovieDetails = lazy(() => import("./pages/movieDetails/MovieDetails"));
const AddTheatre = lazy(() => import("./pages/addTheatre/AddTheatre"));
const MovieShows = lazy(() => import("./pages/movieShows/MovieShows"));
const Admin = lazy(() => import("./pages/admin/Admin"));
const AddMovie = lazy(() => import("./pages/addMovie/AddMovie"));
const FavoriteShows = lazy(() => import("./pages/favoriteShows/FavoriteShows"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const AdminRegister = lazy(() => import("./pages/register/AdminRegister"));
const Bookings = lazy(() => import("./pages/bookings/Bookings"));
const EditUserDetails = lazy(() => import("./pages/editUserDetails/EditUserDetails"));
const AdminBookings = lazy(() => import("./pages/adminBookings/AdminBookings"));

import Loader from "./components/loader/Loader";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <Suspense
        fallback={
          <div className="loadingContainer">
            <Loader />
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/movieshows/:movieName" element={<MovieShows />} />

          {/* User Protected Routes */}
          <Route path="/seats/:showId" element={<SeatsPage />} />
          <Route
            path="/bookings"
            element={
              <UserProtection>
                <Bookings />
              </UserProtection>
            }
          />
          <Route
            path="/favorites"
            element={
              <UserProtection>
                <FavoriteShows />
              </UserProtection>
            }
          />
          <Route
            path="/profile"
            element={
              <UserProtection>
                <Profile />
              </UserProtection>
            }
          />
          <Route
            path="/edituserdetails"
            element={
              <UserProtection>
                <EditUserDetails />
              </UserProtection>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route
            path="/admin"
            element={
              <AdminProtection>
                <Admin />
              </AdminProtection>
            }
          />
          <Route
            path="/admin/addmovie"
            element={
              <AdminProtection>
                <AddMovie />
              </AdminProtection>
            }
          />
          <Route
            path="/admin/addtheatre"
            element={
              <AdminProtection>
                <AddTheatre />
              </AdminProtection>
            }
          />
          <Route
            path="/admin/addshow"
            element={
              <AdminProtection>
                <AddShow />
              </AdminProtection>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminProtection>
                <AdminBookings />
              </AdminProtection>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
