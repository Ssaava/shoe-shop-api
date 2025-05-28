import { Router } from "express";
import {
  deleteUser,
  getUsers,
  login,
  registerUser,
  resendVerificationLink,
  updateUser,
  verifyEmail,
} from "../controllers/auth.controller.js";
import {
  checkAdminUser,
  checkAuthentication,
} from "../middlewares/auth.middleware.js";
const authRouter = Router();

authRouter.post("/user/register", registerUser);
authRouter.post("/user/login", login);
authRouter.get("/user/email-verification", verifyEmail);
authRouter.post(
  "/user/email-verification",
  checkAuthentication,
  resendVerificationLink
);
authRouter.get("/user/users", checkAdminUser, getUsers);
authRouter.patch("/user/update-user", checkAuthentication, updateUser);

authRouter.delete("/user/:id", deleteUser);

export default authRouter;
