// routes/cart.route.js
import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { ProtectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", ProtectRoute, getCart);
router.post("/add", ProtectRoute, addToCart);
router.put("/update/:equipmentId", ProtectRoute, updateCartItem); // update qty/dates
router.delete("/remove", ProtectRoute, removeFromCart); // body: { equipmentId? }

export default router;
