import express from "express";
import Cloudinary from "cloudinary";

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
      supplier,
      location,
      terms,
      agreement,
      status,
    } = req.body;

    let cloudinaryResponse = null;
    
		if (images) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

    const newProduct = new Product({
      farmer: req.user._id,  // Assuming authenticated user is the farmer
      equipmentName,
      category,
      brand,
      model,
      yearOfManufacture,
      condition,
      description,
      images: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",

      horsepower,
      operatingHours,
      features,
      additionalNotes,

      pricing,
      availability,
      supplier,
      location,

      terms,
      agreement,
      status: status || 'Pending',
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Product addition failed" });
  }
};
