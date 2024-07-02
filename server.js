//we have imported all the packages that are required for this project
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");     //this is imported from db.js file of config folder

//env config
dotenv.config();

//router import from routes folder files
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

//mongodb connection
connectDB();       //function defined in config folder db.js

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes use after importing them above
app.use("/api/v1/user", userRoutes); //when we have a URL starting with this it request goes in userRoutes file which further has more functions to call and routes
app.use("/api/v1/blog", blogRoutes); ////when we have a URL starting with this it request goes in blogRoutes file which further has more functions to call and routes

// Port
const PORT = process.env.PORT || 8080;  //it will get value of PORT from .env file using process object in case it didnt get it from there so we have used a OR || 8080 so it will use it
//listen
app.listen(PORT, () => {
  console.log( //by this we see output on console whenever server starts
    `Server Running on ${process.env.DEV_MODE} mode port no ${PORT}`.bgCyan
      .white
  ); 
});
