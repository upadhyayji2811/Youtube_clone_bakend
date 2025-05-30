import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  category: { type: String, required: true },
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
  uploader: { type: String },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  uploadDate: { type: Date },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

  // Track users who liked and disliked
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const videoModel = mongoose.model("Video", videoSchema);
export default videoModel;
