import { useQuery } from "@tanstack/react-query";
import { userQueryKeys } from "./user-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";

export interface UserProfile {
  title: string;
  bio: string;
  profile_image: string | null;
  phone_number: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  profile: UserProfile | null;
}

export const useUsers = (page: number = 1, search?: string) => {
  return useQuery({
    queryKey: userQueryKeys.users(page, search),
    queryFn: async () => {
      const response = await apiClient.get<Paginated<User>>(
        "/api/auth/users/",
        { params: { page, search } }
      );

      return response.data;
    },
  });
};
