import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweets.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    if(!content) throw new ApiError(400, "Content required")

    const userTweet = await Tweet.create({
        content,
        owner: req.user._id,
    })
    if(!userTweet) throw new ApiError(400, "Something went while creating user tweet")
    
    return res
    .status(201)
    .json(new ApiResponse(200, userTweet, "Tweet created Successfully"));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    if (!isValidObjectId(userId?.trim()))
        throw new ApiError(400, "Invalid User ID");

    const userTweets = await Tweet.find({owner: userId})
    if(!userTweets) throw new ApiError(400, "Something went while featching user tweets")
    
    return res
        .status(200)
        .json(new ApiResponse(200, userTweets, "User Tweets featched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId.trim())) throw new ApiError(400, "Invalid Tweet Id")
    
    const {content} = req.body
    if(!content) throw ApiError(400, "Content field is required!!")
    
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{content}
        },
        {new: true}
    )
    
    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet updated!!!"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    if(!isValidObjectId(tweetId.trim())) throw new ApiError(400, "Invalid Tweet ID")
    
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
    if(!deletedTweet) throw new ApiError(400, "Error occur while deleting tweets")
    
    return res
        .status(200)
        .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"))
    
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
