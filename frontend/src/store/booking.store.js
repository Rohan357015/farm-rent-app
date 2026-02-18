import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { socket } from "../lib/socket.js";



export const useBookingStore = create((set, get) => ({
  loading: false,
  requests: [],

  // ================= SOCKET INIT =================
  initSocket: () => {
    // avoid duplicate listeners
    socket.off("new-booking");
    socket.off("booking-updated");

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    // 🔥 REAL-TIME NEW BOOKING
    socket.on("new-booking", (booking) => {
      console.log("📢 Real-time booking received:", booking);

      set((state) => ({
        requests: [booking, ...state.requests],
      }));

      toast.success("New rental request received!");
    });
    socket.on("booking-updated", ({ bookingId, status }) => {
      set((state) => ({
        requests: state.requests.map((r) =>
          r._id === bookingId
            ? { ...r, status }
            : r
        ),
      }));

      if (status === "Completed") {
        toast.success("Booking marked as completed");
      }

      if (status === "Cancelled") {
        toast.error("Booking was cancelled");
      }
    });
  },

  addBooking: async (productId, bookingData) => {
    try {
      set({ loading: true });

      const res = await axios.post(`/bookings/add/${productId}`, bookingData);

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

  getFarmerBookings: async () => {
    try {
      set({ loading: true });
      const response = await axios.get("/bookings/farmer-bookings");
      set({ loading: false });

      return response.data.bookings;
    } catch (error) {
      console.error("Get Farmer Bookings Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to get bookings");
      set({ loading: false });
      return [];
    }
  },

  cancelBookings: async (bookingId) => {
    try {
      set({ loading: true });

      const res = await axios.post(`/bookings/cancel-booking/${bookingId}`);

      toast.success("Booking cancelled successfully");

      set({ loading: false });
      return res.data.booking; // ✅ return updated booking
    } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling booking");
      set({ loading: false });
      throw error; // ✅ IMPORTANT
    }
  },

  getRequest: async () => {
    try {
      set({ loading: true });
      const res = await axios.get('/bookings/rental-request');
      set({ loading: false });
      set({ requests: res.data.bookings });
      return res.data.bookings;
      toast.success("Fetched Request Succesfully");

    } catch (error) {
      console.error("Get request  Error from frontend zustand:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to get request");
      set({ loading: false });
      return [];
    }
  },

  approveRequest: async (bookingId) => {
    try {
      set({ loading: true });

      const res = await axios.put(`/bookings/approve/${bookingId}`);
      set((state) => ({
        requests: state.requests.map((r) =>
          r._id === bookingId
            ? { ...r, status: "Approved" }
            : r
        ),
        loading: false,
      }));

      toast.success("Booking approved successfully");

      set({ loading: false });
      return res.data.booking; // ✅ updated booking

    } catch (error) {
      console.error(error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Failed to approve booking"
      );

      set({ loading: false });
      return null;
    }
  },
  declineRequest: async (bookingId) => {
    try {
      set({ loading: true });

      const res = await axios.put(`/bookings/decline/${bookingId}`);
      set((state) => ({
        requests: state.requests.map((r) =>
          r._id === bookingId
            ? { ...r, status: "Rejected" }
            : r
        ),
        loading: false,
      }));


      toast.success("Booking declined successfully");

      set({ loading: false });
      return res.data.booking; // ✅ updated booking

    } catch (error) {
      console.error(error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Failed to declined booking"
      );

      set({ loading: false });
      return null;
    }
  },
  CompleteBookings: async (bookingId) => {
    try {
      set({ loading: true });
      const res = await axios.put(`/bookings/complete/${bookingId}`)
      toast.success("work completed Successfully");

      set({ loading: false });
      return res.data.booking;
    } catch (error) {
      console.error(error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Failed to complete booking"
      );

      set({ loading: false });
      return null;
    }
  }




}));
