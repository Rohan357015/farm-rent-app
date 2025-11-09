import express from "express";
import { supplierSignup, supplierLogin, supplierLogout } from "../controllers/supplierAuth.controllers.js";

const supplierRouter = express.Router();

// Supplier routes
supplierRouter.post("/supplier/signup", supplierSignup);
supplierRouter.post("/supplier/login", supplierLogin);
supplierRouter.post("/supplier/logout", supplierLogout);

export default supplierRouter;