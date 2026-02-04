import { useMutation } from "@tanstack/react-query";

import type {
  LoginFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  RegisterFormData,
} from "@/lib/schema/auth-schema";
import { authMutationKeys } from "./auth-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";

export type SystemUserRole = "super_admin" | "user";

export interface AuthResponseInterface {
  refresh: string;
  access: string;
  user_role: SystemUserRole;
  can_create_organization: false;
  organizations: [];
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
    is_active: boolean;
  };
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Login Mutation
export const useLogin = () => {
  return useMutation({
    mutationKey: authMutationKeys.login(),
    mutationFn: async (data: LoginFormData) => {
      const response = await apiClient.post<AuthResponseInterface>(
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
  return useMutation({
    mutationKey: authMutationKeys.register(),
    mutationFn: async (data: RegisterFormData) => {
      const response = await apiClient.post<AuthResponseInterface["user"]>(
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
        "/api/auth/password-reset/",
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
        "/api/auth/password-reset-complete/",
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

// Verify Email Mutation
export const useVerifyEmail = () => {
  return useMutation<{ message: string }, ErrorResponse, { token: string }>({
    mutationKey: authMutationKeys.verifyEmail(),
    mutationFn: async ({ token }) => {
      const response = await apiClient.post<{ message: string }>(
        "/api/auth/verify-email/",
        { token }
      );

      return response.data;
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Email verification failed"),
        description: "Email verification failed, Please try again.",
      });
    },
  });
};

// Resend Verification Email
export const useResendVerificationEmail = () => {
  return useMutation<{ message: string }, ErrorResponse, string>({
    mutationFn: async (email: string) => {
      const response = await apiClient.post<{ message: string }>(
        "/api/auth/resend-verification-email/",
        { email }
      );

      return response.data;
    },
    retry: false,
    onSuccess: () => {
      toast.success({
        message: "Verification Email Sent",
        description:
          "A new verification email has been sent to your email address.",
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Resend failed"),
        description: "Resending verification email failed, Please try again.",
      });
    },
  });
};
