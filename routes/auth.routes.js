import { Router } from "express";
import {
  deleteUser,
  getUser,
  registerUser,
  updateUser,
} from "../controllers/auth.controller.js";
const authRouter = Router();

authRouter.post("/user", registerUser);
authRouter.get("/user/:id", getUser);
authRouter.put("/user/:id", updateUser);
authRouter.delete("/user/:id", deleteUser);

export default authRouter;
