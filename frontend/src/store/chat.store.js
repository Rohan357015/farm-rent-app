import { create } from "zustand";
import { io } from "socket.io-client";
import axios from "../lib/axios.js";

const BASE_URL = "http://localhost:5000";

export const useChatStore = create((set, get) => ({
  connections: [],
  selectedUser: null,
  messages: [],
  onlineUsers: [],
  socket: null,
  isLoadingConnections: false,
  isLoadingMessages: false,

  // ================= SOCKET =================
  connectSocket: (userId) => {
    if (get().socket) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
      query: { userId },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    socket.on("newMessage", (message) => {
      const { selectedUser } = get();

      if (!selectedUser) return;

      const senderId =
        message.senderId?._id || message.senderId;
      const receiverId =
        message.receiverId?._id || message.receiverId;

      if (
        String(senderId) === String(selectedUser._id) ||
        String(receiverId) === String(selectedUser._id)
      ) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) socket.disconnect();
    set({ socket: null });
  },

 
  fetchConnections: async () => {
    set({ isLoadingConnections: true });

    try {
      const { data } = await axios.get("/messages/users");
       console.log("RAW connections from API:", JSON.stringify(data, null, 2));
      set({ connections: data });
     
    } catch (err) {
      console.error("Connections error:", err);
    } finally {
      set({ isLoadingConnections: false });
    }
  },

  // ================= SELECT USER =================
  setSelectedUser: async (user) => {
    set({ selectedUser: user, messages: [] });
    if (user) {
      await get().fetchMessages(user._id);
    }
  },

  // ================= FETCH MESSAGES =================
  fetchMessages: async (userId) => {
    set({ isLoadingMessages: true });

    try {
      const { data } = await axios.get(`/messages/${userId}`);
      set({ messages: data });
    } catch (err) {
      console.error("Messages error:", err);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  // ================= SEND MESSAGE =================
  sendMessage: async (text) => {
    const { selectedUser } = get();
    if (!selectedUser || !text.trim()) return;

    try {
      const { data } = await axios.post(
        `/messages/send/${selectedUser._id}`,
        { text }
      );

      set((state) => ({
        messages: [...state.messages, data],
      }));
    } catch (err) {
      console.error("Send message error:", err);
    }
  },
}));