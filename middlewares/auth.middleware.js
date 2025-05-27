import jwt from "jsonwebtoken";
import { TOKEN_SECRET_KEY } from "../config/env.config.js";
export const checkAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Please login" });
    const decodedToken = jwt.verify(token, TOKEN_SECRET_KEY); // throws an error if token is invalid
    req.userId = decodedToken.userId;
    console.log(req.userId);
    next();
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json({ message: "Invalid or Expired token. Please Login Again" });
  }
};
