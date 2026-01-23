import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  loading: false,
  checkingAuth: true,
  stats: null,
  supplierStats: null,

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/supplier/verify").catch(() => null);
      if (res?.data) {
        set({ user: res.data.user, checkingAuth: false });
        return;
      }

      const res2 = await axios.get("/auth/farmer/verify").catch(() => null);
      if (res2?.data) {
        set({ user: res2.data.user, checkingAuth: false });
        return;
      }

      set({ user: null, checkingAuth: false });
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ user: null, checkingAuth: false });
    }
  },

  SupplierRegister: async (supplierData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/supplier/signup", supplierData);
      toast.success(response.data.message || "Supplier registered successfully");
      set({
        user: response.data.supplier,
        role: "supplier",        // 🔥 HERE
        loading: false
      });

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error registering supplier");
      set({ loading: false });
      return false;
    }
  },

  FarmerRegister: async (farmerData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/farmer/signup", farmerData);
      toast.success(response.data.message || "Farmer registered successfully");
      set({
        user: response.data.farmer,
        role: "farmer",          // 🔥 HERE
        loading: false
      });

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error registering farmer");
      set({ loading: false });
      return false;
    }
  },

  FarmerLogin: async (credentials) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/farmer/login", credentials);
      toast.success(response.data.message || "Farmer logged in successfully");
      set({
        user: response.data.farmer,
        role: "farmer",          // 🔥 HERE
        loading: false
      });

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging in farmer");
      set({ loading: false });
      return false;
    }
  },

  SupplierLogin: async (credentials) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/supplier/login", credentials);
      toast.success(response.data.message || "Supplier logged in successfully");
      set({
        user: response.data.supplier,
        role: "supplier",        // 🔥 HERE
        loading: false
      });

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging in supplier");
      set({ loading: false });
      return false;
    }
  },

  farmerLogout: async () => {
    set({ loading: true });
    try {
      await axios.post("/auth/farmer/logout");
      toast.success("Farmer logged out");
      set({ user: null, loading: false });
    } catch (error) {
      toast.error("Logout failed");
      set({ loading: false });
    }
  },

  supplierLogout: async () => {
    set({ loading: true });
    try {
      await axios.post("/auth/supplier/logout");
      toast.success("Supplier logged out");
      set({ user: null, loading: false });
    } catch (error) {
      toast.error("Logout failed");
      set({ loading: false });
    }
  },

  getFarmerDashboard: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/auth/farmer/getfarmer");
      set({ user: response.data.farmer, loading: false });
      return response.data.farmer;
    } catch (error) {
      toast.error("Error fetching farmer dashboard");
      set({ loading: false });
      return null;
    }
  },

  getSupplierDashboard: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/auth/supplier/getSupplierProfile");
      set({ supplierStats: response.data.supplier, loading: false });
      return response.data.supplier;
    } catch (error) {
      toast.error("Error fetching supplier dashboard");
      set({ loading: false });
      return null;
    }
  },

  // ✅ FIXED: Changed user: response.data.user to match backend response
  updateFarmerProfile: async (data) => {
    set({ loading: true });
    try {
      const response = await axios.put("/auth/farmer/update", data);
      set({ user: response.data.user, loading: false });
      toast.success("Profile updated successfully");
      return response.data.user;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to update profile");
      return null;
    }
  },

  updateSupplierProfile: async (data) => {
    set({ loading: true });
    try {
      const response = await axios.put("/auth/supplier/update", data);
      set({ user: response.data.user, loading: false });
      toast.success("Profile updated successfully");
      return response.data.user;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to update profile");
      return null;
    }
  },

  deleteFarmer: async () => {
    try {
      set({ loading: true });
      const res = await axios.delete("/auth/farmer/delete");
      toast.success("Account deleted successfully");
      set({ user: null, isAuthenticated: false, loading: false });
      return true;
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to delete account");
      set({ loading: false });
      return false;
    }
  },

  deleteSupplier: async () => {
    try {
      set({ loading: true });
      const res = await axios.delete("/auth/farmer/delete");
      toast.success("Account deleted successfully");
      set({ user: null, isAuthenticated: false, loading: false });
      return true;
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to delete account");
      set({ loading: false });
      return false;
    }
  },
}));
