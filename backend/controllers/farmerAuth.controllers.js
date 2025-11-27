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
  try {
    const farmerId = req.query.id;
    if (!farmerId) {
      return res.status(400).json({ success: false, message: "Farmer ID is required" });
    }

    const farmer = await Farmer.findById(farmerId).select("name email phone location");
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found" });
    }

    const rentalCount = await Rental.countDocuments({ farmer: farmerId });
    const activeRentals = await Rental.countDocuments({ farmer: farmerId, status: "active" });
    const ratings = await Rating.find({ farmer: farmerId });
    const totalReviews = ratings.length;
    const avgRating = totalReviews > 0
      ? parseFloat((ratings.reduce((sum, r) => sum + r.stars, 0) / totalReviews).toFixed(1))
      : 0;

    return res.status(200).json({
      success: true,
      user: farmer,
      stats: { rentalCount, activeRentals, avgRating, totalReviews }
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({ success: false, message: "Server error loading dashboard" });
  }
};
