import React from "react";
import axios from "../lib/axios";

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
// ...existing code...
   getFarmerDashboard: async () => {
  set({ loading: true });
  const farmerId = get().user?._id;   // assume login sets user._id
  if (!farmerId) {
    set({ loading: false });
    return;
  }
  try {
    const response = await axios.get(`/auth/farmer/getfarmer?id=${farmerId}`);
    set({
      user: response.data.user,
      stats: response.data.stats,
      loading: false
    });
  } catch (error) {
    toast.error("Error fetching farmer dashboard");
    set({ loading: false });
  }
}

}))
