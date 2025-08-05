import { Router } from "express";
import {
  deleteProduct,
  getProducts,
  registerProduct,
  updateProduct,
  getProduct,
  removeProductImage,
} from "../controllers/product.controller.js";
import { checkAdminUser } from "../middlewares/auth.middleware.js";
const productRouter = Router();

productRouter.post("/product", checkAdminUser, registerProduct);
productRouter.get("/product/:productId", getProduct);
productRouter.get("/product/products/all", getProducts);
productRouter.patch(
  "/product/update/:productId",
  checkAdminUser,
  updateProduct
);
productRouter.patch(
  "/product/update-images/:productId",
  checkAdminUser,
  removeProductImage
);
productRouter.delete(
  "/product/delete/:productId",
  checkAdminUser,
  deleteProduct
);

export default productRouter;
