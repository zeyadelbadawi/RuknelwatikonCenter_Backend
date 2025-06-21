const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/hospitalDB', {
  
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
