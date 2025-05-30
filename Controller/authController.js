import userModel from "../Model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// Register a new user
export async function registerUser(req, res) {
  try {
    // console.log("Request body:", req.body);
    const { username, email, password, avatar } = req.body;
    console.log("Registering user:", username, email);
    // Check if user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(403).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create new user
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      avatar: avatar || "",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error", error);
    res.status(500).json({ message: "Server Error: Unable to register user" });
  }
}

// Login user and generate a JWT token
export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    //Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    //Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid email or password" });
    }

    //Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error: Unable to login user" });
  }
}

//Authenticate and get user details
export async function authenticate(req, res) {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    //Verify JWT token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(verified.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
}
