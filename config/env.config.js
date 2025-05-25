import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export const { PORT, MONGO_DB_URL } = process.env;
