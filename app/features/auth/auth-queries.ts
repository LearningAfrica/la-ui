import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { authQueryKeys } from "./auth-query-keys";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  canCreateOrg?: boolean;
  organizationId?: string;
}

interface ErrorResponse {
  message: string;
}

// Get Current User
export const useCurrentUser = () => {
  return useQuery<User | null, ErrorResponse>({
    queryKey: authQueryKeys.currentUser(),
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return null;

      const response = await axios.get<User>("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Verify Email Token
export const useVerifyEmail = (token: string) => {
  return useQuery<{ message: string }, ErrorResponse>({
    queryKey: authQueryKeys.verifyEmail(token),
    queryFn: async () => {
      const response = await axios.post<{ message: string }>(
        "/api/auth/verify-email",
        { token }
      );
      return response.data;
    },
    enabled: !!token,
    retry: false,
  });
};

// Check Auth Status
export const useAuthStatus = () => {
  return useQuery<boolean, ErrorResponse>({
    queryKey: authQueryKeys.authStatus(),
    queryFn: async () => {
      try {
        await apiClient.get("/api/auth/verify");
        return true;
      } catch {
        return false;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
