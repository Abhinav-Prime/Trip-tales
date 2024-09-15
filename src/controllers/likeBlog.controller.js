import mongoose, { isValidObjectId } from "mongoose";
import { LikeBlog } from "../models/likeBlog.model.js";
import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Like a blog
const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    if (!isValidObjectId(blogId)) {
        throw new ApiError(400, "Invalid blog Id");
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(404, "Blog doesn't exist");
    }

    const existingLike = await LikeBlog.findOne({
        blog: blogId,
        likedBy: req.user?._id
    });

    if (existingLike) {
        throw new ApiError(400, "Blog is already liked");
    }

    const newLike = await LikeBlog.create({
        blog: blogId,
        likedBy: req.user?._id
    });

    return res.status(201).json(new ApiResponse(201, "Blog liked successfully", newLike));
});

// Get all liked blogs
const getLikedBlogs = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const likedBlogs = await LikeBlog.find({ likedBy: userId })
        .populate('blog')
        .lean();

    if (!likedBlogs.length) {
        throw new ApiError(404, "No liked blogs found for this user");
    }

    return res.status(200).json(new ApiResponse(200, "Liked blogs fetched successfully", likedBlogs));
});

// Unlike a blog
const unlikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    if (!isValidObjectId(blogId)) {
        throw new ApiError(400, "Invalid blog Id");
    }

    const removedLike = await LikeBlog.findOneAndDelete({
        blog: blogId,
        likedBy: req.user?._id
    });

    if (!removedLike) {
        throw new ApiError(400, "Something went wrong while unliking the blog");
    }

    return res.status(200).json(new ApiResponse(200, "Blog unliked successfully", removedLike));
});

// Remove all blog likes by user
const removeAllBlogLikes = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const removedLikes = await LikeBlog.deleteMany({ likedBy: userId });

    if (removedLikes.deletedCount === 0) {
        throw new ApiError(400, "Something went wrong while removing all blog likes");
    }

    return res.status(200).json(new ApiResponse(200, "All blog likes removed successfully"));
});

export {
    likeBlog,
    getLikedBlogs,
    unlikeBlog,
    removeAllBlogLikes
};
