const mongoose = require("mongoose");  //import mongoose
//with help of mongoose we will define schema
//schema is what values we want and what kind of values we want to store
const userSchema = new mongoose.Schema(
  {
    username: {    //required is true it is compulsory, we will also validate to make application more secure
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],     //we have to hash password we will do it on registeration
    },
    blogs: [          //we have created an array of blogs since each user can have multiple blogs
      {
        type: mongoose.Types.ObjectId,   //for mantaining relation bw user and blog model
        ref: "Blog",
      },
    ],
  },
  { timestamps: true }   //timestamps will tell when this user was created
);

const userModel = mongoose.model("User", userSchema);   //User is the model or collection name and userSchema is the reference we passed

module.exports = userModel;  //export this model

//using this file database with the above schema models will be created 