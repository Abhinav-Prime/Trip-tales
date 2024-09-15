import mongoose, { isValidObjectId } from "mongoose";
import { CommentBlog } from "../models/commentBlog.model.js";
import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add a comment to a blog
const addCommentToBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(blogId)) {
        throw new ApiError(400, "Invalid blog Id");
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(404, "Blog doesn't exist");
    }

    const newComment = await CommentBlog.create({
        content,
        blog: blogId,
        owner: req.user?._id
    });

    return res.status(201).json(new ApiResponse(201, "Comment added successfully", newComment));
});

// Get all comments for a blog
const getCommentsForBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    if (!isValidObjectId(blogId)) {
        throw new ApiError(400, "Invalid blog Id");
    }

    const comments = await CommentBlog.find({ blog: blogId })
        .populate('owner', 'username')
        .lean();

    if (!comments.length) {
        throw new ApiError(404, "No comments found for this blog");
    }

    return res.status(200).json(new ApiResponse(200, "Comments fetched successfully", comments));
});

// Update a comment on a blog
const updateCommentOnBlog = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id");
    }

    const comment = await CommentBlog.findOneAndUpdate(
        { _id: commentId, owner: req.user?._id },
        { content },
        { new: true }
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found or you don't have permission to update this comment");
    }

    return res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment));
});

// Delete a comment on a blog
const deleteCommentOnBlog = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id");
    }

    const deletedComment = await CommentBlog.findOneAndDelete({
        _id: commentId,
        owner: req.user?._id
    });

    if (!deletedComment) {
        throw new ApiError(404, "Comment not found or you don't have permission to delete this comment");
    }

    return res.status(200).json(new ApiResponse(200, "Comment deleted successfully", deletedComment));
});

// Remove all comments from a user on all blogs
const removeAllCommentsByUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const removedComments = await CommentBlog.deleteMany({ owner: userId });

    if (removedComments.deletedCount === 0) {
        throw new ApiError(400, "Something went wrong while removing all comments");
    }

    return res.status(200).json(new ApiResponse(200, "All comments removed successfully"));
});

export {
    addCommentToBlog,
    getCommentsForBlog,
    updateCommentOnBlog,
    deleteCommentOnBlog,
    removeAllCommentsByUser
};
