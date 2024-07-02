const mongoose = require("mongoose"); //import mongoose
const colors = require("colors");
const connectDB = async () => {  //using this we will establish connection
  try {
    await mongoose.connect(process.env.MONGO_URL);    //Mongo_URl will be get here from .env file as we can see proces.env object of env file is used 
    console.log(
      `Connected to MongoDB Database ${mongoose.connection.host}`.bgMagenta    //this will be printed when connection to mongoDB is successful
        .white
    );
  } catch (error) {
    console.log(`MONGO Connect Error ${error}`.bgRed.white); //if connection fails this will be printed on console
  }
};
//once the function is implemented export it 
module.exports = connectDB;
