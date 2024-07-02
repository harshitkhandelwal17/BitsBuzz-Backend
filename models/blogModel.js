//this is model for blog
const mongoose = require("mongoose"); //import mongoose for model creation
//we will define a schema for blog structure
const blogSchema = new mongoose.Schema( //this is an object
  {
    title: {
      type: String,
      require: [true, "title is required"],   //array to keep validation msg at same place
    },
    description: {
      type: String,
      required: [true, "description is require"],  //it is required or compulsory
    },
    image: {
      type: String,
      required: [true, "image is require"],   //image string means image link etc
    },
    user: {   //to mantain relation bw blog and user
      type: mongoose.Types.ObjectId,   //we will do it using this mongoose function
      ref: "User",   //pass the reference or model name you want to relate
      require: [true, "user id is required"],  //required true along with msg
    },
  },
  { timestamps: true }  //timestamp of blog posting will be recorded
);
//since we have created a schema now we will pass its reference to a model as shown below 
const blogModel = mongoose.model("Blog", blogSchema);
//and then export the model so that other files can use it
module.exports = blogModel;

//since our schema model of blog is ready now we can create and delete blogs using this
