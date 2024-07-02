const express = require("express"); //import express here
//with help of express we can create router objects using which we perform routing
const {  //these are auto imported while defining below
  getAllUsers,
  registerController,
  loginController,
} = require("../controllers/userContoller");

//router object, target express since it has router objects
const router = express.Router();

// GET ALL USERS || GET
router.get("/all-users", getAllUsers);   //getAllUsers is a callback function defined in userController.js imported it here

// CREATE USER || POST
router.post("/register", registerController); //registerController is a callback function defined in userController.js imported it here

//LOGIN || POST
router.post("/login", loginController);   //loginController is a callback function defined in userController.js imported it here

module.exports = router; //we will export router and import in server.js file
