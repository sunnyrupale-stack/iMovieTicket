require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const cinemaRoutes = require('./routes/cinemaRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Models for auto-seeding check
const Movie = require('./models/Movie');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

// Store io in express app
app.set('io', io);

// Socket.IO Room management for real-time seat synchronization
io.on('connection', (socket) => {
  // Join a specific show room
  socket.on('joinShow', (showId) => {
    socket.join(`show_${showId}`);
  });

  // Leave a show room
  socket.on('leaveShow', (showId) => {
    socket.leave(`show_${showId}`);
  });

  socket.on('disconnect', () => {});
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'IMovies Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Serve static frontend build if present (for single-port full-stack deployment)
const clientBuildPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next();
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Check if database needs initial seeding
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('Database is empty. Automatically initializing seed data...');
      const seedData = require('./scripts/seedDatabase');
      // Run inline without process.exit
      const User = require('./models/User');
      const Cinema = require('./models/Cinema');
      const Show = require('./models/Show');
      const Booking = require('./models/Booking');

      const adminPasswordHash = await User.hashPassword('Admin@12345');
      const userPasswordHash = await User.hashPassword('User@12345');

      const admin = await User.create({
        name: 'Cinema Admin',
        email: 'admin@imovies.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        phone: '+1 555-0199',
      });

      const user = await User.create({
        name: 'Alex Johnson',
        email: 'user@imovies.com',
        passwordHash: userPasswordHash,
        role: 'user',
        phone: '+1 555-0144',
      });

      const cinemas = await Cinema.create([
        {
          name: 'IMovies Grand Lux Cinema',
          location: 'Downtown Center',
          address: '742 Evergreen Promenade, Suite 100',
          city: 'New York',
          facilities: ['IMAX 4K Laser', 'Dolby Atmos', 'Recliner Loungers', 'Gourmet Dining', 'VIP Lounge'],
          image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
          screens: [
            {
              screenNumber: 1,
              screenName: 'Screen 1 - IMAX Grand',
              soundSystem: 'Dolby Atmos 11.1',
              screenType: 'IMAX 4K Laser Curved',
              rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
              seatsPerRow: 12,
              totalSeats: 120,
            },
          ],
        },
        {
          name: 'IMovies Metroplex Cinebar',
          location: 'Sunset Boulevard',
          address: '1200 West Sunset Blvd',
          city: 'Los Angeles',
          facilities: ['Dolby Cinema', 'RealD 3D', 'Luxury Plush Seats', 'Artisan Coffee'],
          image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
          screens: [
            {
              screenNumber: 1,
              screenName: 'Auditorium 1 - Dolby Luxe',
              soundSystem: 'Dolby Atmos Surround',
              screenType: '4K Ultra HD',
              rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
              seatsPerRow: 12,
              totalSeats: 96,
            },
          ],
        },
      ]);

      const seededMovies = await Movie.create([
        {
          title: 'Interstellar: Beyond Time',
          description:
            'When Earth faces environmental collapse, a team of pioneering astronauts embarks on humanity’s most audacious voyage through a newly opened wormhole to find a habitable sanctuary for civilization.',
          posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
          genre: ['Sci-Fi', 'Adventure', 'Drama'],
          language: ['English', 'Spanish'],
          duration: 169,
          releaseDate: new Date('2026-10-10'),
          cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
          director: 'Christopher Nolan',
          rating: 9.2,
          status: 'now_showing',
          trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
          ageRating: 'PG-13',
        },
        {
          title: 'Cyberpunk 2099: Neon Syndicate',
          description:
            'In a rain-drenched megacity dominated by rogue artificial intelligences and corporate syndicates, an augmented detective uncovers a conspiracy that threatens the boundaries of human consciousness.',
          posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80',
          genre: ['Action', 'Sci-Fi', 'Thriller'],
          language: ['English', 'Japanese'],
          duration: 142,
          releaseDate: new Date('2026-10-18'),
          cast: ['Keanu Reeves', 'Ana de Armas', 'Hiroyuki Sanada'],
          director: 'Denis Villeneuve',
          rating: 8.9,
          status: 'now_showing',
          trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          ageRating: 'R',
        },
        {
          title: 'Shadow of the Eclipse',
          description:
            'Ancient guardians arise when a celestial alignment unleashes forgotten beasts across the mystical continents. Two estranged warriors must unite before eternal night envelops the realm.',
          posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&auto=format&fit=crop&q=80',
          genre: ['Fantasy', 'Action', 'Adventure'],
          language: ['English', 'Hindi'],
          duration: 155,
          releaseDate: new Date('2026-10-22'),
          cast: ['Henry Cavill', 'Gal Gadot', 'Pedro Pascal'],
          director: 'Guillermo del Toro',
          rating: 8.7,
          status: 'now_showing',
          trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          ageRating: 'UA',
        },
        {
          title: 'The Silent Symphony',
          description:
            'An inspiring drama detailing the life of a deaf prodigy pianist who defies medical odds to compose the defining masterpiece of modern classical music on the grand stage of Vienna.',
          posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1600&auto=format&fit=crop&q=80',
          genre: ['Drama', 'Music'],
          language: ['English', 'French'],
          duration: 128,
          releaseDate: new Date('2026-10-15'),
          cast: ['Timothée Chalamet', 'Florence Pugh', 'Mark Rylance'],
          director: 'Damien Chazelle',
          rating: 8.6,
          status: 'now_showing',
          trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          ageRating: 'PG',
        },
        {
          title: 'Quantum Abyss: Horizons',
          description:
            'Deep sea explorers discover a subterranean fissure that defies known quantum physics, unleashing time anomalies that force the crew to confront alternate versions of their own fates.',
          posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80',
          genre: ['Sci-Fi', 'Thriller', 'Mystery'],
          language: ['English'],
          duration: 135,
          releaseDate: new Date('2026-11-15'),
          cast: ['Cillian Murphy', 'Emily Blunt', 'David Tennant'],
          director: 'Alex Garland',
          rating: 9.0,
          status: 'upcoming',
          trailerUrl: '',
          ageRating: 'PG-13',
        },
        {
          title: 'Kingdom of Dragons: Fire & Gold',
          description:
            'The epic saga of airborne skirmishes and royal treachery across the seven mountain kingdoms, where only a dragon-bonded rider can claim the throne of obsidian.',
          posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
          genre: ['Fantasy', 'Action', 'Adventure'],
          language: ['English', 'German'],
          duration: 160,
          releaseDate: new Date('2026-11-28'),
          cast: ['Kit Harington', 'Emilia Clarke', 'Mads Mikkelsen'],
          director: 'Peter Jackson',
          rating: 9.3,
          status: 'upcoming',
          trailerUrl: '',
          ageRating: 'UA',
        },
      ]);

      // Generate shows for now showing movies
      const buildSeats = (rows, seatsPerRow, ticketPrice) => {
        const seats = [];
        rows.forEach((row, rIdx) => {
          let category = 'Standard';
          let price = ticketPrice.standard;
          if (rIdx >= rows.length - 2) {
            category = 'VIP';
            price = ticketPrice.vip;
          } else if (rIdx >= rows.length - 5) {
            category = 'Premium';
            price = ticketPrice.premium;
          }
          for (let num = 1; num <= seatsPerRow; num++) {
            seats.push({
              seatId: `${row}${num}`,
              row,
              seatNumber: num,
              category,
              price,
              status: 'available',
            });
          }
        });
        return seats;
      };

      const today = new Date();
      const dates = [];
      for (let i = 0; i < 4; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
      }
      const showTimes = ['11:00 AM', '02:30 PM', '06:30 PM', '09:45 PM'];

      for (const movie of seededMovies.filter((m) => m.status === 'now_showing')) {
        for (const cinema of cinemas) {
          const screen = cinema.screens[0];
          const ticketPrice = { standard: 12, premium: 18, vip: 28 };

          for (const showDate of dates) {
            for (const startTime of showTimes) {
              const seats = buildSeats(
                screen.rows || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                screen.seatsPerRow || 12,
                ticketPrice
              );

              // Pre-fill some booked seats
              ['C4', 'C5', 'E6', 'E7'].forEach((id) => {
                const s = seats.find((st) => st.seatId === id);
                if (s) {
                  s.status = 'booked';
                  s.bookedBy = user._id;
                }
              });

              await Show.create({
                movieId: movie._id,
                cinemaId: cinema._id,
                screenName: screen.screenName,
                showDate,
                startTime,
                ticketPrice,
                seats,
                status: 'active',
              });
            }
          }
        }
      }
      console.log('✅ Automatic seeding finished successfully!');
    }

    server.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🍿 IMovies Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`🚀 API Base URL:      http://localhost:${PORT}/api`);
      console.log(`⚡ Real-Time Socket:  http://localhost:${PORT}`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server };
