const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MongoDB_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // const conn = await mongoose.connect("mongodb://127.0.0.1:27017/test");
    console.log(`MongoDB connected : ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error}`.red.bold);
  }
};

module.exports = connectDB;
