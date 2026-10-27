require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

const seedData = async () => {
  try {
    console.log('Seeding IMovies database...');
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Cinema.deleteMany({}),
      Show.deleteMany({}),
      Booking.deleteMany({}),
    ]);
    console.log('Cleared existing database records.');

    // 1. Seed Users
    const adminPasswordHash = await User.hashPassword('Admin@12345');
    const userPasswordHash = await User.hashPassword('User@12345');

    const adminUser = await User.create({
      name: 'Cinema Admin',
      email: 'admin@imovies.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      phone: '+1 555-0199',
    });

    const standardUser = await User.create({
      name: 'Alex Johnson',
      email: 'user@imovies.com',
      passwordHash: userPasswordHash,
      role: 'user',
      phone: '+1 555-0144',
    });

    console.log('Created Admin and User accounts.');

    // 2. Seed Cinemas
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
          {
            screenNumber: 2,
            screenName: 'Screen 2 - Dolby Prime',
            soundSystem: 'Dolby Atmos 7.1',
            screenType: 'Laser 4K HDR',
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            seatsPerRow: 10,
            totalSeats: 80,
          },
        ],
      },
      {
        name: 'IMovies Metroplex Cinebar',
        location: 'Sunset Boulevard',
        address: '1200 West Sunset Blvd',
        city: 'Los Angeles',
        facilities: ['Dolby Cinema', 'RealD 3D', 'Luxury Plush Seats', 'Artisan Coffee', 'Free Parking'],
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
      {
        name: 'IMovies Starlight Multiplex',
        location: 'Bay Area Waterfront',
        address: '450 Marina Way, Pier 39',
        city: 'San Francisco',
        facilities: ['4DX Motion', 'Dolby Atmos', 'In-Seat Service', 'Cocktail Bar'],
        image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&auto=format&fit=crop&q=80',
        screens: [
          {
            screenNumber: 1,
            screenName: 'Screen 1 - 4DX Extreme',
            soundSystem: 'Acoustic Sound Matrix',
            screenType: '4DX Motion Cinema',
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            seatsPerRow: 10,
            totalSeats: 70,
          },
        ],
      },
    ]);

    console.log(`Created ${cinemas.length} Cinemas.`);

    // 3. Seed Movies
    const movies = await Movie.create([
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
      {
        title: 'Laugh Track: Stand-Up Confidential',
        description:
          'A hilarious comedy chronicling three ambitious street performers who accidentally book a tour across world-famous arenas, masquerading as international comedic superstars.',
        posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&auto=format&fit=crop&q=80',
        genre: ['Comedy'],
        language: ['English', 'Spanish'],
        duration: 104,
        releaseDate: new Date('2026-10-05'),
        cast: ['Kevin Hart', 'Paul Rudd', 'Awkwafina'],
        director: 'Taika Waititi',
        rating: 7.9,
        status: 'now_showing',
        trailerUrl: '',
        ageRating: 'PG-13',
      },
      {
        title: 'Apex Predator: Deep Wilderness',
        description:
          'High in the Yukon wilderness, an elite search and rescue team encounters an unclassified prehistoric predator revived by thawing permafrost.',
        posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80',
        genre: ['Action', 'Thriller'],
        language: ['English'],
        duration: 118,
        releaseDate: new Date('2026-12-05'),
        cast: ['Tom Hardy', 'Karl Urban', 'Charlize Theron'],
        director: 'George Miller',
        rating: 8.8,
        status: 'upcoming',
        trailerUrl: '',
        ageRating: 'R',
      },
    ]);

    console.log(`Created ${movies.length} Movies.`);

    // 4. Generate Shows for Now Showing Movies
    // Helper to generate seating layout
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

    const nowShowingMovies = movies.filter((m) => m.status === 'now_showing');
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const showTimes = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];

    const createdShows = [];
    for (const movie of nowShowingMovies) {
      for (const cinema of cinemas) {
        const screen = cinema.screens[0];
        const ticketPrice = { standard: 12, premium: 18, vip: 28 };

        for (const showDate of dates) {
          for (const startTime of showTimes) {
            const seats = buildSeats(
              screen.rows || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
              screen.seatsPerRow || 12,
              ticketPrice
            );

            // Pre-book a couple of random seats for realism on the first day
            if (showDate === dates[0]) {
              const bookedSample = ['C5', 'C6', 'E7', 'E8', 'F4'];
              seats.forEach((s) => {
                if (bookedSample.includes(s.seatId)) {
                  s.status = 'booked';
                  s.bookedBy = standardUser._id;
                  s.bookedAt = new Date();
                }
              });
            }

            createdShows.push({
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

    const savedShows = await Show.insertMany(createdShows);
    console.log(`Created ${savedShows.length} Shows across cinemas and dates.`);

    // 5. Seed a Sample Booking for the Standard User
    const firstShow = savedShows[0];
    const bookedSeats = [
      { seatId: 'E7', row: 'E', seatNumber: 7, category: 'Premium', price: 18 },
      { seatId: 'E8', row: 'E', seatNumber: 8, category: 'Premium', price: 18 },
    ];

    const sampleBooking = await Booking.create({
      bookingReference: 'IMV-SEED-9842',
      userId: standardUser._id,
      showId: firstShow._id,
      movieId: firstShow.movieId,
      cinemaId: firstShow.cinemaId,
      selectedSeats: bookedSeats,
      numberOfTickets: 2,
      ticketSubtotal: 36,
      convenienceFee: 5,
      taxes: 2.88,
      totalAmount: 43.88,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card (Visa)',
    });

    console.log(`Sample booking created: ${sampleBooking.bookingReference}`);

    console.log('\n=============================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Admin Login:    admin@imovies.com  / Admin@12345');
    console.log('User Login:     user@imovies.com   / User@12345');
    console.log('=============================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    await disconnectDB();
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
