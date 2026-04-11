import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { connectDB } from './lib/db.js';
import farmerRoutes from './routes/farmer.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import productRouter from './routes/product.routes.js';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import bookRouter from './routes/book.routes.js';
import CartRouter from './routes/cart.route.js';
import authTokenRoutes from "./routes/auth.routes.js";
import connectionRouter from './routes/connection.routes.js';
import msgrouter from './routes/message.routes.js';
import {io,app,server} from './lib/socket.js';
import equipmentRouter from './routes/equipment.routes.js';
import ratingRouter from './routes/rating.routes.js';

dotenv.config();


const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


app.set("io", io);

const normalizeOrigin = (origin) => {
  if (!origin) return "";
  try {
    return new URL(origin).origin;
  } catch {
    return origin.replace(/\/$/, "");
  }
};

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => normalizeOrigin(origin.trim()))
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

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = normalizeOrigin(origin);
      if (
        !origin ||
        allowedOrigins.includes(normalizedOrigin) ||
        isAllowedLocalDevOrigin(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API Routes
app.use("/api/auth", farmerRoutes);
app.use("/api/auth", supplierRoutes);
app.use("/api/products", productRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/bookings", bookRouter);
app.use("/api/cart", CartRouter);
app.use("/api/auth", authTokenRoutes);
app.use("/api", connectionRouter);
app.use("/api/messages",msgrouter);

app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// ✅ FIX 2: Improved production static files serving

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "frontend", "dist", "index.html")
    );
  });
}

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
