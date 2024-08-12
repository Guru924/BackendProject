import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200)
  // .json({
  //     message: "ok"
  // })

  // get user details from frontend
  const {username, email, fullName, password} = req.body;
  
  //validation not empty
  if(
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ){
    throw new ApiError(400, "All fields are required")
  }

  //check if user already exist
  const existedUser = await User.findOne({
    $or: [{ username },{ email }]
  })
  
  if(existedUser) throw new ApiError(409, "User with email or username already exists");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files.coverImage[0]?.path;
  console.log(req.files)

  if(!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  console.log(avatarLocalPath)

  //upload cloudinary
  const resAvatar = await uploadOnCloudinary(avatarLocalPath);
  const resCoverImage = await uploadOnCloudinary(coverImageLocalPath);
  
  if (!resAvatar) throw new ApiError(400, "Avatar file is required");

  const user = await User.create({
    fullName,
    avatar: resAvatar.url,
    coverImage: resCoverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  // const createdUser = await User.findById(user._id).select(
  //   "-password - refreshToken"
  // )
  const createdUser = await User.findById(user._id);


  if(!createdUser) throw new Error(500, "Something went while registering the user");
  
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )
});

export { registerUser };
