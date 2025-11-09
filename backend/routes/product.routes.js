import express from "express";
import { getAllProducts } from "../controllers/product.controller.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { addProduct } from "../controllers/product.controller.js";


const productRouter = express.Router();

productRouter.get("/", ProtectRoute, getAllProducts);
productRouter.get("/:id", ProtectRoute, getAllProducts);

productRouter.post("/add", ProtectRoute, addProduct);

export default productRouter;