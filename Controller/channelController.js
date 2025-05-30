import videoModel from "../Model/videoModel.js";
import userModel from "../Model/userModel.js";
import channelModel from "../Model/channelModel.js";
import mongoose from "mongoose";

// Fetch all channels
export async function getChannels(req, res) {
  try {
    const channels = await channelModel.find().populate("owner");
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Unable to fetch channels" });
  }
}

//Fetch channel by user Id
export const getChannelByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const channel = await channelModel.findOne({ owner: userId });

    if (!channel) {
      return res
        .status(404)
        .json({ message: "No channel found for this user." });
    }

    res.json(channel);
  } catch (error) {
    console.error("Error fetching channel by userId:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Fetch a single channel by channelHandle
export async function getChannelByChannelHandle(req, res) {
  try {
    const channel = await channelModel.findOne({ handle: req.params.handle });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: "Server Error : Unable to fetch channel" });
  }
}

// Create a new channel (User must be signed in)
export async function createChannel(req, res) {
  try {
    const { channelName, handle, description, owner, channelBannerUrl } =
      req.body;
    // //Get the avatar file path if uplaoded
    //Check if the channel handle is unique
    const existingChannel = await channelModel.findOne({ handle });
    if (existingChannel) {
      return res.status(400).json({ error: "Channel handle already exists!" });
    }

    //Ensure owner exists
    const user = await userModel.findById(owner);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //Create a new channel
    const newChannel = new channelModel({
      channelName,
      handle,
      description,
      owner,
      channelBannerUrl,
    });
    await newChannel.save();

    //Add channel reference to the user
    await userModel.findByIdAndUpdate(owner, {
      $push: { channels: newChannel._id },
    });
    return res.status(201).json({
      success: true,
      message: "Channel created successfully",
      channel: newChannel,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error: Failed to create channel" });
  }
}

// Update a channel
export async function updateChannel(req, res) {
  try {
    const updatedChannel = await channelModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedChannel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    res
      .status(200)
      .json({ message: "channel Updated", channel: updatedChannel });
  } catch (error) {
    res.status(500).json({ error: "Server Error: Failed to update channel" });
  }
}

// Delete a channel
export async function deleteChannel(req, res) {
  try {
    const deletedChannel = await channelModel.findByIdAndDelete(req.params.id);
    if (!deletedChannel) {
      return res.status(404).json({ error: "Video not found" });
    }
    await videoModel.deleteMany({ channel: deleteChannel._id });
    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error: Failed to delete channel" });
  }
}
