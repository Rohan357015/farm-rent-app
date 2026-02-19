import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { socket } from "../lib/socket.js";

export const useConnectionStore = create((set, get) => ({
  connections: [],
  loading: false,

  /* ─── Fetch all connections ─── */
  fetchConnections: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/connections");
      set({ connections: res.data.connections });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch connections");
    } finally {
      set({ loading: false });
    }
  },

  /* ─── Send request ─── */
  sendConnectionRequest: async (receiverId) => {
    try {
      await axios.post("/connections/request", { receiverId });
      toast.success("Connection request sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  },

  /* ─── Accept request ─── */
  acceptConnectionRequest: async (connectionId) => {
    try {
      const res = await axios.post("/connections/accept", { connectionId });
      set((state) => ({
        connections: state.connections.map((c) =>
          c._id === connectionId ? { ...c, status: "Accepted" } : c
        ),
      }));
      toast.success("Connection accepted!");
      return res.data.connection;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept request");
    }
  },

  /* ─── Decline request ─── */
  declineConnectionRequest: async (connectionId) => {
    try {
      await axios.post("/connections/decline", { connectionId });
      set((state) => ({
        connections: state.connections.filter((c) => c._id !== connectionId),
      }));
      toast.success("Connection declined");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to decline request");
    }
  },

  /* ─── Remove accepted connection ─── */
  removeConnection: async (connectionId) => {
    try {
      await axios.post("/connections/remove", { connectionId });
      set((state) => ({
        connections: state.connections.filter((c) => c._id !== connectionId),
      }));
      toast.success("Connection removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove connection");
    }
  },

  /* ─── Withdraw a pending sent request ─── */
  withdrawRequest: async (connectionId) => {
    try {
      await axios.post("/connections/withdraw", { connectionId });
      set((state) => ({
        connections: state.connections.filter((c) => c._id !== connectionId),
      }));
      toast.success("Request withdrawn");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to withdraw request");
    }
  },

  /* ─── Socket listeners (call once on mount) ─── */
  initSocketListeners: () => {
    /* Incoming new request */
    socket.on("new-connection-request", (newConn) => {
      set((state) => ({
        connections: [...state.connections, newConn],
      }));
      toast("📬 New connection request received!", { icon: "🤝" });
    });

    /* Someone accepted our request */
    socket.on("connection-accepted", (updatedConn) => {
      set((state) => ({
        connections: state.connections.map((c) =>
          c._id === updatedConn._id ? { ...c, status: "Accepted" } : c
        ),
      }));
      toast.success("Your connection request was accepted! 🎉");
    });

    /* Someone rejected our request */
    socket.on("connection-rejected", (updatedConn) => {
      set((state) => ({
        connections: state.connections.filter((c) => c._id !== updatedConn._id),
      }));
    });

    /* Connection removed by the other party */
    socket.on("connection-removed", (removedConn) => {
      set((state) => ({
        connections: state.connections.filter((c) => c._id !== removedConn._id),
      }));
      toast("A connection was removed", { icon: "👋" });
    });

    /* Our pending request was withdrawn */
    socket.on("connection-withdrawn", (withdrawnConn) => {
      set((state) => ({
        connections: state.connections.filter(
          (c) => c._id !== withdrawnConn._id
        ),
      }));
    });

    /* Server pushes a fresh list */
    socket.on("connections-updated", (updatedList) => {
      set({ connections: updatedList });
    });
  },

  /* ─── Clean up listeners (call on unmount) ─── */
  removeSocketListeners: () => {
    socket.off("new-connection-request");
    socket.off("connection-accepted");
    socket.off("connection-rejected");
    socket.off("connection-removed");
    socket.off("connection-withdrawn");
    socket.off("connections-updated");
  },
}));