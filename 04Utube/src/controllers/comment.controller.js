import mongoose, {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { json } from "express"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    if(!isValidObjectId(videoId.trim())) throw new ApiError(400, "Invalid Video ID")
    
    const { content } = req.body
    if(!content) throw new ApiError(400, "Content is required!!")
    
    const cmt = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    })

    if(!cmt) throw new ApiError(400, "Something went wrong while creating comment")
    
    return res
        .status(200)
        .json(new ApiResponse(200, cmt, "Comment added to the video"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    if(!isValidObjectId(commentId.trim())) throw new ApiError(400, "Invalid Comment ID")
    
    const { content } = req.body
    if(!content) throw new ApiError(400, "Content is required!!")
    
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {content}
        },
        {new: true}
    )

    if(!updatedComment) throw new ApiError(400, "Error while updating Comment")
    
    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params
    if(!isValidObjectId(commentId.trim())) throw new ApiError(400, "Invalid Comment ID")
    
    
    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if(!deletedComment) throw new ApiError(400, "Error while deleting Comment")
    
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
