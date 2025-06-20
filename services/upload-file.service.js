import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "../config/env.config.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

export const handleFileUpload = async (file) => {
  try {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
    });
    return res;
  } catch (err) {
    console.log("Handle Upload Error: ", err);
  }
};
