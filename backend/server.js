import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';



const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: "http://localhost:5173", // allow your React frontend
  credentials: true,               // allow cookies and auth headers if used
}));

dotenv.config();
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);

});
