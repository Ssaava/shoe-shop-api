import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export const {
  PORT,
  MONGO_DB_URL,
  EMAIL_USER,
  EMAIL_PASSWORD,
  SERVER_URL,
  TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_URL,
  CLOUDINARY_UPLOAD_PRESET,
  FRONTEND_SERVER_URL,
} = process.env;
