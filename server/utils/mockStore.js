// In-memory store fallback with real movie data matching curriculum screenshots 50 & 52

const initialMovies = [
  {
    _id: "67b01001a1b2c3d4e5f60001",
    movieName: "Rrr",
    description: "A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.",
    genres: ["Action", "Drama", "Fantasy"],
    releaseDate: new Date("2022-03-25"),
    runtime: "182 min",
    certification: "UA",
    trailerUrl: "https://www.youtube.com/watch?v=NgBoMJy386M",
    media: "/posters/rrr.jpg",
    rating: 8.9,
    cast: ["N.T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60002",
    movieName: "Baahubali 2: the conclusion",
    description: "When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers to avenge his father's death.",
    genres: ["Action", "Drama", "Fantasy"],
    releaseDate: new Date("2017-04-28"),
    runtime: "167 min",
    certification: "UA",
    trailerUrl: "https://www.youtube.com/watch?v=qD-6d8Wo3do",
    media: "/posters/baahubali2.jpg",
    rating: 8.7,
    cast: ["Prabhas", "Rana Daggubati", "Anushka Shetty"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60003",
    movieName: "Og",
    description: "A fierce crime drama following an enigmatic underworld figure seeking vengeance and justice.",
    genres: ["Action", "Thriller"],
    releaseDate: new Date("2025-09-25"),
    runtime: "165 min",
    certification: "UA",
    trailerUrl: "https://www.youtube.com/watch?v=7Y5q41D8_hs",
    media: "/posters/og.jpg",
    rating: 9.1,
    cast: ["Pawan Kalyan", "Emraan Hashmi", "Priyanka Mohan"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60004",
    movieName: "Rajasaab",
    description: "A romantic horror comedy that follows an adventurous protagonist in an ancient enigmatic royal palace.",
    genres: ["Comedy", "Horror", "Romantic"],
    releaseDate: new Date("2025-12-05"),
    runtime: "155 min",
    certification: "UA",
    trailerUrl: "https://www.youtube.com/watch?v=YFZMBqyXkqQ",
    media: "/posters/rajasaab.jpg",
    rating: 8.4,
    cast: ["Prabhas", "Malavika Mohanan", "Nidhhi Agerwal"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60005",
    movieName: "Toxic",
    description: "A fairy tale for grown-ups set against the backdrop of the high-stakes international cartel.",
    genres: ["Action", "Thriller"],
    releaseDate: new Date("2026-04-10"),
    runtime: "160 min",
    certification: "A",
    trailerUrl: "https://www.youtube.com/watch?v=6bg5tM2jmUU",
    media: "/posters/toxic.jpg",
    rating: 8.8,
    cast: ["Yash", "Kiara Advani", "Nayanthara"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60006",
    movieName: "Avatar",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns, Jake must work with Neytiri.",
    genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    releaseDate: new Date("2026-10-01"),
    runtime: "192 min",
    certification: "UA",
    trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    media: "/posters/avatar.jpg",
    rating: 8.6,
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60007",
    movieName: "Baaghi 4",
    description: "The deadly journey of Ronnie as he faces new lethal adversaries in high-octane martial arts warfare.",
    genres: ["Action", "Thriller"],
    releaseDate: new Date("2025-09-05"),
    runtime: "145 min",
    certification: "UA",
    trailerUrl: "https://www.youtube.com/watch?v=1zXzkan38Qs",
    media: "/posters/baaghi4.jpg",
    rating: 8.1,
    cast: ["Tiger Shroff", "Sanjay Dutt"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60008",
    movieName: "The pride of bharat",
    description: "An epic biographical historical saga chronicling the valiant life and conquests of Chhatrapati Shivaji Maharaj.",
    genres: ["Action", "Historical", "Drama"],
    releaseDate: new Date("2026-01-02"),
    runtime: "175 min",
    certification: "UA",
    trailerUrl: "https://www.youtube.com/watch?v=F5qGZg-vOHs",
    media: "/posters/pride_of_bharat.jpg",
    rating: 9.3,
    cast: ["Rishab Shetty", "Pankaj Tripathi"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60009",
    movieName: "Ramayana",
    description: "An epic cinematic adaptation of the ancient Sanskrit legend following Lord Rama's righteous quest, valor, and devotion.",
    genres: ["Action", "Mythology", "Drama", "Fantasy"],
    releaseDate: new Date("2026-11-05"),
    runtime: "195 min",
    certification: "U",
    trailerUrl: "https://www.youtube.com/watch?v=YleIZgpTF6w",
    media: "/posters/ramayana.jpg",
    rating: 9.8,
    cast: ["Ranbir Kapoor", "Yash", "Sai Pallavi", "Sunny Deol"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60010",
    movieName: "Pushpa 2: The Rule",
    description: "Pushpa Raj expands his formidable red sandalwood empire facing intense retribution from SP Bhanwar Singh Shekhawat.",
    genres: ["Action", "Crime", "Thriller"],
    releaseDate: new Date("2024-12-05"),
    runtime: "200 min",
    certification: "UA",
    trailerUrl: "https://www.youtube.com/watch?v=g3JUbgOHgdw",
    media: "/posters/pushpa_2.jpg",
    rating: 9.2,
    cast: ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60011",
    movieName: "Kalki 2898 AD",
    description: "In a dystopian post-apocalyptic future, immortal warriors clash in an epic battle between cosmic forces of destiny and tyranny.",
    genres: ["Action", "Sci-Fi", "Fantasy"],
    releaseDate: new Date("2024-06-27"),
    runtime: "181 min",
    certification: "UA",
    trailerUrl: "https://www.youtube.com/watch?v=GL0rx4QkZpI",
    media: "/posters/kalki_2898_ad.jpg",
    rating: 8.9,
    cast: ["Prabhas", "Amitabh Bachchan", "Kamal Haasan", "Deepika Padukone"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60012",
    movieName: "Deadpool & Wolverine",
    description: "Wade Wilson and a brooding Wolverine team up across the multiverse in an explosive, irreverent superhero adventure.",
    genres: ["Action", "Comedy", "Sci-Fi"],
    releaseDate: new Date("2024-07-26"),
    runtime: "128 min",
    certification: "A",
    trailerUrl: "https://www.youtube.com/watch?v=73_1biulkYk",
    media: "/posters/deadpool_wolverine.jpg",
    rating: 8.8,
    cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60013",
    movieName: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    releaseDate: new Date("2024-03-01"),
    runtime: "166 min",
    certification: "UA",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    media: "/posters/dune_2.jpg",
    rating: 9.0,
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60014",
    movieName: "Gladiator II",
    description: "Years after witnessing the death of Maximus, Lucius enters the Colosseum to fight for the future and glory of Rome.",
    genres: ["Action", "Drama", "Adventure"],
    releaseDate: new Date("2024-11-22"),
    runtime: "148 min",
    certification: "A",
    trailerUrl: "https://www.youtube.com/watch?v=4rgYUipGJNo",
    media: "/posters/gladiator_2.jpg",
    rating: 8.5,
    cast: ["Paul Mescal", "Pedro Pascal", "Denzel Washington"],
  },
  {
    _id: "67b01001a1b2c3d4e5f60015",
    movieName: "Oppenheimer",
    description: "The gripping biographical story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    genres: ["Drama", "History"],
    releaseDate: new Date("2023-07-21"),
    runtime: "180 min",
    certification: "UA",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    media: "/posters/oppenheimer.jpg",
    rating: 9.1,
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
  },
];

const initialTheatres = [
  {
    _id: "67b02001a1b2c3d4e5f60001",
    theatreName: "Srinivasa",
    theatreId: "TH-001",
    location: "Downtown Plaza, Screen 1",
    balconySeatPrice: 250,
    balconySeatCount: 30,
    middleSeatPrice: 180,
    middleSeatCount: 50,
    lowerSeatPrice: 120,
    lowerSeatCount: 40,
  },
  {
    _id: "67b02001a1b2c3d4e5f60002",
    theatreName: "Gokul",
    theatreId: "TH-002",
    location: "Central Mall, Screen 2",
    balconySeatPrice: 260,
    balconySeatCount: 30,
    middleSeatPrice: 190,
    middleSeatCount: 50,
    lowerSeatPrice: 130,
    lowerSeatCount: 40,
  },
];

const initialShows = [
  {
    _id: "67b03001a1b2c3d4e5f60001",
    adminEmail: "admin@imovies.com",
    showId: "SH-101",
    movieId: "Og",
    theatreName: "Srinivasa",
    showDate: "Sep 25, 2025",
    showtime: "2:00 PM",
    tickets: {
      balcony: { bookedSeats: [101, 102], price: 250 },
      middle: { bookedSeats: [351, 352], price: 180 },
      lower: { bookedSeats: [], price: 120 },
    },
  },
  {
    _id: "67b03001a1b2c3d4e5f60002",
    adminEmail: "admin@imovies.com",
    showId: "SH-102",
    movieId: "Og",
    theatreName: "Srinivasa",
    showDate: "Sep 25, 2025",
    showtime: "4:00 PM",
    tickets: {
      balcony: { bookedSeats: [], price: 250 },
      middle: { bookedSeats: [201], price: 180 },
      lower: { bookedSeats: [], price: 120 },
    },
  },
  {
    _id: "67b03001a1b2c3d4e5f60003",
    adminEmail: "admin@imovies.com",
    showId: "SH-103",
    movieId: "Og",
    theatreName: "Srinivasa",
    showDate: "Sep 25, 2025",
    showtime: "6:00 PM",
    tickets: {
      balcony: { bookedSeats: [], price: 250 },
      middle: { bookedSeats: [], price: 180 },
      lower: { bookedSeats: [], price: 120 },
    },
  },
  {
    _id: "67b03001a1b2c3d4e5f60004",
    adminEmail: "admin@imovies.com",
    showId: "SH-104",
    movieId: "Og",
    theatreName: "Gokul",
    showDate: "Nov 14, 2025",
    showtime: "2:00 PM",
    tickets: {
      balcony: { bookedSeats: [], price: 260 },
      middle: { bookedSeats: [], price: 190 },
      lower: { bookedSeats: [], price: 130 },
    },
  },
  {
    _id: "67b03001a1b2c3d4e5f60005",
    adminEmail: "admin@imovies.com",
    showId: "SH-105",
    movieId: "The pride of bharat",
    theatreName: "Gokul",
    showDate: "Jan 2, 2026",
    showtime: "9:30 PM",
    tickets: {
      balcony: { bookedSeats: [158], price: 200 },
      middle: { bookedSeats: [], price: 160 },
      lower: { bookedSeats: [], price: 110 },
    },
  },
  {
    _id: "67b03001a1b2c3d4e5f60006",
    adminEmail: "admin@imovies.com",
    showId: "SH-106",
    movieId: "Ramayana",
    theatreName: "Srinivasa",
    showDate: "Nov 5, 2026",
    showtime: "6:00 PM",
    tickets: {
      balcony: { bookedSeats: [101, 102], price: 280 },
      middle: { bookedSeats: [], price: 200 },
      lower: { bookedSeats: [], price: 140 },
    },
  },
  {
    _id: "67b03001a1b2c3d4e5f60007",
    adminEmail: "admin@imovies.com",
    showId: "SH-107",
    movieId: "Ramayana",
    theatreName: "Gokul",
    showDate: "Nov 5, 2026",
    showtime: "9:00 PM",
    tickets: {
      balcony: { bookedSeats: [], price: 300 },
      middle: { bookedSeats: [], price: 220 },
      lower: { bookedSeats: [], price: 150 },
    },
  },
  {
    _id: "67b03001a1b2c3d4e5f60008",
    adminEmail: "admin@imovies.com",
    showId: "SH-108",
    movieId: "Deadpool & Wolverine",
    theatreName: "Srinivasa",
    showDate: "Nov 15, 2025",
    showtime: "7:00 PM",
    tickets: {
      balcony: { bookedSeats: [], price: 250 },
      middle: { bookedSeats: [], price: 180 },
      lower: { bookedSeats: [], price: 120 },
    },
  },
  {
    _id: "67b03001a1b2c3d4e5f60009",
    adminEmail: "admin@imovies.com",
    showId: "SH-109",
    movieId: "Dune: Part Two",
    theatreName: "Gokul",
    showDate: "Nov 16, 2025",
    showtime: "8:00 PM",
    tickets: {
      balcony: { bookedSeats: [], price: 260 },
      middle: { bookedSeats: [], price: 190 },
      lower: { bookedSeats: [], price: 130 },
    },
  },
  {
    _id: "67b03001a1b2c3d4e5f60010",
    adminEmail: "admin@imovies.com",
    showId: "SH-110",
    movieId: "Pushpa 2: The Rule",
    theatreName: "Srinivasa",
    showDate: "Dec 5, 2024",
    showtime: "9:30 PM",
    tickets: {
      balcony: { bookedSeats: [], price: 280 },
      middle: { bookedSeats: [], price: 200 },
      lower: { bookedSeats: [], price: 140 },
    },
  },
  {
    _id: "67b03001a1b2c3d4e5f60011",
    adminEmail: "admin@imovies.com",
    showId: "SH-111",
    movieId: "Kalki 2898 AD",
    theatreName: "Gokul",
    showDate: "Nov 20, 2025",
    showtime: "4:00 PM",
    tickets: {
      balcony: { bookedSeats: [], price: 250 },
      middle: { bookedSeats: [], price: 180 },
      lower: { bookedSeats: [], price: 120 },
    },
  },
];

const initialBookings = [
  {
    _id: "67b04001a1b2c3d4e5f60001",
    bookingId: "BK-842911",
    userEmail: "g.udaykumar@gmail.com",
    showId: "SH-101",
    ticketsData: {
      movieName: "Og",
      theatreName: "Srinivasa",
      showDate: "Sep 25, 2025",
      showtime: "2:00 PM",
      tier: "middle",
      seats: [351, 352],
      totalPrice: 260,
      poster: "/posters/og.jpg",
    },
    totalAmount: 260,
    paymentStatus: "Completed",
    status: "Confirmed",
    createdAt: new Date(),
  },
  {
    _id: "67b04001a1b2c3d4e5f60002",
    bookingId: "BK-842912",
    userEmail: "g.udaykumar@gmail.com",
    showId: "SH-102",
    ticketsData: {
      movieName: "Og",
      theatreName: "Srinivasa",
      showDate: "Sep 25, 2025",
      showtime: "21:00",
      tier: "balcony",
      seats: [152],
      totalPrice: 1762,
      poster: "/posters/og.jpg",
    },
    totalAmount: 1762,
    paymentStatus: "Completed",
    status: "Confirmed",
    createdAt: new Date(),
  },
  {
    _id: "67b04001a1b2c3d4e5f60003",
    bookingId: "BK-842913",
    userEmail: "tanishq@example.com",
    showId: "SH-105",
    ticketsData: {
      movieName: "The pride of bharat",
      theatreName: "Gokul",
      showDate: "Jan 2, 2026",
      showtime: "21:30",
      tier: "balcony",
      seats: [158],
      totalPrice: 200,
      poster: "/posters/pride_of_bharat.jpg",
    },
    totalAmount: 200,
    paymentStatus: "Completed",
    status: "Confirmed",
    createdAt: new Date(),
  },
];

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const STORE_FILE = path.join(DATA_DIR, "persistent_store.json");

const initialReviews = [
  {
    _id: "67b05001a1b2c3d4e5f60001",
    movieId: "67b01001a1b2c3d4e5f60003",
    userEmail: "cinema_fan@gmail.com",
    username: "Cinema Fan",
    rating: 9,
    comment: "Incredible action sequences and great background score!",
    createdAt: new Date(),
  },
];

const initialUsers = [
  {
    _id: "67b06001a1b2c3d4e5f60001",
    username: "tanishq",
    email: "tanishq@example.com",
    role: "user",
  },
  {
    _id: "67b06001a1b2c3d4e5f60002",
    username: "udaykumar",
    email: "g.udaykumar@gmail.com",
    role: "user",
  },
];

const initialAdmins = [
  {
    _id: "67b07001a1b2c3d4e5f60001",
    username: "admin",
    email: "admin@imovies.com",
    role: "admin",
  },
];

function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(raw);

      // Merge base movies with any movies stored in file
      const loadedMovies = Array.isArray(parsed.movies) && parsed.movies.length > 0 ? parsed.movies : [...initialMovies];
      const movieIds = new Set(loadedMovies.map((m) => m._id));
      for (const m of initialMovies) {
        if (!movieIds.has(m._id)) {
          loadedMovies.push(m);
        }
      }

      // Merge base theatres
      const loadedTheatres =
        Array.isArray(parsed.theatres) && parsed.theatres.length > 0 ? parsed.theatres : [...initialTheatres];
      const theatreIds = new Set(loadedTheatres.map((t) => t._id));
      for (const t of initialTheatres) {
        if (!theatreIds.has(t._id)) {
          loadedTheatres.push(t);
        }
      }

      // Merge base shows
      const loadedShows = Array.isArray(parsed.shows) && parsed.shows.length > 0 ? parsed.shows : [...initialShows];
      const showIds = new Set(loadedShows.map((s) => s._id || s.showId));
      for (const s of initialShows) {
        if (!showIds.has(s._id || s.showId)) {
          loadedShows.push(s);
        }
      }

      return {
        movies: loadedMovies,
        theatres: loadedTheatres,
        shows: loadedShows,
        bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [...initialBookings],
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [...initialReviews],
        users: Array.isArray(parsed.users) ? parsed.users : [...initialUsers],
        admins: Array.isArray(parsed.admins) ? parsed.admins : [...initialAdmins],
      };
    }
  } catch (err) {
    console.error("Error reading persistent store:", err.message);
  }

  return {
    movies: [...initialMovies],
    theatres: [...initialTheatres],
    shows: [...initialShows],
    bookings: [...initialBookings],
    favorites: [],
    reviews: [...initialReviews],
    users: [...initialUsers],
    admins: [...initialAdmins],
  };
}

const loadedData = loadStore();

const mockStore = {
  movies: loadedData.movies,
  theatres: loadedData.theatres,
  shows: loadedData.shows,
  bookings: loadedData.bookings,
  favorites: loadedData.favorites,
  reviews: loadedData.reviews,
  users: loadedData.users,
  admins: loadedData.admins,
};

function saveStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(
      STORE_FILE,
      JSON.stringify(
        {
          movies: mockStore.movies,
          theatres: mockStore.theatres,
          shows: mockStore.shows,
          bookings: mockStore.bookings,
          favorites: mockStore.favorites,
          reviews: mockStore.reviews,
          users: mockStore.users,
          admins: mockStore.admins,
        },
        null,
        2
      )
    );
  } catch (err) {
    console.error("Error writing persistent store:", err.message);
  }
}

mockStore.save = saveStore;

// Save initial snapshot if file does not exist
if (!fs.existsSync(STORE_FILE)) {
  saveStore();
}

// Background auto-flush every 2 seconds so in-place edits (e.g. bookedSeats, cancellations) always persist
setInterval(saveStore, 2000).unref();

module.exports = mockStore;
