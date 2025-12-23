const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/projectplusdb"; // fallback for local

    await mongoose.connect(mongoUri); // ✅ Mongoose v7+, no options needed
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
