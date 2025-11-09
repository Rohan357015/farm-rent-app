import express from "express";
import { farmerSignup, farmerLogin, farmerLogout } from "../controllers/farmerauth.controllers.js";
import { supplierSignup, supplierLogin, supplierLogout } from "../controllers/supplierAuth.controllers.js";

const farmerRouter = express.Router();

// Farmer routes
farmerRouter.post("/farmer/signup", farmerSignup);
farmerRouter.post("/farmer/login", farmerLogin);
farmerRouter.post("/farmer/logout", farmerLogout);



export default farmerRouter;
