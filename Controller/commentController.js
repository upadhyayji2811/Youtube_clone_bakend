import videoModel from "../Model/videoModel.js";
import commentModel from "../Model/commentModel.js";

// Fetch all comments for a video
export async function getComments(req, res) {
  try {
    const comments = await commentModel
      .find({ videoId: req.params.videoId })
      .populate("userId");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Unable to fetch comments" });
  }
}

// Add a new comment
export async function addComment(req, res) {
  try {
    const { text, videoId } = req.body;
    const userId = req.user._id;
    const username = req.user.username;
    // console.log(userId, username);
    const newComment = new commentModel({
      text,
      userId,
      videoId,
      username,
    });
    await newComment.save();
    await videoModel.findByIdAndUpdate(
      videoId,
      { $push: { comments: newComment._id } },
      { new: true }
    );
    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    res.status(500).json({ error: "Server error: Failed to add comment" });
  }
}

// Edit a comment
export async function editComment(req, res) {
  try {
    const { text } = req.body;
    const updatedComment = await commentModel.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res
      .status(200)
      .json({ message: "comment Updated", text: updatedComment.text });
  } catch (error) {
    res.status(500).json({ error: "Server Error: Failed to update comment" });
  }
}

// Delete a comment
export async function deleteComment(req, res) {
  try {
    const deletedComment = await commentModel.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: Failed to delete comment" });
  }
}
