import { useQuery } from "@tanstack/react-query";
import { courseQueryKeys } from "./course-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";

export interface Course {
  id: string;
  organization: string;
  category: number;
  category_name?: string;
  title: string;
  overview: string;
  is_premium: boolean;
  price: number;
  is_private: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const useCourses = (page: number = 1, search?: string) => {
  return useQuery({
    queryKey: courseQueryKeys.courses(page, search),
    queryFn: async () => {
      const response = await apiClient.get<Paginated<Course>>("/api/courses/", {
        params: { page, search },
      });

      return response.data;
    },
  });
};
