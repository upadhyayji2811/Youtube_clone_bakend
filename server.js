import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import videoRoutes from "./Routes/videos.js";
import authRoutes from "./Routes/auth.js";
import channelRoutes from "./Routes/channel.js";
import commentRoutes from "./Routes/comment.js";

// Initialize express app
const app = new express();

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Allow form data parsing
app.use(cors());

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const conn = await mongoose.connect(uri);
    console.log(
      `MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/comments", commentRoutes);
