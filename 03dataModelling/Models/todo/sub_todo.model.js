import mongoose from "mongoose";
// import { User } from "./user.model";

const subTodoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    completes: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps: true})

export const SubTodo = mongoose.model("SubTodo", subTodoSchema)