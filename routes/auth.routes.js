import { Router } from "express";
import {
  deleteUser,
  getUser,
  login,
  registerUser,
  resendVerificationLink,
  updateUser,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { checkAuthentication } from "../middlewares/auth.middleware.js";
const authRouter = Router();

authRouter.post("/user/register", registerUser);
authRouter.post("/user/login", login);
authRouter.get("/user/email-verification", verifyEmail);
authRouter.post(
  "/user/email-verification",
  checkAuthentication,
  resendVerificationLink
);
authRouter.get("/user/:id", getUser);
authRouter.put("/user/:id", updateUser);
authRouter.delete("/user/:id", deleteUser);

export default authRouter;
