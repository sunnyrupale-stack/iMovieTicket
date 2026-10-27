const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/imovies';

  try {
    const isLocal = uri.includes('localhost') || uri.includes('127.0.0.1');
    const timeout = isLocal ? 3000 : 10000;
    const maskedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log(`Connecting to MongoDB at: ${maskedUri} ...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeout,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`Standard MongoDB connection failed (${err.message}). Starting MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'imovies',
        },
      });
      const memoryUri = mongoMemoryServer.getUri();
      console.log(`MongoMemoryServer running at: ${memoryUri}`);

      const conn = await mongoose.connect(memoryUri);
      console.log('MongoDB Connected successfully using In-Memory MongoDB Server!');
      return conn;
    } catch (memErr) {
      console.error('Fatal error connecting to MongoDB or MongoMemoryServer:', memErr.message);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
