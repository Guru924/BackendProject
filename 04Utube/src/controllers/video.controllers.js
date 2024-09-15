import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if ([title, description].some((field) => field === ""))
    throw new ApiError(400, "All fields are required");

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files.thumbnail[0]?.path;

  if (!videoFileLocalPath || !thumbnailLocalPath)
    throw new ApiError(400, "Vedio file and Thumbnail are required");

  const resVedio = await uploadOnCloudinary(videoFileLocalPath);
  const resThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!resVedio) throw new ApiError(400, "Error in Vedio file upload");
  if (!resThumbnail) throw new ApiError(400, "Error in Thumbnail upload");

  const vedio = await Video.create({
    videoFile: resVedio.url,
    thumbnail: resThumbnail.url,
    title,
    description,
    duration: resVedio.duration,
    views: 0, // Default to 0 views initially
    isPublished: true, // Default to published state
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, vedio, "Vedio uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  // Check if videoId is a valid ObjectId
  if (!mongoose.isValidObjectId(videoId?.trim()))
    throw new ApiError(400, "Invalid video ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(400, "Video not found");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  if (!mongoose.isValidObjectId(videoId?.trim()))
    throw new ApiError(400, "Invalid video ID");

  const {title, description} = req.body

  if(req.file){
    const thumbnailLocalPath = req.file?.path
  if(!thumbnailLocalPath) throw new ApiError(400, "Thumbnail file is missing")
  
  const resThumbnail = await uploadOnCloudinary(thumbnailLocalPath)
  if(!resThumbnail) throw new ApiError(400, "Error while uploading thumbnail")
  
  const video = await Video.findById(videoId)
  if(!video) throw new ApiError(400,"Video not found")

  const oldThumbnail = video.thumbnail
  await deleteOnCloudinary(oldThumbnail)

  video.thumbnail = resThumbnail.url
  if(title) video.title = title
  if(description) video.description = description

  await video.save()

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"))
  }
  else if(title || description){
    let updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {updates}
    }, {new: true}
    )
    if(!video) throw new ApiError(400,"Video not found")

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"))
  }
  else
    return res
    .status(406)
    .json(new ApiResponse(406,{},"No fields provided for update"))
  
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!mongoose.isValidObjectId(videoId?.trim()))
    throw new ApiError(400, "Invalid video ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(400, "Video not found");

  const videoUrl = video.videoFile
  const thumbnailUrl = video.thumbnail

  await deleteOnCloudinary(videoUrl)
  await deleteOnCloudinary(thumbnailUrl)

  await video.deleteOne()

  return res
  .status(200)
  .json(new ApiResponse(200,null,"Video deleted successfully"))
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.isValidObjectId(videoId?.trim()))
    throw new ApiError(400, "Invalid video ID");

//   const video = await Video.findByIdAndUpdate(
//     videoId.trim(),
//     {
//       $set: {
//         isPublished: !isPublished,
//       },
//     },
//     { new: true }
//   );
    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(400, "Video not found");

    video.isPublished = !video.isPublished
    await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, `Video publish status updated to: ${video.isPublished}`));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
