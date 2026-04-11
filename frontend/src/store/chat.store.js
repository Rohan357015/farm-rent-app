import { create } from "zustand";
import axios from "../lib/axios.js";
import { socket } from "../lib/socket.js";

let activeMessagesRequest = 0;

const getUserId = (value) => (value?._id || value)?.toString();

const belongsToChat = (message, selectedUser) => {
  const selectedUserId = getUserId(selectedUser);
  if (!selectedUserId) return false;

  return (
    getUserId(message.senderId) === selectedUserId ||
    getUserId(message.receiverId) === selectedUserId
  );
};

const appendUniqueMessage = (messages, message) => {
  if (!message?._id || messages.some((item) => item._id === message._id)) {
    return messages;
  }

  return [...messages, message].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );
};

export const useChatStore = create((set, get) => ({
  connections: [],
  selectedUser: null,
  messages: [],
  onlineUsers: [],
  isLoadingConnections: false,
  isLoadingMessages: false,

  connectSocket: (userId) => {
    if (!userId) return;

    socket.auth = { userId };
    socket.io.opts.query = { userId };

    socket.off("getOnlineUsers");
    socket.off("newMessage");

    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    socket.on("newMessage", (message) => {
      const { selectedUser } = get();
      if (!belongsToChat(message, selectedUser)) return;

      set((state) => ({
        messages: appendUniqueMessage(state.messages, message),
      }));
    });

    if (!socket.connected) {
      socket.connect();
    }
  },

  disconnectSocket: () => {
    socket.off("getOnlineUsers");
    socket.off("newMessage");
  },

  fetchConnections: async () => {
    set({ isLoadingConnections: true });

    try {
      const { data } = await axios.get("/messages/users");
      set({ connections: Array.isArray(data) ? data : [] });
    } catch (err) {
      console.error("Connections error:", err);
      set({ connections: [] });
    } finally {
      set({ isLoadingConnections: false });
    }
  },

  setSelectedUser: async (user) => {
    activeMessagesRequest += 1;
    set({ selectedUser: user, messages: [] });
    if (user) {
      await get().fetchMessages(user._id, activeMessagesRequest);
    }
  },

  fetchMessages: async (userId, requestId = ++activeMessagesRequest) => {
    set({ isLoadingMessages: true });

    try {
      const { data } = await axios.get(`/messages/${userId}`);
      if (requestId !== activeMessagesRequest) return;

      set({ messages: Array.isArray(data) ? data : [] });
    } catch (err) {
      if (requestId === activeMessagesRequest) {
        set({ messages: [] });
      }
      console.error("Messages error:", err);
    } finally {
      if (requestId === activeMessagesRequest) {
        set({ isLoadingMessages: false });
      }
    }
  },

  sendMessage: async (text) => {
    const { selectedUser } = get();
    if (!selectedUser || !text.trim()) return;

    try {
      const { data } = await axios.post(`/messages/send/${selectedUser._id}`, {
        text: text.trim(),
      });

      set((state) => ({
        messages: appendUniqueMessage(state.messages, data),
      }));
    } catch (err) {
      console.error("Send message error:", err);
    }
  },
}));
