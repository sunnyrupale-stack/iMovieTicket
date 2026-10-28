# iMovies - Movie Ticket Booking Made Simple

A Full Stack MERN (MongoDB, Express.js, React.js, Node.js) Web Application developed for the College Project Curriculum (SkillWallet LMS).

---

## 📌 Project Overview
**iMovies** is an online cinema ticket reservation platform that allows users to:
1. Browse available movies with genre filtering and real-time search.
2. View detailed movie synopses, cast lists, official trailers, and audience reviews.
3. Select show dates, cinema halls,, and showtimes.
4. Reserve seats across tiered categories (**Balcony**, **Middle Class**, and **Lower Class**) with live seat locking.
5. Manage booking confirmations, e-tickets, and user watchlists.
6. Admin portal for scheduling shows, managing theaters, adding new movies, and monitoring platform bookings.

---

## 🏗️ Architecture & MVC Structure

```text
IMovies - Movie ticket booking made simple/
├── client/                               # Frontend (React 18 + Vite + SCSS/Bootstrap)
│   ├── src/
│   │   ├── components/
│   │   │   ├── header/                   # Navigation & search bar
│   │   │   ├── footer/                   # Footer links & copyright
│   │   │   ├── loader/                   # Loading spinner
│   │   │   └── protection/               # Route protection (UserProtection, AdminProtection)
│   │   ├── hooks/
│   │   │   └── useFetch.js               # Reusable data-fetching hook
│   │   ├── pages/
│   │   │   ├── landing/                  # Welcome Hero Page
│   │   │   ├── home/                     # Movie Catalog & Genre filter
│   │   │   ├── login/                    # User & Admin Login
│   │   │   ├── register/                 # User & Admin Registration
│   │   │   ├── movieDetails/             # Synopsis, Trailer, Reviews
│   │   │   ├── movieShows/               # Theater and Showtimes
│   │   │   ├── seatsPage/                # Interactive Seat Layout & Checkout
│   │   │   ├── bookings/                 # Customer Bookings History
│   │   │   ├── favoriteShows/            # Watchlist / Favorites
│   │   │   ├── profile/                  # User Profile Details
│   │   │   ├── editUserDetails/          # Profile Edit Form
│   │   │   ├── admin/                    # Admin Dashboard (Shows & Bookings)
│   │   │   ├── addMovie/                 # Admin Add Movie
│   │   │   ├── addTheatre/               # Admin Add Cinema Hall & Seat Tiers
│   │   │   ├── addShow/                  # Admin Schedule Showtimes
│   │   │   └── adminBookings/            # Admin Reservations Management Table
│   │   ├── App.jsx                       # Master Routes with Lazy Loading
│   │   ├── index.css                     # Cinema Dark Mode Theme System
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js                    # Reverse Proxy Configuration
│
└── server/                               # Backend (Node.js + Express.js + Mongoose)
    ├── middlewares/
    │   └── fetchUser.js                  # JWT Token verification middleware
    ├── models/
    │   ├── adminModel.js                 # Admin Mongoose Schema
    │   ├── bookingModel.js               # Booking Mongoose Schema
    │   ├── favoriteModel.js              # Watchlist Mongoose Schema
    │   ├── movieModel.js                 # Movie Mongoose Schema
    │   ├── reviewModel.js                # Reviews & Ratings Schema
    │   ├── showModel.js                  # Showtimes Mongoose Schema
    │   ├── theatreModel.js               # Theatre & Seat Tiers Schema
    │   └── userModel.js                  # User Mongoose Schema
    ├── routes/
    │   ├── adminRoutes.js                # /api/auth/admin (Login, Register, Stats)
    │   ├── authRoutes.js                 # /api/auth (Login, Register, User Info)
    │   ├── bookingRoutes.js              # /api/bookings (Create, List, Cancel)
    │   ├── favoriteRoutes.js             # /api/favorite (Add, Remove, List)
    │   ├── movieRoutes.js                # /api/movie (CRUD movies)
    │   ├── reviewRoutes.js               # /api/review (Add, List reviews)
    │   ├── showRoutes.js                 # /api/shows (CRUD & /getmovieshows/:name)
    │   └── theatreRoutes.js              # /api/theatre (CRUD theaters & tiers)
    ├── utils/
    │   ├── db.js                         # Mongoose MongoDB Connection
    │   ├── mailer.js                     # Nodemailer confirmation transport
    │   ├── reminderService.js            # Node-cron background reminder job
    │   ├── cleanupService.js             # Node-cron seat cleanup job
    │   ├── seeder.js                     # Seed script for initial movies & shows
    │   └── mockStore.js                  # Seamless offline fallback
    ├── .env                              # Environment configuration
    ├── .env.example
    ├── package.json
    └── server.js                         # Master Express API Server
```

---

## 🚀 How to Run the Project Locally

### 1. Start Backend Server
Open a terminal:
```bash
cd server
npm install
npm run dev
# or: node server.js
```
* The backend server runs on: **`http://localhost:3000`**

### 2. Start Frontend Client
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
* The frontend client runs on: **`http://localhost:5173`**

---

## 🔑 Default Demo Accounts
For quick testing and college evaluation demonstrations:
* **Admin Portal Login:**
  * URL: `http://localhost:5173/admin/login`
  * Email: `admin@imovies.com`
  * Password: `admin1234`
* **User Login:**
  * URL: `http://localhost:5173/login`
  * Email: `tanishq@example.com`
  * Password: `user1234`
