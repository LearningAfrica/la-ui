import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CategoryFormData } from "@/lib/schema/category-schema";
import { categoryMutationKeys, categoryQueryKeys } from "./category-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";
import { toFormData } from "@/lib/utils/to-form-data";
import type { Category } from "./category-queries";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: categoryMutationKeys.updateCategory(),
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CategoryFormData;
    }) => {
      const response = await apiClient.patch<Category>(
        `/api/categories/${id}/`,
        toFormData(data),
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
        message: `Category "${data.category_name}" has been updated successfully.`,
      });
    },
    onError: (error) => {
      const errorMessage = extractError(error);

      toast.error({
        message: errorMessage,
        description: "Failed to update category. Please try again.",
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: categoryMutationKeys.deleteCategory(),
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/categories/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.all,
      });
      toast.success({
        message: "Category has been deleted successfully.",
      });
    },
    onError: (error) => {
      const errorMessage = extractError(error);

      toast.error({
        message: errorMessage,
        description: "Failed to delete category. Please try again.",
      });
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: categoryMutationKeys.createCategory(),
    mutationFn: async (data: CategoryFormData) => {
      const response = await apiClient.post<Category>(
        "/api/categories/",
        toFormData(data),
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
