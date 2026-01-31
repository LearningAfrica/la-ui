import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/lib/schema/auth-schema";
import { authMutationKeys } from "./auth-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    canCreateOrg?: boolean;
  };
  token: string;
  refreshToken?: string;
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Login Mutation
export const useLogin = () => {
  return useMutation<AuthResponse, ErrorResponse, LoginFormData>({
    mutationKey: authMutationKeys.login(),
    mutationFn: async (data) => {
      const response = await apiClient.post<AuthResponse>(
        "/api/auth/login/",
        data
      );
      return response.data;
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Login failed"),
        description: "Login Failed, Please try again.",
      });
    },
  });
};

// Register Mutation
export const useRegister = () => {
  return useMutation<AuthResponse, ErrorResponse, RegisterFormData>({
    mutationKey: authMutationKeys.register(),
    mutationFn: async (data) => {
      const response = await apiClient.post<AuthResponse>(
        "/api/auth/register/",
        data
      );
      return response.data;
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Registration failed"),
        description: "Registration Failed, Please try again.",
      });
    },
  });
};

// Forgot Password Mutation
export const useForgotPassword = () => {
  return useMutation<
    { message: string },
    ErrorResponse,
    ForgotPasswordFormData
  >({
    mutationKey: authMutationKeys.forgotPassword(),
    mutationFn: async (data) => {
      const response = await apiClient.post<{ message: string }>(
        "/api/auth/forgot-password/",
        data
      );
      return response.data;
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Request failed"),
        description: "Password reset request failed, Please try again.",
      });
    },
  });
};

// Reset Password Mutation
export const useResetPassword = () => {
  return useMutation<
    { message: string },
    ErrorResponse,
    ResetPasswordFormData & { token: string }
  >({
    mutationKey: authMutationKeys.resetPassword(),
    mutationFn: async (data) => {
      const response = await apiClient.post<{ message: string }>(
        "/api/auth/reset-password/",
        data
      );
      return response.data;
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Password reset failed"),
        description: "Password reset failed, Please try again.",
      });
    },
  });
};

// Logout
export const useLogout = () => {
  return useMutation<void, ErrorResponse, void>({
    mutationKey: authMutationKeys.logout(),
    mutationFn: async () => {
      await apiClient.post("/api/auth/logout/");
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Logout failed"),
        description: "Logout failed, Please try again.",
      });
    },
  });
};
