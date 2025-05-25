import cors from "cors";
import express from "express";

import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/status", (_req, res) => {
  return res.status(200).json({ message: "Status Ok" });
});

app.use("/api", authRouter);

export default app;
