const mongoose = require("mongoose");

const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB connected... (Local)");
  } catch (error) {
    console.log("Mongo connection failed... ", error);
    process.exit(1);
  }
};

module.exports = mongoConnect;
