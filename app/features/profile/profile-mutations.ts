import { useMutation } from "@tanstack/react-query";

import type {
  UpdateProfileFormData,
  ChangePasswordFormData,
} from "@/lib/schema/profile-schema";
import { profileMutationKeys } from "./profile-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ProfileUpdateResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  is_active: boolean;
}

// Update Profile Mutation
export const useUpdateProfile = () => {
  return useMutation<
    ProfileUpdateResponse,
    ErrorResponse,
    UpdateProfileFormData
  >({
    mutationKey: profileMutationKeys.updateProfile(),
    mutationFn: async (data) => {
      const response = await apiClient.patch<ProfileUpdateResponse>(
        "/api/auth/profile/",
        data
      );

      return response.data;
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Profile update failed"),
        description: "Please try again.",
      });
    },
  });
};

// Change Password Mutation
export const useChangePassword = () => {
  return useMutation<
    { message: string },
    ErrorResponse,
    ChangePasswordFormData
  >({
    mutationKey: profileMutationKeys.changePassword(),
    mutationFn: async (data) => {
      const response = await apiClient.post<{ message: string }>(
        "/api/auth/change-password/",
        data
      );

      return response.data;
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Password change failed"),
        description: "Please try again.",
      });
    },
  });
};
