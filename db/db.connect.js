const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Error connecting to Database:", error);
  }
};

module.exports = { initializeDatabase };
