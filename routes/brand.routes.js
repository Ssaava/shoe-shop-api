import { Router } from "express";

import {
  registerBrand,
  updateBrand,
  deleteBrand,
  getBrands,
  getBrand,
} from "../controllers/brand.controller.js";

const brandRouter = Router();

brandRouter.post("/brand", registerBrand);
brandRouter.get("/brand/get", getBrands);
brandRouter.get("/brand/get/:id", getBrand);
brandRouter.patch("/brand/update/:id", updateBrand);
brandRouter.delete("/brand/delete/:id", deleteBrand);

export default brandRouter;
