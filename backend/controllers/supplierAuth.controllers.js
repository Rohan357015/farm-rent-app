import Supplier from "../models/supplier.model.js";
import Farmer from "../models/farmer.model.js";
import jwt from "jsonwebtoken";
import { generateTokens, storeRefreshToken, setCookies } from "../utils/token.js";
import { redis } from "../lib/redis.js";
import { uploadSingleImages } from "../utils/uploadToCloudinary.js";

export const supplierSignup = async (req, res) => {
  const { name, email, password, companyName, phone, location } = req.body;

  try {
    // Check if email exists in either Farmer or Supplier collection
    const existingFarmer = await Farmer.findOne({ email });
    const existingSupplier = await Supplier.findOne({ email });
    
    if (existingFarmer || existingSupplier) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Always set role to "supplier" - don't accept it from request body
    const supplier = await Supplier.create({
      name,
      email,
      password,
      companyName,
      phone,
      location,
      role: "supplier"
    });

    const { accessToken, refreshToken } = generateTokens(supplier._id);
    await storeRefreshToken(supplier._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: "Supplier registered successfully",
      supplier: {
        id: supplier._id,
        name: supplier.name,
        email: supplier.email,
        role: supplier.role, // make sure default role = "supplier" in model
        companyName: supplier.companyName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const supplierLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // First check if supplier exists with correct role
    const supplier = await Supplier.findOne({ email, role: "supplier" });
    if (!supplier) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Then verify password
    const isPasswordValid = await supplier.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = generateTokens(supplier._id);
    await storeRefreshToken(supplier._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.json({
      message: "Supplier logged in successfully",
      supplier: {
        id: supplier._id,
        name: supplier.name,
        email: supplier.email,
        role: supplier.role,
        location: supplier.location,
        companyName: supplier.companyName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const supplierLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Supplier logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSupplierProfile = async (req, res) => {
  try {
    res.json({
      message: "Supplier Profile Accessed",
      supplier: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        location: req.user.location,
        companyName: req.user.companyName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateProfile = async (req, res) => {
  try {
    const supplierId = req.user._id;
    const { image, ...rest } = req.body;
    let updateData = { ...rest };

    if (image && image.length > 0) {
      const uploadedImage = await uploadSingleImages(image, "supplier");
      if (uploadedImage) {
        updateData.image = uploadedImage;
      }
    }

    const updatedUser = await Supplier.findByIdAndUpdate(
      supplierId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const deletedUser = await Supplier.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  

export const verifyToken2 = async (req, res) => {
  try {
    res.json({ isValid: true, user: req.user });
  } catch (error) {
    res.status(401).json({ isValid: false });
  }
};

