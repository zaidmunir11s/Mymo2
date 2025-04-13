import axios from "axios";
import { useStore } from "@/store/useStore";
import { API_URL } from "@/constants/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  return config;
});

export default axiosInstance;
