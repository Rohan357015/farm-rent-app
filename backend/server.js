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
// server.js
import authTokenRoutes from "./routes/auth.routes.js"; 



const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


app.use(cors({
  origin: "http://localhost:5173", // allow your React frontend
  credentials: true,               // allow cookies and auth headers if used
}));

app.use(cookieParser());
dotenv.config();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth", farmerRoutes);
app.use("/api/auth", supplierRoutes);
app.use("/api/products", productRouter);
app.use("/api/bookings", bookRouter);
app.use("/api/cart", CartRouter);
app.use("/api/auth", authTokenRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("/.*/", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);

});
