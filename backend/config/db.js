const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Veritabanı bağlantısı başarılı");
  } catch (error) {
    console.error("Veritabanı bağlantısı hatası:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
