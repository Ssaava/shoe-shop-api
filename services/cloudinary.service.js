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
      resource_type: "image",
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
    });
    return res;
  } catch (err) {
    console.log("Handle Upload Error: ", err);
    return false;
  }
};

export const handleDeleteFile = async (publicId) => {
  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
    });

    console.log("Successfully Deleted Product Image: ", res);
    return res;
  } catch (error) {
    console.log("Handle Delete Asset Error: ", error.message);
    return false;
  }
};
