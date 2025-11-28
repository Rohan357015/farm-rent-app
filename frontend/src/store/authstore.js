import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  stats: null,

  // ------------------- SUPPLIER REGISTER -------------------
  SupplierRegister: async (supplierData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/supplier/signup", supplierData);

      toast.success(response.data.message || "Supplier registered successfully");
      // backend: { message, supplier: {...} }
      set({ user: response.data.supplier, loading: false });

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error registering supplier"
      );
      set({ loading: false });
      return false;
    }
  },

  // ------------------- FARMER REGISTER -------------------
  FarmerRegister: async (farmerData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/farmer/signup", farmerData);

      toast.success(response.data.message || "Farmer registered successfully");
      // backend: { message, farmer: {...} }
      set({ user: response.data.farmer, loading: false });

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error registering farmer");
      set({ loading: false });
      return false;
    }
  },

  // ------------------- FARMER LOGIN -------------------
  FarmerLogin: async (credentials) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/farmer/login", credentials);

      toast.success(response.data.message || "Farmer logged in successfully");
      set({ user: response.data.farmer, loading: false });

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging in farmer");
      set({ loading: false });
      return false;
    }
  },

  // ------------------- SUPPLIER LOGIN -------------------
  SupplierLogin: async (credentials) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/supplier/login", credentials);

      toast.success(
        response.data.message || "Supplier logged in successfully"
      );
      set({ user: response.data.supplier, loading: false });

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging in supplier");
      set({ loading: false });
      return false;
    }
  },

  // ------------------- FARMER LOGOUT -------------------
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

  // ------------------- SUPPLIER LOGOUT -------------------
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

  // ------------------- FARMER DASHBOARD -------------------
  getFarmerDashboard: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/auth/farmer/getfarmer");

      // backend: { message, farmer: {...} }
      set({ user: response.data.farmer, loading: false });

      return response.data.farmer;
    } catch (error) {
      toast.error("Error fetching farmer dashboard");
      set({ loading: false });
      return null;
    }
  },

  // ------------------- SUPPLIER DASHBOARD -------------------
  getSupplierDashboard: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        "/auth/supplier/getSupplierProfile"
      );

      // backend: { message, supplier: {...} }
      set({ user: response.data.supplier, loading: false });

      return response.data.supplier;
    } catch (error) {
      toast.error("Error fetching supplier dashboard");
      set({ loading: false });
      return null;
    }
  },
}));
