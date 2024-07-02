const mongoose = require("mongoose");
const blogModel = require("../models/blogModel"); //import blog model
const userModel = require("../models/userModel");

//we will start implementing callback functions required in blogroutes here
//GET ALL BLOGS
exports.getAllBlogsController = async (req, res) => { //make it async since a callback function
  try {//use try catch block to handle response and error, in try blog we will get all blogs
    const blogs = await blogModel.find({}).populate("user");  //from blog model we will find everything and store in blogs variable, populate user so that we can find user along with the blog
    if (!blogs) { //now we will check if blogs are not found case
      return res.status(200).send({
        success: false,
        message: "No Blogs Found",
      });
    }//if above conndition is not true and blogs are found then below case is returned
    return res.status(200).send({
      success: true,
      BlogCount: blogs.length, //we will tell no. of blogs, to get it we will use .length function on blogs
      message: "All Blogs list :",
      blogs,  //all blogs here parsed
    });
  } catch (error) {
    console.log(error);    //print error as it is on console or terminal
    return res.status(500).send({
      success: false,
      message: "Error WHile Getting Blogs",  //return json msg
      error,  //print or parse error as it is
    });
  }
};

//Create Blog function
exports.createBlogController = async (req, res) => {
  try {//here we will create blog post
    const { title, description, image, user } = req.body; //body of request will contain this fields for blog creatiion, this feileds are mandatory
    //validation to ensure user has given all things for blog creation
    if (!title || !description || !image || !user) {  //if any of these 4 things is missing then blog wont be created
      return res.status(400).send({
        success: false,
        message: "Please provide all fields.",
      });
    }//after above validation we will check if user already exists or not
    const exisitingUser = await userModel.findById(user); //by this we will fetch user if present and store it in existing user
    //validaton, to check user is present or not
    if (!exisitingUser) {  //if user not present execute this
      return res.status(404).send({
        success: false,
        message: "unable to find user",
      });
    }
    //once above validation is done and we know user exists then create and save this blog
    const newBlog = new blogModel({ title, description, image, user }); //if above validations are done and everything is fine then we need to save this blog
    const session = await mongoose.startSession(); //create session and start it
    session.startTransaction();     //once session started we will perform transactions
    await newBlog.save({ session });    //save new blog on basis of session
    exisitingUser.blogs.push(newBlog);   //add this new blog in blog array of existing user
    await exisitingUser.save({ session });  //save it on the basis of this session
    await session.commitTransaction(); //to save this session and the transaction we did
    await newBlog.save();     //we will save the blog by this, before saving we perform above operations
    return res.status(201).send({  //after successfull blog creation this will be returned at the end
      success: true,
      message: "Blog Created!", //message printed
      newBlog, //new blog will be passed here as it is
    });
  } catch (error) {
    console.log(error); //print error on console or terminal
    return res.status(400).send({
      success: false,
      message: "Error while creating blog", //message print of error
      error, //pass error as it is here
    });
  }
};

//Update Blog function, to update an existing blog
exports.updateBlogController = async (req, res) => { //make this function async and it will have a req and res since its a callback function
  try {//try catch block to handle response and error respectively
    const { id } = req.params;  //update will be done on basis of id so we will get this id from url by destructuring
    const { title, description, image } = req.body;  //get these field to update from body of request send by user
    const blog = await blogModel.findByIdAndUpdate( //to get the blog by id update will be done on basis of id
      id,  //pass the id
      { ...req.body }, //spread or extended contents of req.body here as it is
      { new: true }  //we need to pass this third parameter since it is an update function
    );
    return res.status(200).send({  //blog will be successfully updated after this
      success: true,
      message: "Buzz Updated!",
      blog,  //passed updated blog here
    });
  } catch (error) {
    console.log(error); //print error on console
    return res.status(400).send({
      success: false,
      message: "Error while updating blog.", //return response message
      error,            //pass error as it is here
    });
  }
};

//get single blog details function
exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;  //we will get id from params or url of request
    const blog = await blogModel.findById(id);  //in blogModel we will find using Id and store that blog in blog
    if (!blog) {  //we will check if blog is not found then execute this
      return res.status(404).send({
        success: false,
        message: "blog not found with this ID",
      });
    }//if above case didnt work and blog is found then we will return it
    return res.status(200).send({
      success: true,
      message: "single blog fetched",
      blog, //pass the blog fetched here as it is
    });
  } catch (error) {
    console.log(error);   //print error on console or terminal
    return res.status(400).send({
      success: false,
      message: "error while getting single blog", //json response msg
      error, //pass error object as it is here error will be shown
    });
  }
};

//Delete Blog function
exports.deleteBlogController = async (req, res) => {
  try {
    const blog = await blogModel
      // .findOneAndDelete(req.params.id)   //this one doesnt work properly
      .findByIdAndDelete(req.params.id)//will find blog id from params or url of request an delete it
      .populate("user");  //using populate we mantain a relationship with other model and can do changes in them as well
    await blog.user.blogs.pull(blog); //now when we get the desired blog from above we get user from it, we pull or remove that blog from that users blog array this is how deletion works
    await blog.user.save(); //after removal update user
    return res.status(200).send({   //after deletion send the response
      success: true,
      message: "Buzz Deleted!",
    });
  } catch (error) {
    console.log(error);  //print error on console or terminal
    return res.status(400).send({
      success: false,
      message: "Erorr while deleting blog",  //json message
      error,  //pass error object as it is
    });
  }
};

//GET USER BLOG function
exports.userBlogControlller = async (req, res) => {
  try { //lets first get blogs of that user on basis of ID
    const userBlog = await userModel.findById(req.params.id).populate("blogs"); //we will get id from params or url, by populate we will get all blogs of that user
    if (!userBlog) { //we will check if userblogs not found with that user id
      return res.status(404).send({
        success: false,
        message: "blogs not found with this id",
      });
    }//if above validation is done and blogs does exist then we will return response as shown below
    return res.status(200).send({
      success: true,
      message: "these are user blogs",
      userBlog, //pass user blog as it is, these are blogs of particular user and will be displayed on My Blogs pages at client
    });
  } catch (error) {
    console.log(error);  //display error on console or terminal
    return res.status(400).send({
      success: false,
      message: "error in finding user blog",  //return json message
      error, //return or pass error as it is
    });
  }
};

//we have exported these function from here to routes file we will import them in blog routes to use them