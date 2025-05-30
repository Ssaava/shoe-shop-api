import { Router } from "express";
import rateLimit from "express-rate-limit";
const rateLimiting = rateLimit({
  windowMs: 15 * 60 * 60,
  max: 5,
});
import {
  checkAdminUser,
  checkAuthentication,
} from "../middlewares/auth.middleware.js";
import {
  getUsers,
  updateUser,
  deleteUser,
  updateUserPassword,
  requestPasswordReset,
  resetPassword,
} from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.get("/user/users", checkAdminUser, getUsers);
userRouter.patch("/user/update-user", checkAuthentication, updateUser);
userRouter.put(
  "/user/update-user-password",
  checkAuthentication,
  rateLimiting,
  updateUserPassword
);
userRouter.post("/user/forgot-password", rateLimiting, requestPasswordReset);
userRouter.post("/user/reset-password", resetPassword);

userRouter.delete("/user/:id", deleteUser);

export default userRouter;
