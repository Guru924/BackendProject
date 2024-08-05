import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    fullName:{
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String, //cloudinary
        required: true
    },
    coverImage: {
        type: String, // cloudinary
    },
    password:{
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    }
},{timestamps: true})

export const User = mongoose.model("User",userSchema)