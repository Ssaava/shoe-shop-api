import jwt from "jsonwebtoken";
import { TOKEN_SECRET_KEY } from "../config/env.config.js";
export const checkAuthentication = async (req, res, next) => {
  try {
    console.log("Rested Auth: ", req.cookies);
    const access_token =
      req.cookies.accessToken || req.headers.authorization.split(" ")[1];
    if (!access_token) return res.status(401).json({ message: "Please login" });
    const decodedToken = jwt.verify(access_token, TOKEN_SECRET_KEY); // throws an error if token is invalid
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json({ message: "Invalid or Expired token. Please Login Again" });
  }
};

export const checkAdminUser = async (req, res, next) => {
  try {
    const access_token =
      req.cookies.accessToken || req.headers.authorization.split(" ")[1];
    if (!access_token)
      return res.status(401).json({ message: "Please login to access route" });
    const decodedToken = jwt.verify(access_token, TOKEN_SECRET_KEY);

    if (decodedToken.userRole !== "admin")
      res.status(401).json({ message: "User must me an admin" });
    req.userRole = decodedToken.userRole;
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "User must be admin" });
  }
};
