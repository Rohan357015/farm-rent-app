import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useBookingStore = create((set) => ({
  loading: false,

  addBooking: async (productId, bookingData) => {
    try {
      set({ loading: true });

      const res = await axios.post(`/booking/add/${productId}`, bookingData);

      toast.success("Booking created successfully!");
      set({ loading: false });
      return res.data;

    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Booking failed");
      set({ loading: false });
      return null;
    }
  },
}));
