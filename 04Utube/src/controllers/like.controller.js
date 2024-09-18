import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!isValidObjectId(videoId.trim())) throw new ApiError(400, "Invalid Video ID")
    
    const existLike = await Like.find({video: videoId},{likedBy: req.user?._id})
    if(existLike) {
        const removedLike = await existLike.deleteOne()
        if(!removedLike) throw new ApiError(400, "Error while removing the like")
        
        return res
            .status(200)
            .json(new ApiResponse(200,{}, "Like removed successfully"))
    }
    const newLike = await Like.create({
        video: videoId,
        likedBy: req.user?._id
    })
    if(!newLike) throw new ApiError(400, "Error while adding like")
    
    return res
        .status(200)
        .json(new ApiResponse(200, newLike, "Like added successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId.trim())) throw new ApiError(400, "Invalid Comment ID")
    
        const existLike = await Like.find({comment: commentId},{likedBy: req.user?._id})
        if(existLike) {
            const removedLike = await existLike.deleteOne()
            if(!removedLike) throw new ApiError(400, "Error while removing the like")
            
            return res
                .status(200)
                .json(new ApiResponse(200,{}, "Like removed successfully"))
        }
        const newLike = await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        })
        if(!newLike) throw new ApiError(400, "Error while adding like")
        
        return res
            .status(200)
            .json(new ApiResponse(200, newLike, "Like added successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId.trim())) throw new ApiError(400, "Invalid Tweet ID")
    
        const existLike = await Like.find({tweet: tweetId},{likedBy: req.user?._id})
        if(existLike) {
            const removedLike = await existLike.deleteOne()
            if(!removedLike) throw new ApiError(400, "Error while removing the like")
            
            return res
                .status(200)
                .json(new ApiResponse(200,{}, "Like removed successfully"))
        }
        const newLike = await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id
        })
        if(!newLike) throw new ApiError(400, "Error while adding like")
        
        return res
            .status(200)
            .json(new ApiResponse(200, newLike, "Like added successfully"))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likedVideos = await Like.find({likedBy: req.user?._id})
    
    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}