import Farmer from "../models/farmer.model.js";
import Rental from "../models/rental.model.js";
import Rating from "../models/ratings.model.js";

import jwt from "jsonwebtoken";
import { generateTokens, storeRefreshToken, setCookies } from "../utils/token.js";
import { redis } from "../lib/redis.js";


// ------------------ Signup ------------------
export const farmerSignup = async (req, res) => {
  const { name, email, password, phone, location, role } = req.body;

  try {
    const existingFarmer = await Farmer.findOne({ email });
    if (existingFarmer)
      return res.status(400).json({ message: "Farmer already exists" });

    const farmer = await Farmer.create({ name, email, password, phone, location, role });

    const { accessToken, refreshToken } = generateTokens(farmer._id);
    await storeRefreshToken(farmer._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: "Farmer registered successfully",
      id: farmer._id,
      name: farmer.name,
      email: farmer.email,
      role: farmer.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ------------------ Login ------------------
export const farmerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const farmer = await Farmer.findOne({ email, role: "farmer" });
    if (!farmer || !(await farmer.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = generateTokens(farmer._id);
    await storeRefreshToken(farmer._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.json({
      message: "Farmer logged in successfully",
      id: farmer._id,
      name: farmer.name,
      email: farmer.email,
      role: farmer.role
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