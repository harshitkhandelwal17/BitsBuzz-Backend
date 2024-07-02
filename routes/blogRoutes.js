const express = require("express"); //import express to create routes
const { //importing callback functions from blog controllers to blog routes
  getAllBlogsController,
  createBlogController,
  updateBlogController,
  getBlogByIdController,
  deleteBlogController,
  userBlogControlller,
} = require("../controllers/blogControlller");

//to cretae router object
const router = express.Router();

//different routes created below
// GET || all blogs route
router.get("/all-blog", getAllBlogsController);  //(path route/name or URL pattern, controller or callback function for this functionality)

//POST || create blog
router.post("/create-blog", createBlogController);  

//PUT || update blog
router.put("/update-blog/:id", updateBlogController);  //for update we will use put type method, we will update on basis of id

//GET || to get SIngle Blog Details
router.get("/get-blog/:id", getBlogByIdController);  //get on basis of ID

//DELETE || delete blog
router.delete("/delete-blog/:id", deleteBlogController);  //delete type method, deletion on basis of id

//GET || to get blog of a single user or on basis of user
router.get("/user-blog/:id", userBlogControlller);  

module.exports = router;  //export router object created

//we will create all this  callback functions in blog controllers file
