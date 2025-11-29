import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios.js";

export const useProductStore = create((set, get) => ({
  loading: false,
  products: [],
  supplierProducts: [], // Products for logged-in supplier
  productDetails: null,

  // ------------------- GET SUPPLIER PRODUCTS -------------------
  getSupplierProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/supplier/my-products");
      set({ 
        supplierProducts: response.data.products || [],
        loading: false 
      });
      return response.data.products || [];
    } catch (error) {
      console.error("Failed to fetch supplier products", error?.response || error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch equipment"
      );
      set({ loading: false, supplierProducts: [] });
      return [];
    }
  },

  // ------------------- ADD PRODUCT (EQUIPMENT FORM) -------------------
  PostProducts: async (formData) => {
    set({ loading: true });

  
    const capitalizeFirst = (str) => {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

   
    const toNumber = (value) => {
      if (!value || value === "") return undefined;
      const num = Number(value);
      return isNaN(num) ? undefined : num;
    };

    // Map frontend form fields to backend schema
    const payload = {
      equipmentName: formData.name || "",
      category: formData.category || "",
      brand: formData.brand || "",
      model: formData.model || "",
      yearOfManufacture: toNumber(formData.year),
      // Backend expects capitalized condition: "Excellent", "Good", "Fair"
      condition: capitalizeFirst(formData.condition) || "Good",
      description: formData.description || "",

      // Currently no images upload from this form - send empty array
      images: [],

      horsepower: toNumber(formData.horsepower),
      operatingHours: toNumber(formData.hours),

      // Convert selected features array into flags expected by backend
      features: {
        gpsEnabled: formData.features?.includes("GPS") || false,
        automatic: formData.features?.includes("Automatic") || false,
        fourWD: formData.features?.includes("4WD") || false,
        powerSteering: formData.features?.includes("Power Steering") || false,
      },
      additionalNotes: formData.notes || "",

      pricing: {
        dailyRate: toNumber(formData.dailyRate) || 0,
        weeklyRate: toNumber(formData.weeklyRate),
        monthlyRate: toNumber(formData.monthlyRate),
        securityDeposit: toNumber(formData.deposit),
      },

      availability: {
        available: !!formData.available,
      },

      location: {
        city: formData.city || "",
        state: formData.state || "",
        pincode: formData.pincode || "",
        deliveryRadius: toNumber(formData.radius),
      },

      agreement: {
        agreedToTerms: !!formData.agreed,
        verifiedInformation: !!formData.agreed,
      },
    };

    try {
      const response = await axios.post("/products/add", payload);
      toast.success(response.data.message || "Product added successfully");
      set({ loading: false });
      
      // Refresh supplier products list after successful addition
      await get().getSupplierProducts();
      
      return true;
    } catch (error) {
      console.error("Failed to add product", error?.response || error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to add product";
      toast.error(errorMessage);
      set({ loading: false });
      return false;
    }
  },
}));