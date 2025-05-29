import { Router } from "express";
import {
  deleteProduct,
  getProducts,
  registerProduct,
  updateProduct,
  getProduct,
} from "../controllers/product.controller.js";
const productRouter = Router();

productRouter.post("/product", registerProduct);
productRouter.get("/product/:id", getProduct);
productRouter.get("/products", getProducts);
productRouter.put("/product/update/:id", updateProduct);
productRouter.delete("/product/delete/:id", deleteProduct);

export default productRouter;
