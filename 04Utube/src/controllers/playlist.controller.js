import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if([name, description].some((field) => field === "")) throw new ApiError(400, "All fields are required")

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })
    if(!playlist) throw new ApiError(400, "Error while creating playlist")
    
    return res
        .status(200)
        .json(new ApiResponse(200,playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId.trim())) throw new ApiError(200, "Invalid User ID")
    
    const UserPlaylists = await Playlist.find({ owner: userId })
    if(!UserPlaylists) throw new ApiError(400,"Can't fetch user playlists right now!")
    
    return res
    .status(200)
    .json(new ApiResponse(200, UserPlaylists, "User playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId.trim())) throw new ApiError(400, "Invalid PlayList ID")
    
    const playlist = await Playlist.findById({ playlistId })
    if(!playlist) throw new ApiError(400, "No playlist available")
    
    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId.trim()) || !isValidObjectId(videoId.trim())) throw new ApiError(400, "Invalid ID")
    
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: { videos: mongoose.Types.ObjectId(videoId) } 
        },
        { new: true }
    )
    if(!playlist) throw new ApiError(400, "Error while add vedio to the playlist")

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added into the playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if([playlistId, videoId].some((field) => isValidObjectId(field) === false))
    throw new ApiError(406, "Invalid ID")

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: mongoose.Types.ObjectId(videoId) } 
        },
        { new: true }
    )
    if(!playlist) throw new ApiError(400, "Error while removing vedio from playlist")

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from the playlist"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId.trim())) throw new ApiError(406, "Invalid Playlist Id")

    const deletedRes = await Playlist.findByIdAndDelete(playlistId)
    if(!deletedRes) throw new ApiError(400, "Error while deleting playlist")

    return res
    .status(200)
    .json(new ApiResponse(200, {playlistId}, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId.trim())) throw new ApiError(406, "Invalid Playlist Id")
    if([name, description].some((field) => field === "")) throw new ApiError(400, "All fields are required")
    
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    )
    if(!playlist) throw new ApiError(400, "Error while updating playlist")

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
