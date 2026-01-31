import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";
const apiClient = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use((config) => {
  // You can add authentication tokens or other headers here if needed
  return config;
});

export { apiClient };
