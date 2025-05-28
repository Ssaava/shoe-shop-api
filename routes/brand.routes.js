import { Router } from "express";

import {
  registerBrand,
  updateBrand,
  deleteBrand,
  getBrand,
} from "../controllers/brand.controller.js";

const brandRouter = Router();

brandRouter.post("/addBrand", registerBrand);
brandRouter.get("/brand", getBrand);
brandRouter.patch("/updateBrand/:id", updateBrand);
brandRouter.delete("/deleteBrand/:id", deleteBrand);

export default brandRouter;
