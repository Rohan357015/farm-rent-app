import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { socket } from "../lib/socket.js";

export const useBookingStore = create((set, get) => ({
  loading: false,
  requests: [],
  availabilityResult: null,

  // Initialize socket listeners once
  initSocket: () => {
    // Remove old listeners to avoid duplicate events
    socket.off("new-booking");
    socket.off("booking-updated");
    socket.off("bookingCreated");
    socket.off("bookingStatusUpdated");
    socket.off("bookingCancelled");
    socket.off("connect");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // New booking event
    const handleNewBooking = (booking) => {
      set((state) => ({
        requests: [booking, ...state.requests],
      }));
    };

    socket.on("new-booking", handleNewBooking);
    socket.on("bookingCreated", handleNewBooking);

    // Booking status update event
    const handleBookingUpdate = ({ bookingId, status }) => {
      set((state) => ({
        requests: state.requests.map((r) =>
          r._id?.toString() === bookingId?.toString()
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
    };

    socket.on("booking-updated", handleBookingUpdate);
    socket.on("bookingStatusUpdated", handleBookingUpdate);
    socket.on("bookingCancelled", handleBookingUpdate);
  },

  // Farmer can check date availability before booking
  checkAvailability: async (equipmentId, startDate, endDate) => {
    try {
      const response = await axios.get("/bookings/check-availability", {
        params: {
          equipmentId,
          startDate,
          endDate,
        },
      });

      set({ availabilityResult: response.data });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to check availability";
      toast.error(message);
      return { available: false, message };
    }
  },

  addBooking: async (productId, bookingData) => {
    try {
      set({ loading: true });

      const res = await axios.post(`/bookings/add/${productId}`, bookingData);

      toast.success("Booking created successfully");
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

  getFarmerBookingSummary: async () => {
    try {
      const response = await axios.get("/bookings/farmer-bookings", {
        params: { summary: true },
        timeout: 8000,
      });

      return {
        total: response.data.total || 0,
        active: response.data.active || 0,
      };
    } catch (error) {
      console.error("Get Farmer Booking Summary Error:", error.response?.data || error.message);
      return { total: 0, active: 0 };
    }
  },

  cancelBookings: async (bookingId) => {
    try {
      set({ loading: true });

      const res = await axios.post(`/bookings/cancel-booking/${bookingId}`);

      toast.success("Booking cancelled successfully");

      set({ loading: false });
      return res.data.booking;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling booking");
      set({ loading: false });
      throw error;
    }
  },

  getRequest: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("/bookings/rental-request");
      set({ loading: false });
      set({ requests: res.data.bookings });
      return res.data.bookings;
    } catch (error) {
      console.error("Get request error:", error.response?.data || error.message);
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
      return res.data.booking;
    } catch (error) {
      console.error(error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Failed to approve booking");

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
      return res.data.booking;
    } catch (error) {
      console.error(error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Failed to decline booking");

      set({ loading: false });
      return null;
    }
  },

  CompleteBookings: async (bookingId) => {
    try {
      set({ loading: true });
      const res = await axios.put(`/bookings/complete/${bookingId}`);
      toast.success("Work completed successfully");

      set({ loading: false });
      return res.data.booking;
    } catch (error) {
      console.error(error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Failed to complete booking");

      set({ loading: false });
      return null;
    }
  },
}));
