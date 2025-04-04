import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: "attendance",
      use_filename: true,
      unique_filename: false,
    });
    console.log("File uploaded on Cloudinary. File src:" + response.secure_url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Error on Cloudinary", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const projectlogo = async(localFilePath) => {
  try{
    if(!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {  
      resource_type: "image",
      folder: "projectlogo",
      use_filename: true,
      unique_filename: false,
    });
    console.log("File uploaded on Cloudinary. File src:" + response.secure_url);
    fs.unlinkSync(localFilePath);
    return response;
  }catch(error)
{
  console.log("Error on Cloudinary", error);
  fs.unlinkSync(localFilePath);
  return null
}  
}

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = cloudinary.uploader.destroy(publicId);
    console.log("Deleted from cloudinary. PUBLIC id", publicId);
  } catch (error) {
    console.log("Error deleting from cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary, projectlogo,deleteFromCloudinary };
