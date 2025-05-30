import videoModel from "../Model/videoModel.js";
import channelModel from "../Model/channelModel.js";

// Fetch all videos
export async function getVideos(req, res) {
  try {
    const videos = await videoModel.find().populate("channelId");
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Unable to fetch videos" });
  }
}

// Fetch a single video by ID
export async function getVideoById(req, res) {
  try {
    const video = await videoModel
      .findById(req.params.id)
      .populate("channelId");
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sever error: Unable to fetch video by Id" });
  }
}
export async function getVideoByChannelHandle(req, res) {
  try {
    const { handle } = req.params;

    const channel = await channelModel.findOne({ handle });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    //Fetch all videos uploaded by this channel
    const videos = await videoModel.find({ channelId: channel._id });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching channel videos:", error);
    res.status(500).json({ message: "Server Error : Unable to fetch videos" });
  }
}

// Like a video
export async function likeVideo(req, res) {
  try {
    const userId = req.user._id; //User Id from authentication moddleware

    const video = await videoModel.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // If user has already liked, remove like
    if (video.likedBy.includes(userId)) {
      video.likedBy = video.likedBy.filter(
        (id) => id && id.toString() !== userId.toString()
      );
      video.likes -= 1;
    } else {
      // If user has disliked before, remove dislike
      if (video.dislikedBy.includes(userId)) {
        video.dislikedBy = video.dislikedBy.filter(
          (id) => id && id.toString() !== userId.toString()
        );
        video.dislikes -= 1;
      }
      // Add like
      video.likedBy.push(userId);
      video.likes += 1;
    }
    await video.save();
    res.status(200).json({
      likes: video.likes,
      dislikes: video.dislikes,
      likedBy: video.likedBy,
      dislikedBy: video.dislikedBy,
    });
  } catch (error) {
    console.error("Liked error:", error);
    res.status(500).json({ message: "Server Error: Failed to like video" });
  }
}

// Dislike a video
export async function dislikeVideo(req, res) {
  try {
    const userId = req.user._id;

    const video = await videoModel.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // If user has already disliked, remove dislike
    if (video.dislikedBy.includes(userId)) {
      video.dislikedBy = video.dislikedBy.filter(
        (id) => id && id.toString() !== userId.toString()
      );
      video.dislikes -= 1;
    } else {
      // If user has liked before, remove like
      if (video.likedBy.includes(userId)) {
        video.likedBy = video.likedBy.filter(
          (id) => id && id.toString() !== userId.toString()
        );
        video.likes -= 1;
      }
      // Add dislike
      video.dislikedBy.push(userId);
      video.dislikes += 1;
    }
    await video.save();

    res.status(200).json({
      likes: video.likes,
      dislikes: video.dislikes,
      likedBy: video.likedBy,
      dislikedBy: video.dislikedBy,
    });
  } catch (error) {
    console.error("Error disliking video:", error);
    res.status(500).json({ message: "Server Error: Failed to dislike video" });
  }
}

// Upload a new video
export async function uploadVideo(req, res) {
  try {
    const {
      title,
      thumbnailUrl,
      videoUrl,
      description,
      category,
      channelId,
      uploader,
      views,
      likes,
      dislikes,
      comments,
    } = req.body;
    const newVideo = new videoModel({
      title,
      thumbnailUrl,
      videoUrl,
      description,
      category,
      channelId,
      uploader,
      uploadDate: new Date(),
      views,
      likes,
      dislikes,
      comments,
    });
    await newVideo.save();
    await channelModel.findByIdAndUpdate(channelId, {
      $push: { videos: newVideo._id },
    });
    res.status(201).json({ message: "Video uploaded", video: newVideo });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server error: Failed to upload video" });
  }
}

// Update a video by ID
export async function updateVideo(req, res) {
  try {
    const updatedVideo = await videoModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedVideo) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json({ message: "video Updated", video: updatedVideo });
  } catch (error) {
    res.status(500).json({ error: "Server Error: Failed to update video" });
  }
}

// Delete a video by ID
export async function deleteVideo(req, res) {
  try {
    const deletedVideo = await videoModel.findByIdAndDelete(req.params.id);
    if (!deletedVideo) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: Failed to delete video" });
  }
}
