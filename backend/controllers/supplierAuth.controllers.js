import Supplier from "../models/supplier.model.js";
import jwt from "jsonwebtoken";
import { generateTokens, storeRefreshToken, setCookies } from "../utils/token.js";
import { redis } from "../lib/redis.js";

export const supplierSignup = async (req, res) => {
  const { name, email, password, companyName, phone, location } = req.body;

  try {
    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) return res.status(400).json({ message: "Supplier already exists" });

    const supplier = await Supplier.create({ name, email, password, companyName, phone, location });
    const { accessToken, refreshToken } = generateTokens(supplier._id);
    await storeRefreshToken(supplier._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({ id: supplier._id, name: supplier.name, email: supplier.email, role: supplier.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const supplierLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const supplier = await Supplier.findOne({ email });
    if (!supplier || !(await supplier.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = generateTokens(supplier._id);
    await storeRefreshToken(supplier._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.json({ id: supplier._id, name: supplier.name, email: supplier.email, role: supplier.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const supplierLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Supplier logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
