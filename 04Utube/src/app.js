import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))
app.use(express.json({limit: '16kb'})) //recieve form data
app.use(express.urlencoded({extended: true, limit: '16kb'})) // take data from url
app.use(express.static("public")) //store public files in server
app.use(cookieParser())


//routes import

import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"

//routes declartion
app.use("/api/v1/users", userRouter)
app.use("/api/v1/vedios",videoRouter)

export {app}