import mongoose, { isValidObjectId } from "mongoose";
import { LikeVideo } from "../models/likeVideo.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Like a video
const likeVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video doesn't exist");
    }

    const existingLike = await LikeVideo.findOne({
        video: videoId,
        likedBy: req.user?._id
    });

    if (existingLike) {
        throw new ApiError(400, "Video is already liked");
    }

    const newLike = await LikeVideo.create({
        video: videoId,
        likedBy: req.user?._id
    });

    return res.status(201).json(new ApiResponse(201, "Video liked successfully", newLike));
});

// Get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const likedVideos = await LikeVideo.find({ likedBy: userId })
        .populate('video')
        .lean();

    if (!likedVideos.length) {
        throw new ApiError(404, "No liked videos found for this user");
    }

    return res.status(200).json(new ApiResponse(200, "Liked videos fetched successfully", likedVideos));
});

// Unlike a video
const unlikeVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const removedLike = await LikeVideo.findOneAndDelete({
        video: videoId,
        likedBy: req.user?._id
    });

    if (!removedLike) {
        throw new ApiError(400, "Something went wrong while unliking the video");
    }

    return res.status(200).json(new ApiResponse(200, "Video unliked successfully", removedLike));
});

// Remove all likes by user
// const removeAllLikes = asyncHandler(async (req, res) => {
//     const userId = req.user?._id;

//     if (!isValidObjectId(userId)) {
//         throw new ApiError(400, "Invalid user Id");
//     }

//     const removedLikes = await LikeVideo.deleteMany({ likedBy: userId });

//     if (removedLikes.deletedCount === 0) {
//         throw new ApiError(400, "Something went wrong while removing all likes");
//     }

//     return res.status(200).json(new ApiResponse(200, "All likes removed successfully"));
// });

export {
    likeVideo,
    getLikedVideos,
    unlikeVideo,
    // removeAllLikes
};
