import mongoose from "mongoose"

const tweetSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner"
    }
},{timestamps: true})

export const Tweet = mongoose.model("Tweet", tweetSchema)