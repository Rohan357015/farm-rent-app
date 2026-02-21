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

dotenv.config();


const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


app.set("io", io);

app.use(
  cors({
    origin: "http://localhost:5173",
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
app.use("/api/bookings", bookRouter);
app.use("/api/cart", CartRouter);
app.use("/api/auth", authTokenRoutes);
app.use("/api", connectionRouter);
app.use("/api/messages",msgrouter);


// ✅ FIX 2: Improved production static files serving

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "frontend", "dist", "index.html")
    );
  });
}

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});