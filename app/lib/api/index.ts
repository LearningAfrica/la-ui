import axios from "axios";

// Get the base URL from environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create the main Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from auth store (we'll implement this below)
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth state and redirect to login
          clearAuthState();
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access forbidden");
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
        default:
          console.error("API Error:", error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Helper functions (will be implemented with Zustand store)
let getAuthToken: () => string | null = () => null;
let clearAuthState: () => void = () => {};

// Function to set the auth helpers (called from auth store)
export const setAuthHelpers = (
  getToken: () => string | null,
  clearAuth: () => void
) => {
  getAuthToken = getToken;
  clearAuthState = clearAuth;
};

export default apiClient;
