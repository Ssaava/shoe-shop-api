import { checkAuthentication } from "../middlewares/auth.middleware.js";


import { Router } from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/cart/add", checkAuthentication, addToCart);
cartRouter.get("/cart", checkAuthentication, getUserCart);
cartRouter.put("/cart/update", checkAuthentication, updateCartItem);
cartRouter.delete("/cart/remove/:productId", checkAuthentication, removeCartItem);
cartRouter.delete("/cart/clear", checkAuthentication, clearCart);

export default cartRouter;
