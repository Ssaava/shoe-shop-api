import mongoose from "mongoose";
import { MONGO_DB_URL } from "./env.config.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_DB_URL);
    console.log("Connected to MongoDB: ");
  } catch (error) {
    console.log("MongoDB Connection Error: ", error);
    process.exit(1);
  }
};
