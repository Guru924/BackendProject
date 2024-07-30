import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ["MALE","FEMALE","OTHER"],
        required: true,
    },
    diagonsedWith: {
        type: String,
        required: true,
    },
    bload_group: {
        type: String,
        required: true,
    },
    addmitedIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    }
},{timestamps: true})

export const Patient = mongoose.model("Patient", patientSchema)