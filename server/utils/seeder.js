const Movie = require("../models/movieModel");
const Theatre = require("../models/theatreModel");
const Show = require("../models/showModel");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");

const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("MongoDB is not currently connected. Live seed deferred until connection is active.");
      return;
    }
    const movieCount = await Movie.countDocuments();
    if (movieCount > 0) {
      console.log("Database already has movie data. Skipping seed.");
      return;
    }

    console.log("Seeding initial data to match curriculum screenshots...");

    // 1. Seed Admin
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin1234", salt);
    await Admin.create({
      username: "admin",
      email: "admin@imovies.com",
      password: adminPassword,
      role: "admin",
    });

    // 2. Seed User
    const userPassword = await bcrypt.hash("user1234", salt);
    await User.create({
      username: "tanishq",
      email: "tanishq@example.com",
      password: userPassword,
      role: "user",
    });

    // 3. Seed Theatres
    const theatres = await Theatre.insertMany([
      {
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
      {
        theatreName: "PVR Cinemas",
        theatreId: "TH-003",
        location: "Grand Galleria, Screen 4",
        balconySeatPrice: 300,
        balconySeatCount: 40,
        middleSeatPrice: 220,
        middleSeatCount: 60,
        lowerSeatPrice: 150,
        lowerSeatCount: 40,
      },
    ]);

    // 4. Seed Movies (from Screenshots 50 & 52: RRR, Baahubali 2, OG, RajaSaab, Toxic, Avatar, Baaghi 4, The pride of bharat)
    const movies = await Movie.insertMany([
      {
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
        movieName: "Rajasaab",
        description: "A romantic horror comedy that follows an adventurous protagonist in an ancient enigmatic palace.",
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
    ]);

    // 5. Seed Shows (to match Screenshot 49: Og at Srinivasa at 2:00 PM, 4:00 PM, 6:00 PM; Og at Gokul at 2:00 PM)
    await Show.insertMany([
      {
        adminEmail: "admin@imovies.com",
        showId: "SH-101",
        movieId: "Og",
        theatreName: "Srinivasa",
        showDate: "2025-09-25",
        showtime: "2:00 PM",
        tickets: {
          balcony: { bookedSeats: [101, 102], price: 250 },
          middle: { bookedSeats: [351, 352], price: 180 },
          lower: { bookedSeats: [], price: 120 },
        },
      },
      {
        adminEmail: "admin@imovies.com",
        showId: "SH-102",
        movieId: "Og",
        theatreName: "Srinivasa",
        showDate: "2025-09-25",
        showtime: "4:00 PM",
        tickets: {
          balcony: { bookedSeats: [], price: 250 },
          middle: { bookedSeats: [201], price: 180 },
          lower: { bookedSeats: [], price: 120 },
        },
      },
      {
        adminEmail: "admin@imovies.com",
        showId: "SH-103",
        movieId: "Og",
        theatreName: "Gokul",
        showDate: "2025-11-14",
        showtime: "2:00 PM",
        tickets: {
          balcony: { bookedSeats: [], price: 260 },
          middle: { bookedSeats: [], price: 190 },
          lower: { bookedSeats: [], price: 130 },
        },
      },
      {
        adminEmail: "admin@imovies.com",
        showId: "SH-104",
        movieId: "Baahubali 2: The Conclusion",
        theatreName: "Gokul",
        showDate: "2026-01-02",
        showtime: "9:30 PM",
        tickets: {
          balcony: { bookedSeats: [158], price: 260 },
          middle: { bookedSeats: [], price: 190 },
          lower: { bookedSeats: [], price: 130 },
        },
      },
      {
        adminEmail: "admin@imovies.com",
        showId: "SH-105",
        movieId: "Rrr",
        theatreName: "PVR Cinemas",
        showDate: "2025-10-10",
        showtime: "6:30 PM",
        tickets: {
          balcony: { bookedSeats: [], price: 300 },
          middle: { bookedSeats: [], price: 220 },
          lower: { bookedSeats: [], price: 150 },
        },
      },
    ]);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeder Error:", error.message);
  }
};

module.exports = seedDatabase;
