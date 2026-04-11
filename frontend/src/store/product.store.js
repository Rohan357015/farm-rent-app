import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios.js";

const getEquipmentPayload = (data) => ({
  items: Array.isArray(data) ? data : data?.equipment || data?.products || [],
  hasMore: Boolean(data?.hasMore),
  page: data?.page || 1,
  total: data?.total || 0,
});

export const useProductStore = create((set, get) => ({
  loading: false,
  products: [],
  supplierProducts: [],
  productDetails: null,
  detailsLoading: false,
  recommendedEquipment: [],
  searchResults: [],
  recommendationLoading: false,
  searchLoading: false,
  ratingLoading: false,
  searchPerformed: false,
  recommendationPage: 1,
  searchPage: 1,
  hasMoreRecommendations: false,
  hasMoreSearchResults: false,

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
      deliveryAndPickup: formData.deliveryAndPickup || false,
      deliveryPrices: Number(formData.deliveryPrices) || 0,
      operator: formData.operator || false,
      operatorCharges: Number(formData.operatorCharges) || 0,


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
        lat: toNumber(formData.lat),
        lng: toNumber(formData.lng),
        address: formData.address || formData.city || "",
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
  getRecommendedEquipment: async (coords = {}, options = {}) => {
    set({ recommendationLoading: true });
    try {
      const page = options.page || 1;
      const response = await axios.get("/equipment/recommended", {
        params: { ...coords, page, limit: options.limit || 12 },
      });
      const payload = getEquipmentPayload(response.data);

      set((state) => ({
        recommendedEquipment: options.append
          ? [...state.recommendedEquipment, ...payload.items]
          : payload.items,
        recommendationLoading: false,
        searchPerformed: false,
        recommendationPage: payload.page,
        hasMoreRecommendations: payload.hasMore,
      }));

      return payload.items;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load recommendations");
      set({ recommendationLoading: false, recommendedEquipment: [] });
      return [];
    }
  },
  searchEquipment: async (params = {}, options = {}) => {
    set({ searchLoading: true });
    try {
      const page = options.page || 1;
      const response = await axios.get("/equipment/search", {
        params: { ...params, page, limit: options.limit || 12 },
      });
      const payload = getEquipmentPayload(response.data);

      set((state) => ({
        searchResults: options.append
          ? [...state.searchResults, ...payload.items]
          : payload.items,
        searchLoading: false,
        searchPerformed: true,
        searchPage: payload.page,
        hasMoreSearchResults: payload.hasMore,
      }));

      return payload.items;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to search equipment");
      set({ searchLoading: false, searchResults: [], searchPerformed: true });
      return [];
    }
  },
  clearSearchResults: () => {
    set({ searchResults: [], searchPerformed: false, searchPage: 1, hasMoreSearchResults: false });
  },
  rateProduct: async (payload) => {
    set({ ratingLoading: true });
    try {
      const response = await axios.post("/rating/product", payload);
      set((state) => ({
        ratingLoading: false,
        productDetails: state.productDetails
          ? {
              ...state.productDetails,
              averageRating: response.data.averageRating,
              ratings: response.data.ratings,
            }
          : state.productDetails,
      }));
      toast.success(response.data.message || "Rating saved");
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save rating");
      set({ ratingLoading: false });
      return null;
    }
  },
  rateSupplier: async (payload) => {
    set({ ratingLoading: true });
    try {
      const response = await axios.post("/rating/supplier", payload);
      set((state) => ({
        ratingLoading: false,
        productDetails: state.productDetails
          ? {
              ...state.productDetails,
              supplier: state.productDetails.supplier
                ? {
                    ...state.productDetails.supplier,
                    averageRating: response.data.averageRating,
                    ratings: response.data.ratings,
                  }
                : state.productDetails.supplier,
            }
          : state.productDetails,
      }));
      toast.success(response.data.message || "Rating saved");
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save rating");
      set({ ratingLoading: false });
      return null;
    }
  },
  rateRenter: async (payload) => {
    set({ ratingLoading: true });
    try {
      const response = await axios.post("/rating/renter", payload);
      toast.success(response.data.message || "Rating saved");
      set({ ratingLoading: false });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save rating");
      set({ ratingLoading: false });
      return null;
    }
  },
  getFarmerProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/farmer/products", {
        params: { page: 1, limit: 24 },
      });
      const productsArray = getEquipmentPayload(response.data).items;

      set({
        products: productsArray,
        loading: false
      });

      return productsArray;
    } catch (error) {
      console.error("❌ Failed to fetch farmer products", error);
      console.error("Error response:", error?.response);
      console.error("Error data:", error?.response?.data);
      toast.error(
        error?.response?.data?.message || "Failed to fetch equipment"
      );
      set({ loading: false, products: [] });
      return [];
    }
  },
  getProductDetails: async (id) => {
    set({ detailsLoading: true });
    try {
      const response = await axios.get(`/products/${id}`);

      set({
        productDetails: response.data || null,
        detailsLoading: false,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load equipment details"
      );
      set({ detailsLoading: false, productDetails: null });
      return null;
    }
  },
  updateProduct: async (id, updateData) => {
    set({ loading: true });
    try {
      const response = await axios.put(`/products/update/${id}`, updateData);
      toast.success(response.data.message || "Product updated successfully");
      set({ loading: false });

      // Refresh supplier products list after successful update
      await get().getSupplierProducts();

      return true;
    } catch (error) {
      console.error("Failed to update product", error?.response || error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update product";
      toast.error(errorMessage);
      set({ loading: false });
      return false;
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.delete(`/products/delete/${id}`);
      toast.success(response.data.message || "Product deleted successfully");
      set({ loading: false });

      // Refresh supplier products list after successful deletion
      await get().getSupplierProducts();

      return true;
    } catch (error) {
      console.error("Failed to delete product", error?.response || error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete product";
      toast.error(errorMessage);
      set({ loading: false });
      return false;
    }
  },
}));
