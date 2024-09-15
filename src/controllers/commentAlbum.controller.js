import mongoose, { isValidObjectId } from "mongoose";
import { CommentAlbum } from "../models/commentAlbum.model.js";
import { Album } from "../models/album.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add a comment to an album
const addCommentToAlbum = asyncHandler(async (req, res) => {
    const { albumId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(albumId)) {
        throw new ApiError(400, "Invalid album Id");
    }

    const album = await Album.findById(albumId);

    if (!album) {
        throw new ApiError(404, "Album doesn't exist");
    }

    const newComment = await CommentAlbum.create({
        content,
        album: albumId,
        owner: req.user?._id
    });

    return res.status(201).json(new ApiResponse(201, "Comment added successfully", newComment));
});

// Get all comments for an album
const getCommentsForAlbum = asyncHandler(async (req, res) => {
    const { albumId } = req.params;

    if (!isValidObjectId(albumId)) {
        throw new ApiError(400, "Invalid album Id");
    }

    const comments = await CommentAlbum.find({ album: albumId })
        .populate('owner', 'username')
        .lean();

    if (!comments.length) {
        throw new ApiError(404, "No comments found for this album");
    }

    return res.status(200).json(new ApiResponse(200, "Comments fetched successfully", comments));
});

// Update a comment on an album
const updateCommentOnAlbum = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id");
    }

    const comment = await CommentAlbum.findOneAndUpdate(
        { _id: commentId, owner: req.user?._id },
        { content },
        { new: true }
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found or you don't have permission to update this comment");
    }

    return res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment));
});

// Delete a comment on an album
const deleteCommentOnAlbum = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id");
    }

    const deletedComment = await CommentAlbum.findOneAndDelete({
        _id: commentId,
        owner: req.user?._id
    });

    if (!deletedComment) {
        throw new ApiError(404, "Comment not found or you don't have permission to delete this comment");
    }

    return res.status(200).json(new ApiResponse(200, "Comment deleted successfully", deletedComment));
});

// Remove all comments from a user
const removeAllCommentsByUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const removedComments = await CommentAlbum.deleteMany({ owner: userId });

    if (removedComments.deletedCount === 0) {
        throw new ApiError(400, "Something went wrong while removing all comments");
    }

    return res.status(200).json(new ApiResponse(200, "All comments removed successfully"));
});

export {
    addCommentToAlbum,
    getCommentsForAlbum,
    updateCommentOnAlbum,
    deleteCommentOnAlbum,
    removeAllCommentsByUser
};
