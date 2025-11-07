import React from "react";
import axios from "../lib/axios";

import {toast } from 'react-hot-toast';
import { create } from "zustand";




export const useAuthStore =  create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

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
    }
}))
