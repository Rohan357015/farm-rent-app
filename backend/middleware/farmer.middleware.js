import express from 'express';
import Farmer from '../models/farmer.model.js';
import Supplier from '../models/supplier.model.js';


export const farmerRoute = async (req, res, next) => {
    try{
        // Check if user exists and has farmer role
        if(!req.user){
            return res.status(401).json({message: "Unauthorized - Please login first"});
        }
        if(req.user.role !== 'farmer'){
            return res.status(403).json({message: "Access denied. Farmers only."});
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const supplierRoute = async (req, res, next) => {
    try{
        // Check if user exists and has supplier role
        if(!req.user){
            return res.status(401).json({message: "Unauthorized - Please login first"});
        }
        if(req.user.role !== 'supplier'){
            return res.status(403).json({message: "Access denied. Suppliers only."});
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}