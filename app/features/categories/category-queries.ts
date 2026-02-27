import { useQuery } from "@tanstack/react-query";
import { categoryQueryKeys } from "./category-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";

export interface Category {
  id: string;
  category_name: string;
  category_image_url: string | null;
  description: string;
  created: string;
  updated: string;
}

export const useCategories = (page: number = 1, search?: string) => {
  return useQuery({
    queryKey: categoryQueryKeys.categories(page, search),
    queryFn: async () => {
      const response = await apiClient.get<Paginated<Category>>(
        "/api/categories/",
        { params: { page, search } }
      );

      return response.data;
    },
  });
};
