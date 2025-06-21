import { Router } from "express";
import {
  deleteProduct,
  getProducts,
  registerProduct,
  updateProduct,
  getProduct,
  removeProductImage,
} from "../controllers/product.controller.js";
const productRouter = Router();

productRouter.post("/product", registerProduct);
productRouter.get("/product/:productId", getProduct);
productRouter.get("/product/products/get-all", getProducts);
productRouter.patch("/product/update/:productId", updateProduct);
productRouter.patch(
  "/product/update-images/:productId/:publicId",
  removeProductImage
);
productRouter.delete("/product/delete/:productId", deleteProduct);

export default productRouter;
