import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshTokens = async (userid) => {
  try {
    const user = await User.findById(userid);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //without validateBeforeSave it will only refreshtoken in user not other fields

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
    return null;
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200)
  // .json({
  //     message: "ok"
  // })

  // get user details from frontend
  const { username, email, fullName, password } = req.body;

  //validation not empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //check if user already exist
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser)
    throw new ApiError(409, "User with email or username already exists");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files.coverImage[0].path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  console.log(req.files);

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

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
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // const createdUser = await User.findById(user._id);

  if (!createdUser)
    throw new Error(500, "Something went while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // check req from body
  const { username, email, password } = req.body;

  if (!username || !email)
    throw new ApiError(400, "username or email is required");

  const user = User.findOne({
    $nor: [{ email }, { username }],
  });

  if (!user) throw new ApiError(404, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); //optional

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
      {
        new: true
      }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User Logged Out"))

});

export { registerUser, loginUser, logoutUser };
