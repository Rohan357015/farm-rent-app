// src/stores/useCartStore.js
import { create } from "zustand";
import axios from "../lib/axios"; // axios instance with baseURL and auth header
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  subtotal: 0,
  total: 0,
  coupon: null,
  isCouponApplied: false,

  fetchCart: async () => {
    try {
      const res = await axios.get("/cart"); // GET /cart
      const data = res.data;
      // res.data: { items: [...], subtotal }
      set({ cart: data.items || [], subtotal: data.subtotal || 0 });
      get().calculateTotals();
    } catch (err) {
      console.error("fetchCart error", err);
      set({ cart: [], subtotal: 0 });
    }
  },

  addToCart: async ({ equipmentId, quantity = 1, startDate, endDate }) => {
    try {
      await axios.post("/cart/add", { equipmentId, quantity, startDate, endDate });
      toast.success("Added to cart");
      // Optimistic update: refetch or update local state
      await get().fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  },

  updateCartItem: async (equipmentId, { quantity, startDate, endDate }) => {
    try {
      await axios.put(`/cart/update/${equipmentId}`, { quantity, startDate, endDate });
      await get().fetchCart();
      toast.success("Cart updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update cart");
    }
  },

  removeFromCart: async (equipmentId) => {
    try {
      await axios.delete("/cart/remove", { data: { equipmentId } });
      await get().fetchCart();
      toast.success("Item removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  },

  clearCart: async () => {
    try {
      await axios.delete("/cart/remove", { data: {} }); // clear
      set({ cart: [], subtotal: 0, total: 0, coupon: null });
      toast.success("Cart cleared");
    } catch (err) {
      toast.error("Failed to clear cart");
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce((sum, it) => sum + (it.totalPrice ?? (it.pricePerDay * it.quantity * (it.days || 1))), 0);
    let total = subtotal;
    // add delivery/taxes etc if needed here or in backend during checkout
    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },
}));
