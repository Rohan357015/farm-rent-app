import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Farmer from "../models/farmer.model.js";
import Supplier from "../models/supplier.model.js";
import { generateTokens, setCookies, storeRefreshToken } from "../utils/token.js";
import { redis } from "../lib/redis.js";

dotenv.config();

export const ProtectRoute = async (req, res, next) => {
  try {
    let accessToken = req.cookies.accessToken;
    let refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Unauthorized - No tokens found" });
    }

    let decoded;

    // -------------------------------
    // 1️⃣ TRY VERIFY ACCESS TOKEN
    // -------------------------------
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      // ACCESS TOKEN EXPIRED → TRY REFRESH TOKEN
      if (error.name === "TokenExpiredError") {
        console.log("Access token expired → using refresh token.");

        try {
          // VERIFY REFRESH TOKEN
          const refreshData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

          // CHECK IF REFRESH TOKEN MATCHES REDIS
          const storedToken = await redis.get(`refresh_token:${refreshData.userId}`);
          if (!storedToken || storedToken !== refreshToken) {
            return res.status(401).json({ message: "Refresh token invalid or expired" });
          }

          // GENERATE NEW TOKENS
          const { accessToken: newAccess, refreshToken: newRefresh } =
            generateTokens(refreshData.userId);

          // STORE NEW REFRESH TOKEN IN REDIS
          await storeRefreshToken(refreshData.userId, newRefresh);

          // SET NEW COOKIES
          setCookies(res, newAccess, newRefresh);

          decoded = { userId: refreshData.userId }; // Use refreshed userId

        } catch (refreshError) {
          console.log("Refresh token expired.");
          return res.status(401).json({ message: "Session expired. Please log in again." });
        }
      } else {
        return res.status(401).json({ message: "Unauthorized - Invalid access token" });
      }
    }

    // -------------------------------
    // 2️⃣ FETCH USER FROM DB
    // -------------------------------
    const farmer = await Farmer.findById(decoded.userId).select("-password");
    const supplier = await Supplier.findById(decoded.userId).select("-password");

    const user = farmer || supplier;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User does not exist" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("ProtectRoute Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
