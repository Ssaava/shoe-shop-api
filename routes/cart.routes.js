import { checkAuthentication } from "../middlewares/auth.middleware.js";

import { Router } from "express";
import {
  addToCart,
  getUserCart,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/cart/add", checkAuthentication, addToCart);
cartRouter.get("/cart", checkAuthentication, getUserCart);
cartRouter.patch("/cart/remove-product", checkAuthentication, removeCartItem);
cartRouter.delete("/cart/clear-cart", checkAuthentication, clearCart);

export default cartRouter;
