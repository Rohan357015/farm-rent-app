import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const normalizeOrigin = (origin) => {
  if (!origin) return "";
  try {
    return new URL(origin).origin;
  } catch {
    return origin.replace(/\/$/, "");
  }
};

const getAllowedOrigins = () =>
  (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((item) => normalizeOrigin(item.trim()))
    .filter(Boolean);

const isAllowedLocalDevOrigin = (origin) => {
  if (process.env.NODE_ENV === "production") return false;
  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === "http:" && ["localhost", "127.0.0.1", "::1"].includes(hostname);
  } catch {
    return false;
  }
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const normalizedOrigin = normalizeOrigin(origin);
      const allowedOrigins = getAllowedOrigins();

      if (
        !origin ||
        allowedOrigins.includes(normalizedOrigin) ||
        isAllowedLocalDevOrigin(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Socket origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
});

export function getReceiverSocketId(userId) {
  return Array.from(userSocketMap.get(userId?.toString()) || []);
}

export function emitToUser(userId, eventName, payload) {
  io.to(userId.toString()).emit(eventName, payload);
}

// Store online users
const userSocketMap = new Map(); // userId -> Set<socketId>

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId || socket.handshake.auth?.userId;
  if (userId) {
    const key = userId.toString();
    if (!userSocketMap.has(key)) {
      userSocketMap.set(key, new Set());
    }

    userSocketMap.get(key).add(socket.id);
    socket.join(key);
  }

  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      const key = userId.toString();
      const sockets = userSocketMap.get(key);
      sockets?.delete(socket.id);
      if (!sockets?.size) {
        userSocketMap.delete(key);
      }
    }

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server };
