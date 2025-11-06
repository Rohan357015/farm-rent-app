import express from "express";
import { farmerSignup, farmerLogin, farmerLogout } from "../controllers/farmerauth.controllers.js";
import { supplierSignup, supplierLogin, supplierLogout } from "../controllers/supplierAuth.controllers.js";

const router = express.Router();

// Farmer routes
router.post("/farmer/signup", farmerSignup);
router.post("/farmer/login", farmerLogin);
router.post("/farmer/logout", farmerLogout);

// Supplier routes
router.post("/supplier/signup", supplierSignup);
router.post("/supplier/login", supplierLogin);
router.post("/supplier/logout", supplierLogout);

export default router;
