const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`!!!! MONGODB CONNECTION ERROR !!!!`);
    console.error(`Message: ${error.message}`);
    console.error(`Probable cause: Your current IP address might not be whitelisted in MongoDB Atlas.`);
    console.error(`Solution: Login to MongoDB Atlas, go to "Network Access", and add your current IP.`);
    console.error(`Alternative: Use a local MongoDB instance (mongodb://localhost:27017/hms)`);

    // Disable buffering so that subsequent queries fail immediately with a "not connected" error
    // instead of waiting 10 seconds and throwing a timeout.
    mongoose.set('bufferCommands', false);
  }
};

module.exports = connectDB;
