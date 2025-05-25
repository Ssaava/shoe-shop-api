import { Router } from "express";
import { getUserInfo, registerUser } from "../controllers/auth.controller.js";
const authRouter = Router();

authRouter.post("/user", registerUser);
authRouter.get("/user", getUserInfo);

export default authRouter;
