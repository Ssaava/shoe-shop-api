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
productRouter.get("/product/:productId", getProduct);
productRouter.get("/product/products/get-all", getProducts);
productRouter.put("/product/update/:productId", updateProduct);
productRouter.delete("/product/delete/:productId", deleteProduct);

export default productRouter;
