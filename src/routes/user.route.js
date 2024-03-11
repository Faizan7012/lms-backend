const express = require("express");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user.model");
const { userAuth } = require("../middlewares/user");



require('dotenv').config();
const userRoute = express.Router();



// employee register route
userRoute.post("/signup", async(req,res)=>{
    const { email, password , name , role} = req.body;

    try {
        const user = await userModel.findOne({ email });

        // Check if user already exists

        if (user) {
            return res.status(400).send({ "message": "User Already Present With this Email", status:false });
        }

        // Hashing the password before saving to the database
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                return res.status(500).send({ "message": "Error hashing password" , status:false  });
            }

            // Creating a new user instance

            const newUser = new userModel({
                email,
                role, 
                name,
                password: hash,
            });

            // Saving the new user to the database

            await newUser.save();
            res.status(200).send({ message: "Registration successful"  , status:true });
        });
    } catch (error) {
        res.status(500).send({ "message": error.message , status:false  });
    }
});

// employee login route
userRoute.post("/login", async(req,res)=>{
    // Extracting login credentials from request body
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (user) {
            // Comparing the hashed password
            bcrypt.compare(password, user.password, async (err, result) => {
                if (result) {
                
                    // Creating a JWT token upon successful login
                    const token = jwt.sign({ userId: user._id , userRole : user.role }, process.env.JWT_SECRET)
                    res.status(200).send({ "message": "Login Successful",status:true, user, token  });
                } if (err || !result) {
                    res.status(400).send({ "message": "Incorrect email or password, please try again." , status:false  });
                }
            });
        } else {
            res.status(400).send({ "message": "Incorrect email or password, please try again." , status:false});
        }
    } catch (error) {
        res.status(400).send({ "message": error.message });
    }
});

  userRoute.post('/add-courses/',userAuth , async (req, res) => {
    const { userId } = req.body;
    const { courseIds } = req.body; 
  
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).send({ message: 'User not found' , status:false });
      }
  
      // Assuming courseIds is an array containing three course ids
      user.course.push(...courseIds);
      user.isSelected = true
      await user.save();
  
      res.status(200).send({ message: 'Courses added successfully', status:true });
    } catch (error) {
      console.error('Error adding courses:', error);
      res.status(500).send({ message: 'Internal server error', status:false });
    }
  });

  userRoute.get('/getcourses/',userAuth ,  async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await userModel.findById(userId).populate("course");
  
      if (!user) {
        return res.status(404).send({ message: 'User not found', status:false });
      }
  
      // Assuming courseIds is an array containing three course ids
   
  
      res.status(200).send({ message: 'Courses Found successfully' , courses : user.course , status:true });
    } catch (error) {

      res.status(500).send({ message: 'Internal server error' , status:false});
    }
  });
module.exports = {userRoute}