import { connectDB } from "../config/db.config.js";
import { PORT } from "../config/env.config.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth.routes.js";
import helmet from "helmet";
import productRouter from "../routes/product.routes.js";
import userRouter from "../routes/user.routes.js";
import brandRouter from "../routes/brand.routes.js";
import categoryRouter from "../routes/category.route.js";
import cartRouter from "../routes/cart.routes.js";
import orderRouter from "../routes/order.routes.js";
import salesRouter from "../routes/sales.route.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/status", (_req, res) => {
  return res.status(200).json({ message: "Status Ok" });
});

app.use("/api", authRouter);
app.use("/api", productRouter);
app.use("/api", userRouter);
app.use("/api", brandRouter);
app.use("/api", categoryRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", salesRouter);
connectDB().then(() => {
  app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));
});

export default app;
