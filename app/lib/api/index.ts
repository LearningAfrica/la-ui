import axios from "axios";

// Get the base URL from environment variables
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create the main Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper functions (will be implemented with Zustand store)
let getAuthToken: () => string | null = () => null;
let getRefreshToken: () => string | null = () => null;
let setTokens: (access: string, refresh: string) => void = () => {};
let clearAuthState: () => void = () => {};

// Function to set the auth helpers (called from auth store)
export const setAuthHelpers = (
  getToken: () => string | null,
  clearAuth: () => void,
  getRefresh?: () => string | null,
  updateTokens?: (access: string, refresh: string) => void
) => {
  getAuthToken = getToken;
  clearAuthState = clearAuth;

  if (getRefresh) getRefreshToken = getRefresh;

  if (updateTokens) setTokens = updateTokens;
};

// Track whether a token refresh is in progress to avoid duplicate requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
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

// Response interceptor with token refresh handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/token/refresh/") &&
      !originalRequest.url?.includes("/api/auth/login/")
    ) {
      originalRequest._retry = true;

      const refresh = getRefreshToken();

      if (!refresh) {
        clearAuthState();

        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/token/refresh/`,
          { refresh }
        );
        const { access, refresh: newRefresh } = response.data;

        setTokens(access, newRefresh ?? refresh);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        onTokenRefreshed(access);

        return apiClient(originalRequest);
      } catch {
        clearAuthState();

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      const { status } = error.response;

      if (status === 403) {
        console.error("Access forbidden");
      } else if (status === 500) {
        console.error("Server error");
      }
    } else if (error.request) {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export const createMediaUrl = (path: string) => `${API_BASE_URL}${path}`;

export default apiClient;
