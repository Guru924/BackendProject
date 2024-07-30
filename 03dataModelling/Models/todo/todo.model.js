import mongoose from "mongoose";
// import { User } from "./user.model";
// import { SubTodo } from "./sub_todo.model";

const todoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    completes: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subTodo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubTodo'
        }
    ]
}, { timestamps: true })

export const Todo = mongoose.model("Todo", todoSchema)