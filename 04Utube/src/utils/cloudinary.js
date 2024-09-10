import {v2 as cloudinary} from 'cloudinary'
import { error } from 'console';
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null;

        const uploadResult = await cloudinary.uploader
       .upload(
           localFilePath, {
            resource_type: "auto",
           })
    //    .catch((error) => {
    //        console.log(error);
    //    });
    console.log("file is uploaded on cloudinary",uploadResult.url)
    fs.unlinkSync(localFilePath);
    return uploadResult
    } catch (error) {
        fs.unlinkSync(localFilePath); //Remove the local file if upload fails
        return null;
    }
}

const deleteOnCloudinary = async(url)=> {
    try {
        if(!url) console.log("Invalid url")
        const parts = url.split('/')
        const publicIdWithExtension = parts.pop() // get the last part of fileName
        const publicId = publicIdWithExtension.split('.')[0] //remove the file extension
    
        await cloudinary.uploader.destroy(publicId, (error, result)=>{
            if(error) console.log("Error deleting image:", error);
            else console.log("Image deleted successfully", result);
        })
    } catch (error) {
        
    }
}

export {uploadOnCloudinary, deleteOnCloudinary}