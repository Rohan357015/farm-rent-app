import express from "express";
import { supplierSignup, supplierLogin, supplierLogout ,getSupplierProfile} from "../controllers/supplierAuth.controllers.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { supplierRoute } from "../middleware/farmer.middleware.js";   
import { storeRefreshToken ,refreshAccessToken } from "../utils/token.js";

const supplierRouter = express.Router();

// Supplier routes
supplierRouter.get("/supplier/refresh",refreshAccessToken)
supplierRouter.post("/supplier/signup", supplierSignup);
supplierRouter.post("/supplier/login", supplierLogin);
supplierRouter.post("/supplier/logout", supplierLogout);
supplierRouter.get("/supplier/getSupplierProfile", ProtectRoute, supplierRoute, getSupplierProfile);

export default supplierRouter;