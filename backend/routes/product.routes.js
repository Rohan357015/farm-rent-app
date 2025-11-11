import express from "express";
import { getAllProducts } from "../controllers/product.controller.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { addProduct } from "../controllers/product.controller.js";
import { farmerRoute, supplierRoute } from "../middleware/farmer.middleware.js";

const productRouter = express.Router();

productRouter.get("/", ProtectRoute, farmerRoute, getAllProducts);
productRouter.get("/:id", ProtectRoute, farmerRoute, getAllProducts);

productRouter.post("/add", ProtectRoute, supplierRoute, addProduct);

export default productRouter;