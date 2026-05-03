const dns = require("dns");
const mongoose = require("mongoose");

dns.setDefaultResultOrder("ipv4first");

const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    global.__AURA_DB_READY__ = false;
    console.warn("MONGO_URI not found. Running AURA backend in demo data mode.");
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      family: 4,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    global.__AURA_DB_READY__ = true;
    console.log("MongoDB Atlas connected");
  } catch (error) {
    global.__AURA_DB_READY__ = false;
    console.error(`MongoDB connection failed: ${error.message}`);
    console.warn("Falling back to demo data mode.");
  }
};

module.exports = connectDatabase;
