import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7h",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
};

export const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Optional: validate against Redis
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate fresh tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    await storeRefreshToken(decoded.userId, newRefreshToken);

    setCookies(res, accessToken, newRefreshToken);

    return res.json({ message: "Token refreshed successfully" });

  } catch (error) {
    return res.status(401).json({ message: "Refresh token expired, login again" });
  }
};
