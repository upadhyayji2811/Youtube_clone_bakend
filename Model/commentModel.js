import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    username: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const commentModel = new mongoose.model("Comment", commentSchema);

export default commentModel;
