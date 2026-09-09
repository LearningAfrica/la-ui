import axios from "axios";

import { env } from "@/lib/env";

export const API_BASE_URL = env.VITE_API_BASE_URL;

// Create the main Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000, // 30 seconds timeout
  headers: {
    Accept: "application/json",
  },
});

// Helper functions (will be implemented with Zustand store)
let getAuthToken: () => string | null = () => null;
let getRefreshToken: () => string | null = () => null;
let setTokens: (access: string, refresh: string) => void = () => {};
let clearAuthState: () => void = () => {};
let getOrganizationId: () => string | null = () => null;

// Set the org accessor (called from the store). Org-scoped requests get the
// selected org id sent as the `X-Organization-ID` header automatically.
export const setOrganizationHelper = (getOrgId: () => string | null) => {
  getOrganizationId = getOrgId;
};

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
let refreshSubscribers: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((subscriber) => subscriber.resolve(token));
  refreshSubscribers = [];
}

function onTokenRefreshFailed(error: unknown) {
  refreshSubscribers.forEach((subscriber) => subscriber.reject(error));
  refreshSubscribers = [];
}

function addRefreshSubscriber(
  resolve: (token: string) => void,
  reject: (error: unknown) => void
) {
  refreshSubscribers.push({ resolve, reject });
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Do not set Content-Type for FormData requests. Axios/the browser must add
    // the multipart boundary; a global application/json header causes Django
    // REST Framework to receive file fields as non-file values.
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      config.headers.delete("Content-Type");
    }

    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const orgId = getOrganizationId();

    if (orgId) {
      config.headers["x-organization-id"] = orgId;
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
      !originalRequest.url?.includes("/api/auth/refresh-token/") &&
      !originalRequest.url?.includes("/api/auth/login/")
    ) {
      originalRequest._retry = true;

      const refresh = getRefreshToken();

      if (!refresh) {
        clearAuthState();

        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          }, reject);
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token/`,
          { refresh_token: refresh }
        );
        const { access_token: access, refresh_token: newRefresh } =
          response.data;

        setTokens(access, newRefresh ?? refresh);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        onTokenRefreshed(access);

        return apiClient(originalRequest);
      } catch (refreshError) {
        onTokenRefreshFailed(refreshError);
        clearAuthState();

        return Promise.reject(refreshError);
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

export const createMediaUrl = (path?: string | null): string => {
  if (!path) return "";

  if (/^(?:https?:|blob:|data:)/i.test(path)) return path;

  try {
    return new URL(path, new URL(API_BASE_URL).origin).toString();
  } catch {
    return path;
  }
};

export default apiClient;
