import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { get } from "mongoose";

export const useBookingStore = create((set) => ({
  loading: false,

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

  cancelBookings:async(bookingId,bookingData)=>{
    try{
      set({loading:true});
      const res = await axios.post(`/bookings/cancel-booking/${bookingId}`,bookingData);
      toast.success("booking cancelled");
      set({loading:false});
      return res.data;

    }catch(error){
      console.error(error.message);
     toast.error("error in cancelling the booking");
    }
  },


}));
