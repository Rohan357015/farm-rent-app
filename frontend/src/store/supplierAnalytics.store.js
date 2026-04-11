import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

const emptyAnalytics = {
  summary: {
    totalLifetime: 0,
    thisMonth: 0,
    lastMonth: 0,
    monthlyGrowthPercent: 0,
    pendingPayouts: 0,
    pendingPayoutCount: 0,
    completedRentals: 0,
    totalPaidBookings: 0,
  },
  breakdowns: {
    daily: [],
    weekly: [],
    monthly: [],
  },
  topEquipment: [],
  transactions: {
    bookings: [],
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
};

export const useSupplierAnalyticsStore = create((set, get) => ({
  analytics: emptyAnalytics,
  loading: false,
  filters: {
    from: "",
    to: "",
    page: 1,
    limit: 10,
  },

  fetchSupplierAnalytics: async (nextFilters = {}) => {
    const filters = { ...get().filters, ...nextFilters };
    set({ loading: true, filters });

    try {
      const response = await axios.get("/bookings/supplier/earnings", {
        params: filters,
      });

      set({
        analytics: {
          ...emptyAnalytics,
          ...response.data,
          summary: { ...emptyAnalytics.summary, ...response.data?.summary },
          breakdowns: { ...emptyAnalytics.breakdowns, ...response.data?.breakdowns },
          transactions: { ...emptyAnalytics.transactions, ...response.data?.transactions },
        },
        loading: false,
      });

      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load earnings analytics");
      set({ loading: false });
      return null;
    }
  },

  resetFilters: () => {
    set({
      filters: {
        from: "",
        to: "",
        page: 1,
        limit: 10,
      },
    });
  },
}));
