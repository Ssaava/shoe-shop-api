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
} = process.env;
