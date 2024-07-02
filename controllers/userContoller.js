//here we will keep all the callback functions
const userModel = require("../models/userModel");     //import it to find user
const bcrypt = require("bcrypt");   //for hashing password
//create user or register user
exports.registerController = async (req, res) => {     //in callback function we have req and res
  try { //success and failure is handled best in try catch block
    const { username, email, password } = req.body;     //other than token all data comes in request body//while registering we will be requiring these fields
    //validation
    if (!username || !email || !password) {  //if any of these 3 fields is missing then he will not be able to register this is first validation
      return res.status(400).send({
        success: false,
        message: "Please fill all the fields to register",
      });
    }
    //existing user , it will check email wether it is an existing user or not
    const exisitingUser = await userModel.findOne({ email });   //we will find on the basis of email in userModel
    if (exisitingUser) {    //now checking if existing or it already registered then
      return res.status(401).send({
        success: false,
        message: "user already exists in our system",
      });
    }
    //salt round =10 below
    const hashedPassword = await bcrypt.hash(password, 10);  //used to hash password for making it safe and secure

    //save new user, if above conditions are evaluated successfully
    const user = new userModel({ username, email, password: hashedPassword });
    await user.save();  //to save new user with above details, new user will be created
    return res.status(201).send({ //status 201 user cretaed
      success: true,
      message: "New user created !",
      user,
    });
  } catch (error) {
    console.log(error);   //if any error print it on console
    return res.status(500).send({
      message: "Error In Register callback",   //json response
      success: false,                 
      error,                      //print error
    });
  }
};

// get all users, this function is created here and exported to user routes files, this function helps to get all users data in our application
exports.getAllUsers = async (req, res) => {
  try {    //here we dont have to get anything from user directly send using user model
    const users = await userModel.find({});   //await of user model, it will find everything in the model
    return res.status(200).send({
      userCount: users.length, //to tell count of users
      success: true,
      message: "Data of all the users",
      users,  //will parse the users
    });
  } catch (error) {
    console.log(error);   //print error on console or terminal
    return res.status(500).send({   //500 is internal server error
      success: false,
      message: "Error In Get ALl Users",   //print message as response as well
      error,              //parse error as it is
    });
  }
};

//callback function for user login
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;  //get email and password from user
    //validation if either of email or password is not entered by user
    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "Please provide email or password", //if anyone is missing
      });
    }
    //check user wether he is registered or not since he is trying to login
    const user = await userModel.findOne({ email });  //we will search by email wether he is registered or not by using findOne in userModel 
    if (!user) { //if email not found in DB
      return res.status(200).send({
        success: false,
        message: "email is not registerd",
      });
    }
    //now if above condition also passes that user is valid in our app then we will check password
    const isMatch = await bcrypt.compare(password, user.password);  //given password will be compared with password in DB
    if (!isMatch) {  //if entered password is wrong
      return res.status(401).send({
        success: false,
        message: "Invlid username or password", //will be displayed since password didnt matched
      });
    }
    //if above case also didnt worked means password is correct and user will be loggedin
    return res.status(200).send({
      success: true,
      messgae: "login successfull", //print msg that login is success since above cases didnt worked
      user, //parse on user
    });
  } catch (error) {
    console.log(error); //print error on console
    return res.status(500).send({
      success: false,
      message: "Error In Login Callback",   //print message on the api request failure
      error,    //parse the error as it is
    });
  }
};
