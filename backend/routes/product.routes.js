import express from "express";
import { getAllProducts, getSupplierProducts ,farmersGetAllProducts,getProductById,updateProduct,deleteProduct} from "../controllers/product.controller.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { addProduct } from "../controllers/product.controller.js";
import { farmerRoute, supplierRoute } from "../middleware/farmer.middleware.js";

const productRouter = express.Router();

productRouter.get("/", ProtectRoute, farmerRoute, getAllProducts);
productRouter.get("/supplier/my-products", ProtectRoute, supplierRoute, getSupplierProducts);
productRouter.get("/farmer/products", ProtectRoute, farmerRoute, farmersGetAllProducts);
productRouter.get("/:id", ProtectRoute,  getProductById);
productRouter.put("/update/:id", ProtectRoute, updateProduct);
productRouter.delete("/delete/:id", ProtectRoute, deleteProduct);

productRouter.post("/add", ProtectRoute, supplierRoute, addProduct);

export default productRouter;