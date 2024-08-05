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
        trim: true,
        index: true // for searchable
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true
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
        required: [true, "password is required"],
    },
    refreshToken: {
        type: String,
    }
},{timestamps: true})

export const User = mongoose.model("User",userSchema)