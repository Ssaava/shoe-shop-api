import { Router } from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/cart/add", addToCart);
cartRouter.get("/cart", getUserCart);
cartRouter.put("/cart/update", updateCartItem);
cartRouter.delete("/cart/remove/:productId", removeCartItem);
cartRouter.delete("/cart/clear", clearCart);

export default cartRouter;
