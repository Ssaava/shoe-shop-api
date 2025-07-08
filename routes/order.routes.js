import { Router } from "express";
import {
  cancelOrder,
  getAllOrders,
  getUserOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import {
  checkAdminUser,
  checkAuthentication,
} from "../middlewares/auth.middleware.js";

const orderRouter = Router();

orderRouter.post("/order", checkAuthentication, placeOrder);
orderRouter.get("/order/user", checkAuthentication, getUserOrders);
orderRouter.get("/order/orders", checkAdminUser, getAllOrders);
orderRouter.patch("/order/status", checkAdminUser, updateOrderStatus);
orderRouter.patch("/order/cancel", checkAuthentication, cancelOrder);

export default orderRouter;
