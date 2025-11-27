import express from "express";
import { farmerSignup, farmerLogin, farmerLogout,getFarmerDashboard} from "../controllers/farmerAuth.controllers.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";    
// import { supplierSignup, supplierLogin, supplierLogout } from "../controllers/supplierAuth.controllers.js";

const farmerRouter = express.Router();

// Farmer routes
farmerRouter.post("/farmer/signup", farmerSignup);
farmerRouter.post("/farmer/login", farmerLogin);
farmerRouter.post("/farmer/logout", farmerLogout);
farmerRouter.get("/farmer/getfarmer", getFarmerDashboard);



export default farmerRouter;
