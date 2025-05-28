import { Router } from "express";
import {
  login,
  resendVerificationLink,
  verifyEmail,
  registerUser,
  logout,
} from "../controllers/auth.controller.js";
import { checkAuthentication } from "../middlewares/auth.middleware.js";
const authRouter = Router();

authRouter.post("/auth/register", registerUser);
authRouter.post("/auth/login", login);
authRouter.get("/auth/email-verification", verifyEmail);
authRouter.post(
  "/auth/resend-verification",
  checkAuthentication,
  resendVerificationLink
);
authRouter.post("/auth/logout", checkAuthentication, logout);

export default authRouter;
