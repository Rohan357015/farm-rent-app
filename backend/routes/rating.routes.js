import express from "express";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import {
  rateProduct,
  rateSupplier,
  rateRenter,
} from "../controllers/rating.controller.js";

const ratingRouter = express.Router();

ratingRouter.post("/product", ProtectRoute, rateProduct);
ratingRouter.post("/supplier", ProtectRoute, rateSupplier);
ratingRouter.post("/renter", ProtectRoute, rateRenter);

export default ratingRouter;
