import express from 'express';
import dotenv from 'dotenv';
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

// ✅ FIX 1: Dynamic CORS configuration for Render deployment


app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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

// ✅ FIX 2: Improved production static files serving
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" ,env: process.env.NODE_ENV  });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});