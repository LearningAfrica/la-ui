import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CategoryFormData } from "@/lib/schema/category-schema";
import { categoryMutationKeys, categoryQueryKeys } from "./category-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";
import type { Category } from "./category-queries";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: categoryMutationKeys.createCategory(),
    mutationFn: async (data: CategoryFormData) => {
      const response = await apiClient.post<Category>(
        "/api/categories/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.all,
      });
      toast.success({
        message: `Category "${data.category_name}" has been created successfully.`,
      });
    },
    onError: (error) => {
      const errorMessage = extractError(error);

      toast.error({
        message: errorMessage,
        description: "Failed to create category. Please try again.",
      });
    },
  });
};
