# 🍿 IMovies – Movie Ticket Booking Made Simple

![IMovies Hero](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80)

A modern, responsive, full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) web application for discovering cinema blockbusters, viewing real-time showtimes across luxury screens, selecting seats via an interactive SVG/HTML5 visualizer, and booking tickets online.

---

## 🌟 Key Features

- **Cinematic Dark Theme**: Crafted with deep black (`#090a0d`), dark charcoal panels, neon crimson (`#E50914`) accents, and modern glassmorphism.
- **Dynamic Movie Catalog**: Browse *Now Showing*, *Upcoming*, and *Top-Rated* movies dynamically loaded from MongoDB.
- **Search & Multi-Filter**: Search by title/director/actor and filter in real-time by Genre, Language, and Release Status.
- **Interactive Cinema Seat Map**:
  - Curved perspective cinema screen with ambient top-glow.
  - Color-coded seat indicators:
    - 🟢 **Available** (Green)
    - 🔵 **Selected** (Blue)
    - 🔴 **Booked** (Red)
    - ⚪ **Unavailable** (Gray)
  - Multi-seat selection with dynamic total price computation including taxes and fees.
- **Atomic Concurrency Protection**:
  - Backend utilizes atomic `findOneAndUpdate` array filters to completely eliminate double-booking race conditions between simultaneous users.
- **Live Seat Availability (Socket.IO)**: Real-time room broadcasts notify all connected viewers when seats are taken or cancelled.
- **Instant Digital Ticket Pass**:
  - Confetti celebration upon reservation.
  - Printable cinema ticket card with barcode, QR representation, and unique reference code (`IMV-XXXX-XXXX`).
- **My Bookings & Cancellation**:
  - Complete history of confirmed and cancelled bookings.
  - Instant ticket view modal.
  - 1-Click cancellation with automatic seat inventory release and refund receipt.
- **Protected Admin Dashboard (RBAC)**:
  - Financial & operational analytics (Gross Revenue, Bookings, Active Movies, Shows, Users).
  - Movie Management (Add, Edit, Delete).
  - Cinema Complex & Screen Management.
  - Show Scheduling with automated seating grid generation and tier pricing (Standard, Premium, VIP).
  - Customer Booking overview with status changer.
  - Registered user directory.
- **Zero-Config Database Fallback**: Built-in `MongoMemoryServer` fallback ensures the application runs out of the box on any machine even without a local MongoDB service running.

---

## 👥 Demo Credentials

The database automatically seeds with realistic demo data on first boot:

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@imovies.com` | `Admin@12345` | Full access to Admin Dashboard, Movie CRUD, Show Scheduling, All Bookings |
| **Standard User** | `user@imovies.com` | `User@12345` | Browse movies, select seats, book tickets, manage My Bookings, cancel passes |

> **Pro Tip**: The Sign In page includes **1-Click Demo Buttons** (`Admin Demo` and `User Demo`) for instant testing!

---

## 🛠️ Technology Stack

### Frontend
- **React.js 18** (ES6+ JavaScript)
- **React Router v6**
- **Bootstrap 5 & Bootstrap Icons**
- **Custom CSS3** (Cinematic glassmorphic design system)
- **Axios** (Configured with JWT interceptors)
- **React Context API** (Authentication & Socket state)
- **Socket.IO Client** (Real-time seat synchronizer)
- **Canvas Confetti**

### Backend
- **Node.js** & **Express.js** (RESTful MVC Architecture)
- **MongoDB** & **Mongoose ODM**
- **JSON Web Token (JWT)** & **Bcryptjs**
- **Socket.IO** (Real-time WebSockets)
- **MongoMemoryServer** (Automatic zero-config fallback)
- **Morgan** & **CORS**

---

## 🚀 Quick Start Guide (Local Setup)

### 1. Prerequisites
- **Node.js**: v18.x or v20.x
- **npm**: v9.x or later

### 2. Install Dependencies
From the project root:
```bash
# Install root, server, and client dependencies
npm run install:all
```

### 3. Build the Frontend
```bash
npm run build:client
```

### 4. Run the Full-Stack Application
```bash
# Starts the unified server serving both the REST API and React SPA
npm start
```

### 🌐 Access URLs:
- **Live Public HTTPS Link**: [**https://91829b16b2417b.lhr.life**](https://91829b16b2417b.lhr.life)
- **Localhost**: [**http://localhost:5000**](http://localhost:5000)
- **Local Network (Wi-Fi / Mobile)**: [**http://10.10.149.128:5000**](http://10.10.149.128:5000)

---

## ☁️ Deployment Guide

### Option 1: 1-Click Deployment on Render
1. Push this repository to **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Select your repository. Render will automatically detect [`render.yaml`](./render.yaml).
5. Click **Apply**. Render will build and deploy the full-stack web application with free HTTPS!

### Option 2: Railway / Heroku
This repository includes a [`Procfile`](./Procfile) and single-port production server configuration:
1. Connect your GitHub repository to Railway or Heroku.
2. Railway will automatically detect Node.js and run:
   ```bash
   npm run build:client && npm start
   ```
3. Set your environment variables in the dashboard:
   - `JWT_SECRET`: Any random 32-character string.
   - `NODE_ENV`: `production`

### Option 3: Docker Deployment
Run anywhere using the included multi-stage [`Dockerfile`](./Dockerfile):
```bash
# Build Docker image
docker build -t imovies-booking .

# Run container on port 5000
docker run -p 5000:5000 imovies-booking
```
Access at `http://localhost:5000`.

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Create new user account.
- `POST /api/auth/login` - Authenticate user & receive JWT.
- `GET /api/auth/me` - Get profile of authenticated user.
- `POST /api/auth/logout` - Logout session.

### Movies
- `GET /api/movies` - Get catalog with search, filter (genre, language, status), and sort.
- `GET /api/movies/now-showing` - Get currently playing movies.
- `GET /api/movies/upcoming` - Get upcoming movies.
- `GET /api/movies/:id` - Get detailed movie information.
- `GET /api/movies/:id/shows` - Get all shows scheduled for a movie.

### Cinemas
- `GET /api/cinemas` - List cinemas and screens.
- `GET /api/cinemas/:id` - Cinema details and facilities.

### Shows & Seating
- `GET /api/shows` - Query shows by movie, cinema, or date.
- `GET /api/shows/:id` - Show information with real-time seat status layout.

### Bookings
- `POST /api/bookings` - Atomically reserve selected seats & create booking record.
- `GET /api/bookings/my-bookings` - Fetch authenticated user's tickets.
- `GET /api/bookings/:id` - Fetch single booking pass.
- `PATCH /api/bookings/:id/cancel` - Cancel booking and release seats back to inventory.

### Admin Dashboard (Protected: Admin Only)
- `GET /api/admin/stats` - Total revenue, bookings, movies, shows, and user metrics.
- `POST /api/admin/movies` - Create new movie.
- `PUT /api/admin/movies/:id` - Update existing movie.
- `DELETE /api/admin/movies/:id` - Delete movie.
- `POST /api/admin/cinemas` - Add new cinema theater complex.
- `POST /api/admin/shows` - Schedule show with automated seat layout generation.
- `DELETE /api/admin/shows/:id` - Cancel scheduled show.
- `GET /api/admin/bookings` - List all customer bookings across the platform.
- `PATCH /api/admin/bookings/:id/status` - Update booking status (`confirmed`, `completed`, `cancelled`).
- `GET /api/admin/users` - Directory of registered customers.

---

## 📜 License
MIT License. Developed for **IMovies – Movie Ticket Booking Made Simple**.
"# iMovieTicketProject" 
