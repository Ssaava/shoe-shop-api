import jwt from "jsonwebtoken";
import {
  TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET,
} from "../config/env.config.js";
export const generateToken = (user) => {
  const access_token = jwt.sign(
    { userId: user._id, userRole: user.role },
    TOKEN_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  const refresh_token = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { access_token, refresh_token };
};
