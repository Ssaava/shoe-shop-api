import { Router } from "express";
import {
  deleteCategory,
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/category", addCategory);
categoryRouter.get("/category/get/:id", getCategory);
categoryRouter.get("/category/get", getCategories);
categoryRouter.patch("/category/update/:id", updateCategory);
categoryRouter.delete("/category/delete/:id", deleteCategory);

export default categoryRouter;
