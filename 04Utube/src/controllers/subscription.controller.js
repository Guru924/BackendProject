import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId.trim())) throw new ApiError(400, "Invalid channel Id")
    
    // check user subscribed to channel
    const isSubscriber = await Subscription.findOne({channel: channelId}, {subscriber: req.user?._id})
    if(isSubscriber){
        const unSubscribe = await isSubscriber.deleteOne()

        if(!unSubscribe) throw new ApiError(400, "Error while unsubsribing the channel")
        return res
        .status(200)
        .json(new ApiResponse(200,{}, "Unsubscribed the channel"))
    }

    const newSubscriber = await Subscription.create({
        channel: channelId,
        subscriber: req.user?._id
    })
    if(!newSubscriber) throw new ApiError(400, "Error occur while subscribe the channel")
    return res
        .status(200)
        .json(new ApiResponse(200, newSubscriber, "Subscribed to the channel"))
    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId.trim())) throw new ApiError(406, "Invalid channel id")

    const subscriberList = await Subscription.find({channel: channelId})

    if(!subscriberList) throw new ApiError(404, "Channel have no subscibers")
    
    return res
        .status(200)
        .json(new ApiResponse(400, subscriberList, "List of subscriber fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId.trim())) throw new ApiError(406, "Invalid subscriber id")
    
    const channelList = await Subscription.find({ subscriber: subscriberId })
    if(!channelList) throw new ApiError(404, "user have not subscribed to any channel")

    return res
        .status(200)
        .json(new ApiResponse(400, channelList, "List of channel fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}