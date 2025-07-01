// src/app/utils/axios_instance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  // baseURL: "http://localhost:7677/api/v1",
});

axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default axiosInstance;
