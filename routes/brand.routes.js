import { Router } from "express";

import {
  createBrand,
  updateBrand,
  deleteBrand,
  fetchAllBrands,
  getBrandById,
} from "../controllers/brand.controller.js";
import { checkAdminUser } from "../middlewares/auth.middleware.js";

const brandRouter = Router();

brandRouter.post("/brand", checkAdminUser, createBrand);
brandRouter.get("/brand/fetch-brands", checkAdminUser, fetchAllBrands);
brandRouter.get("/brand/:brandId/get-brand", checkAdminUser, getBrandById);
brandRouter.patch("/brand/:brandId/update-brand", checkAdminUser, updateBrand);
brandRouter.delete("/brand/:brandId/delete-brand", checkAdminUser, deleteBrand);

export default brandRouter;
