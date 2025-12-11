import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useBookingStore = create((set) => ({
  loading: false,

  addBooking: async (productId, bookingData) => {
    set({ loading: true });

    try {
      const response = await axios.post(`/bookings/${productId}`, bookingData);

      toast.success("Booking created successfully");
      set({ loading: false });

      return response.data;

    } catch (error) {
      set({ loading: false });

      toast.error(error.response?.data?.message || "Failed to create booking");

      return false;
    }
  },
}));
