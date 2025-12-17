import express from "express";
import { farmerSignup, farmerLogin, farmerLogout,getFarmerDashboard} from "../controllers/farmerAuth.controllers.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import { farmerRoute } from "../middleware/farmer.middleware.js";    
import { storeRefreshToken ,refreshAccessToken } from "../utils/token.js";
import { verifyToken } from "../controllers/farmerAuth.controllers.js";
// import { supplierSignup, supplierLogin, supplierLogout } from "../controllers/supplierAuth.controllers.js";

const farmerRouter = express.Router();

// Farmer routes
farmerRouter.get("/farmer/refresh",refreshAccessToken)
farmerRouter.post("/farmer/signup", farmerSignup);
farmerRouter.post("/farmer/login", farmerLogin);
farmerRouter.post("/farmer/logout", farmerLogout);
farmerRouter.get("/farmer/getfarmer", ProtectRoute, farmerRoute, getFarmerDashboard);
farmerRouter.get("/farmer/verify", ProtectRoute, verifyToken);



export default farmerRouter;
