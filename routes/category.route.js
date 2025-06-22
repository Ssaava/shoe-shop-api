import { Router } from "express";
import {
  deleteCategory,
  createCategory,
  fetchAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";
import { checkAdminUser } from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.post("/category", checkAdminUser, createCategory);
categoryRouter.get(
  "/category/fetch-categories",
  checkAdminUser,
  fetchAllCategories
);
categoryRouter.get(
  "/category/:categoryId/get-category",
  checkAdminUser,
  getCategoryById
);
categoryRouter.patch(
  "/category/:categoryId/update-category",
  checkAdminUser,
  updateCategory
);
categoryRouter.delete(
  "/category/:categoryId/delete-category",
  checkAdminUser,
  deleteCategory
);

export default categoryRouter;
