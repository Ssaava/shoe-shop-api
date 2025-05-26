import { Router } from "express";
import {
  deleteProduct,
  getProduct,
  registerProduct,
  updateProduct,
} from "../controllers/product.controller.js";
const productRouter = Router();

productRouter.post("/product", registerProduct);
productRouter.get("/product/:id", getProduct);
productRouter.put("/product/:id", updateProduct);
productRouter.delete("/product/:id", deleteProduct);

export default productRouter;
