import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    videoFile: {
        type: String, //url
        required: true
    },
    thumbnail: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
    },
    isPublished : {
        type: Boolean,
        required: true
    },
},{timestamps: true})

export const Video = mongoose.model("Video", videoSchema)