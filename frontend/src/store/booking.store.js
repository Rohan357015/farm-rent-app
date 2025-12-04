import { create } from "zustand";

export const useBookingStore = create((set, get) => ({
  loading: false,
  bookings: [],
  bookingDetails: null,
  detailsLoading: false,
  
  addBooking: async (bookingData) => {
    set({ loading: true });
    try {
      const response = await axios.post('/bookings/create', bookingData);
      toast.success(response.data.message || "Booking created successfully");
      set({ loading: false });
      return true;
    } catch (error) {   
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to create booking");
      return false;
    }
  },
}));
