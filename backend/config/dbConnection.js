const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    // throw new Error("Database Connection Failed");
    console.log(err);
  }
};

module.exports = connectDB;
