import mongoose from "mongoose";
const DB_STRING = process.env.MONGO_DB_URL;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_STRING);
    console.log("Connected to MongoDB: ", conn.connection.host);
  } catch (error) {
    console.log("MongoDB Connection Error: ", error);
    process.exit(1);
  }
};
