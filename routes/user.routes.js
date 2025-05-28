import { Router } from "express";
import {
  checkAdminUser,
  checkAuthentication,
} from "../middlewares/auth.middleware.js";
import {
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.get("/user/users", checkAdminUser, getUsers);
userRouter.patch("/user/update-user", checkAuthentication, updateUser);

userRouter.delete("/user/:id", deleteUser);

export default userRouter;
