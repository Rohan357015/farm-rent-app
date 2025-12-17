import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // cookies bhejne ke liye
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 aaya aur abhi retry nahi kiya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh-token hit karo
        await axiosInstance.post("/auth/refresh-token");
        // same request dubara
        return axiosInstance(originalRequest);
      } catch (err) {
        // refresh bhi fail → user ko login karwana padega
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
