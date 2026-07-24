import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Register User
export const registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;


    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }


    // Password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });


    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// Login User
export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;


   // Find user
const user = await User.findOne({ email });

if (!user) {
  return res.status(404).json({
    message: "User not found",
  });
}

if (user.googleAuth) {
  return res.status(400).json({
    message: "Please login with Google",
  });
}


    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }


    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "User profile",
      user: req.user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// Google Login
export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleAuth: true,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get All Users (Admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};