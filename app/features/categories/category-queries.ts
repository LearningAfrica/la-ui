import { useQuery } from "@tanstack/react-query";
import { categoryQueryKeys } from "./category-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";

export interface Category {
  id: string;
  category_name: string;
  category_image: string | null;
  category_image_url: string;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

type FetchCategoriesParams = {
  page?: number;
  search?: string;
  limit?: number;
};

export const useCategories = (params: FetchCategoriesParams = {}) => {
  return useQuery({
    queryKey: categoryQueryKeys.categories(params.page, params.search),
    queryFn: async () => {
      const response = await apiClient.get<Paginated<Category>>(
        "/api/categories/",
        { params }
      );

      return response.data;
    },
  });
};
