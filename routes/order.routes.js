import { Router } from "express";
import {
  placeOrder,
  getAllOrders,
  getUserOrders,
  markAsDelivered,
  cancelOrder,
} from "../controllers/order.controller.js";
import {
  checkAuthentication,
  checkAdminUser,
} from "../middlewares/auth.middleware.js";

const orderRouter = Router();

orderRouter.post("/order", checkAuthentication, placeOrder);
orderRouter.get("/order/user", checkAuthentication, getUserOrders);
orderRouter.get("/order/get", checkAdminUser, getAllOrders);
orderRouter.patch("/order/deliver/:orderId", checkAdminUser, markAsDelivered);
orderRouter.patch("/order/cancel/:orderId", checkAuthentication, cancelOrder);

export default orderRouter;
