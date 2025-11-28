import Farmer from "../models/farmer.model.js";
import Supplier from "../models/supplier.model.js";
import Rental from "../models/rental.model.js";
import Rating from "../models/ratings.model.js";

import jwt from "jsonwebtoken";
import { generateTokens, storeRefreshToken, setCookies } from "../utils/token.js";
import { redis } from "../lib/redis.js";


// ------------------ Signup ------------------
export const farmerSignup = async (req, res) => {
  const { name, email, password, phone, location } = req.body;

  try {
    // Check if email exists in either Farmer or Supplier collection
    const existingFarmer = await Farmer.findOne({ email });
    const existingSupplier = await Supplier.findOne({ email });
    
    if (existingFarmer || existingSupplier) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Always set role to "farmer" - don't accept it from request body
    const farmer = await Farmer.create({ name, email, password, phone, location, role: "farmer" });

    const { accessToken, refreshToken } = generateTokens(farmer._id);
    await storeRefreshToken(farmer._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: "Farmer registered successfully",
      farmer: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        role: farmer.role,
        phone: farmer.phone,
        location: farmer.location
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ------------------ Login ------------------
export const farmerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // First check if farmer exists with correct role
    const farmer = await Farmer.findOne({ email, role: "farmer" });
    if (!farmer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Then verify password
    const isPasswordValid = await farmer.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = generateTokens(farmer._id);
    await storeRefreshToken(farmer._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.json({
      message: "Farmer logged in successfully",
      farmer: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        role: farmer.role,
        phone: farmer.phone,
        location: farmer.location
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ------------------ Logout ------------------
export const farmerLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Farmer logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getFarmerDashboard = async (req, res) => {
  try{
    res.json({message: "Farmer Dashboard Accessed", farmer: req.user});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}