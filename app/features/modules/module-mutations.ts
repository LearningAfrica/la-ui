import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moduleMutationKeys, moduleQueryKeys } from "./module-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";
import type { CourseModuleDetail } from "./module-queries";

export interface CreateModulePayload {
  coursePk: string;
  title: string;
  description?: string;
}

export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: moduleMutationKeys.createModule(),
    mutationFn: async ({ coursePk, ...data }: CreateModulePayload) => {
      const response = await apiClient.post<CourseModuleDetail>(
        `/api/courses/${coursePk}/modules/`,
        data
      );

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...moduleQueryKeys.all, variables.coursePk],
      });
      toast.success({
        message: `Module "${data.title}" created successfully.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to create module. Please try again.",
      });
    },
  });
};

export interface UpdateModulePayload {
  coursePk: string;
  id: string;
  title?: string;
  description?: string;
}

export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: moduleMutationKeys.updateModule(),
    mutationFn: async ({ coursePk, id, ...data }: UpdateModulePayload) => {
      const response = await apiClient.patch<CourseModuleDetail>(
        `/api/courses/${coursePk}/modules/${id}/`,
        data
      );

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...moduleQueryKeys.all, variables.coursePk],
      });
      queryClient.invalidateQueries({
        queryKey: moduleQueryKeys.module(variables.coursePk, variables.id),
      });
      toast.success({
        message: `Module "${data.title}" updated successfully.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to update module. Please try again.",
      });
    },
  });
};

export interface DeleteModulePayload {
  coursePk: string;
  id: string;
  title?: string;
}

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: moduleMutationKeys.deleteModule(),
    mutationFn: async ({ coursePk, id }: DeleteModulePayload) => {
      await apiClient.delete(`/api/courses/${coursePk}/modules/${id}/`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...moduleQueryKeys.all, variables.coursePk],
      });
      toast.success({
        message: `Module${variables.title ? ` "${variables.title}"` : ""} deleted successfully.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to delete module. Please try again.",
      });
    },
  });
};
