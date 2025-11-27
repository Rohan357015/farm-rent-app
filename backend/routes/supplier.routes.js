import express from "express";
import { supplierSignup, supplierLogin, supplierLogout ,getSupplierProfile} from "../controllers/supplierAuth.controllers.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";   

const supplierRouter = express.Router();

// Supplier routes
supplierRouter.post("/supplier/signup", supplierSignup);
supplierRouter.post("/supplier/login", supplierLogin);
supplierRouter.post("/supplier/logout", supplierLogout);
supplierRouter.get("/supplier/getSupplierProfile", ProtectRoute, getSupplierProfile);

export default supplierRouter;