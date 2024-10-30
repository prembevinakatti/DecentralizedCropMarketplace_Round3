const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("MongoDB Connected");
      })
      .catch((error) => {
        console.error(
          "Error connecting to Mongo DB in catch : " + error.message
        );
      });
  } catch (error) {
    console.log("Error connecting to Mongo DB : " + error.message);
  }
};

module.exports = connectDB;

