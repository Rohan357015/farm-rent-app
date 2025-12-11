import express from 'express';
import Booking from '../models/booking.model.js';
import {Product} from '../models/product.model.js';

export const addBooking = async (req, res) => {
  try{

    const {product, farmer, startDate, endDate, pickUpLocation, returnLocation, purpose, operators, totalPrice} = req.body;
    if(!farmer || !startDate || !endDate || !pickUpLocation || !returnLocation || !purpose){
      return  res.status(400).json({ message: "All fields are required" });
    }
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    if(days <= 0){
      return res.status(400).json({ message: "End date must be after start date" });
    }
    const productId = req.params.id;
    if(productId !== product){
      return res.status(400).json({ message: "Product ID mismatch" });
    }
    const productData = await Product.findById(productId);
    if (!productData) return res.status(404).json({ message: "Product not found" });

    const supplier = productData.supplier;
    const newBooking = new Booking({
      product: productId,
      farmer,
      startDate,
      endDate,
      supplier,
      pickUpLocation,
      returnLocation,
      purpose,
      operators,
      days,
      totalPrice
    });
    await newBooking.save();
    res.status(201).json(newBooking);
  }catch(error){
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
}