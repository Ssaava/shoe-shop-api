import { Router } from "express";
import { getAllSales } from "../controllers/sales.controller.js";
import { checkAdminUser } from "../middlewares/auth.middleware.js";

const salesRouter = new Router();

salesRouter.get("/sales", checkAdminUser, getAllSales);

export default salesRouter;
