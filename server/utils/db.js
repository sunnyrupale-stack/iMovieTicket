const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_CONNECTION_LINK || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Imovies";

let hasConnectedOnce = false;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    hasConnectedOnce = true;
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    if (!hasConnectedOnce) {
      console.log("MongoDB is not running locally. Using in-memory fallback mockStore.");
    }
  }
};

// Handle connection events
mongoose.connection.on("error", (err) => {
  if (hasConnectedOnce) {
    console.error("MongoDB connection event error: ", err.message);
  }
});

mongoose.connection.on("disconnected", () => {
  if (hasConnectedOnce) {
    console.log("MongoDB disconnected. Reconnecting in 10s...");
    setTimeout(connectToMongo, 10000);
  }
});

module.exports = connectToMongo;
