import express from "express";
import cloudinary from "cloudinary";
import Farmer from "../models/farmer.model.js";

import { Product } from "../models/product.model.js";
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("supplier", "name email companyName phone location") ||
    await Product.findById(req.params.id).populate("supplier", "name email companyName phone location");
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "product retrieval failed" });
  }
};

// Your Cloudinary setup

// Get products by supplier (for supplier dashboard)
export const getSupplierProducts = async (req, res) => {
  try {
    const supplierId = req.user._id; // Authenticated supplier ID from middleware
    
    const products = await Product.find({ supplier: supplierId })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json({ 
      message: "Products fetched successfully", 
      products,
      count: products.length 
    });
  } catch (error) {
    console.error("Error retrieving supplier products:", error);
    res.status(500).json({ message: "Failed to retrieve products" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      equipmentName,
      category,
      brand,
      model,
      yearOfManufacture,
      condition,
      description,
      images,
      horsepower,
      operatingHours,
      features,
      additionalNotes,
      pricing,
      availability,
      location,
      terms,
      agreement,
      status,
    } = req.body;

    // Validate required fields
    if (!equipmentName || !category) {
      return res.status(400).json({ message: "Equipment name and category are required" });
    }

    if (!pricing || !pricing.dailyRate) {
      return res.status(400).json({ message: "Daily rate is required" });
    }

    let cloudinaryResponse = null;
    
    // Handle image upload if images array has items
    if (images && Array.isArray(images) && images.length > 0) {
      // If images are provided, upload first image (for now)
      // TODO: Handle multiple image uploads
      try {
        cloudinaryResponse = await cloudinary.uploader.upload(images[0], { folder: "products" });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        // Continue without image if upload fails
      }
    }

    const newProduct = new Product({
      supplier: req.user._id,  // Authenticated user is the supplier (from supplierRoute middleware)
      equipmentName,
      category,
      brand: brand || "",
      model: model || "",
      yearOfManufacture: yearOfManufacture || undefined,
      condition: condition || "Good",
      description: description || "",
      images: cloudinaryResponse?.secure_url ? [cloudinaryResponse.secure_url] : [],

      horsepower: horsepower || undefined,
      operatingHours: operatingHours || undefined,
      features: features || {},
      additionalNotes: additionalNotes || "",

      pricing: pricing || {},
      availability: availability || { available: true },
      location: location || {},

      terms: terms || {},
      agreement: agreement || { agreedToTerms: false, verifiedInformation: false },
      status: status || 'Approved',
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    // Return more specific error message
    const errorMessage = error.message || "Product addition failed";
    res.status(500).json({ message: errorMessage, error: error.name });
  }
};

export const farmersGetAllProducts = async (req, res) => {
    try{
    console.log("=== Farmer Products Request ===");
    console.log("User:", req.user?._id, req.user?.role);
    
    // First check all products regardless of status
    const allProducts = await Product.find();
    console.log(`Total products in database: ${allProducts.length}`);
    console.log("Products by status:", {
      Approved: allProducts.filter(p => p.status === "Approved").length,
      Pending: allProducts.filter(p => p.status === "Pending").length,
      Rejected: allProducts.filter(p => p.status === "Rejected").length
    });
    
    // Show all approved products to all farmers
    const products = await Product.find({ status: "Approved" })
      .populate("supplier", "name email companyName phone location")
      .sort({ createdAt: -1 }); // Sort by newest first
    
    console.log(`Returning ${products.length} approved products`);
    
    if (products.length === 0) {
      console.log("WARNING: No approved products found. Showing all products instead.");
      // If no approved products, show all products (for testing)
      const allProductsForFarmer = await Product.find()
        .populate("supplier", "name email companyName phone location")
        .sort({ createdAt: -1 });
      return res.json(allProductsForFarmer);
    }
    
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "product retrieval failed", error: error.message });
    }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("supplier", "name email phone location");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error loading product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

