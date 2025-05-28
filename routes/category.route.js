import { Router } from "express";
import {
  deleteCategory,
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.post("/addCategory", addCategory);
categoryRouter.get("/category/:id", getCategory);
categoryRouter.get("/categories", getCategories);
categoryRouter.patch("/updateCategory/:id", updateCategory);
categoryRouter.delete("/deleteCategory/:id", deleteCategory);

export default categoryRouter;
