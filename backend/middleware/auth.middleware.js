import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Farmer from "../models/farmer.model.js";
import Supplier from "../models/supplier.model.js";

dotenv.config();

export const ProtectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // Try to find user in both collections explicitly
    const farmer = await Farmer.findById(decoded.userId).select("-password");
    const supplier = await Supplier.findById(decoded.userId).select("-password");
    
    const user = farmer || supplier;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // Verify user has a valid role
    if (user.role !== "farmer" && user.role !== "supplier") {
      return res.status(401).json({ message: "Unauthorized - Invalid user role" });
    }

    // ye user ko request me attach kar do jisse aage use kar sako taaki koi bhi route handler me user ki details mil jaye
    req.user = user;

    next(); // Continue to next middleware or route handler
  } catch (error) {
    console.error("ProtectRoute Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
