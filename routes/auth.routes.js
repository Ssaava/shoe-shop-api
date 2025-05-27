import { Router } from "express";
import {
  deleteUser,
  getUser,
  registerUser,
  updateUser,
  verifyEmail,
} from "../controllers/auth.controller.js";
const authRouter = Router();

authRouter.post("/user/register", registerUser);
authRouter.get("/user/email-verification", verifyEmail);
authRouter.get("/user/:id", getUser);
authRouter.put("/user/:id", updateUser);
authRouter.delete("/user/:id", deleteUser);

export default authRouter;
