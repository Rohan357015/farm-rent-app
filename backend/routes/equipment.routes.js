import express from "express";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedEquipment,
  searchEquipment,
} from "../controllers/equipment.controller.js";

const equipmentRouter = express.Router();

equipmentRouter.get("/recommended", ProtectRoute, getRecommendedEquipment);
equipmentRouter.get("/search", ProtectRoute, searchEquipment);

export default equipmentRouter;
