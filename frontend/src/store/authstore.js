import React from "react";
import axios from "../lib/axios.js";

import {toast } from 'react-hot-toast';
import { create } from "zustand";





export const useAuthStore =  create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,
    stats : null,

    SupplierRegister : async (supplierData) => {
        set({loading: true});
        try {
            const response = await axios.post("/auth/supplier/signup", supplierData);
            toast.success("Supplier registered successfully");
            set({user: response.data.user, loading: false});
        } catch (error) {
            toast.error("Error registering supplier");
            set({loading: false});
        }
    },
    FarmerRegister : async (farmerData) => {
        set({loading: true});
        try {
            const response = await axios.post("/auth/farmer/signup", farmerData);
            toast.success("Farmer registered successfully");
            set({user: response.data.user, loading: false});
        } catch (error) {
            toast.error("Error registering farmer");
            set({loading: false});
        }
    },
    FarmerLogin : async (credentials) => {
        set({loading: true});
        try {
            const response = await axios.post("/auth/farmer/login", credentials);
            toast.success("Farmer logged in successfully");
            set({user: response.data.user, loading: false});
        } catch (error) {
            toast.error("Error logging in farmer");
            set({loading: false});
        }
    },
    SupplierLogin : async (credentials) => {
        set({loading: true});
        try {
            const response = await axios.post("/auth/supplier/login", credentials);
            toast.success("Supplier logged in successfully");
            set({user: response.data.user, loading: false});
        } catch (error) {
            toast.error("Error logging in supplier");
            set({loading: false});
        }   
    },
    // ...existing code...
    farmerLogout: async () => {
        set({loading: true});
        try {
            await axios.post("/auth/farmer/logout");
            toast.success("Farmer logged out successfully");
            set({user: null, loading: false});
        } catch (error) {
            toast.error("Error logging out farmer");
            set({loading: false});
        }
    },
    supplierLogout: async () => {
        set({loading: true});
        try{
            await axios.post("/auth/supplier/logout");
            toast.success("Supplier logged out successfully");
            set({user: null, loading: false});
        } catch (error) {
            toast.error("Error logging out supplier");
            set({loading: false});
        }
    },
// ...existing code...
   getFarmerDashboard: async () => {
        set({loading: true});
        try {
            const response = await axios.get("/auth/farmer/getfarmer");
            toast.success("Farmer dashboard data fetched successfully");
            set({user:response.data.farmer, loading: false});
        } catch (error) {
            toast.error("Error fetching farmer dashboard data");
            set({loading: false});
        }
    },
    getSupplierDashboard: async () => {
        set({loading: true});
        try {
            const response = await axios.get("/auth/supplier/getSupplierProfile");
            toast.success("Supplier dashboard data fetched successfully");
            set({user:response.data.supplier, loading: false});
        } catch (error) {
            toast.error("Error fetching supplier dashboard data");
            set({loading: false});
        }
    },

}))
