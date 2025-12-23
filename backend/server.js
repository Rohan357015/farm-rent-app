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
const __dirname = path.resolve();

// ✅ FIX 1: Dynamic CORS configuration for Render deployment
const allowedOrigins = [
  'http://localhost:5173', // Development
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Add your Render frontend URL here
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

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
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  
  // Serve index.html for all non-API routes (SPA routing)
  app.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    }
  });
}

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});