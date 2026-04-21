import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  moduleContentMutationKeys,
  moduleContentQueryKeys,
} from "./module-content-query-keys";
import { courseQueryKeys } from "@/features/courses/course-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";
import type { ModuleContent } from "./module-content-queries";

export interface CreateContentPayload {
  coursePk: string;
  modulePk: string;
  title: string;
  content_type: "text" | "video" | "file";
  order?: number;
  // text
  body?: string;
  // video
  video_url?: string;
  duration_seconds?: number;
  // file
  file_name?: string;
  file?: string;
}

export const useCreateModuleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: moduleContentMutationKeys.createContent(),
    mutationFn: async ({
      coursePk,
      modulePk,
      ...data
    }: CreateContentPayload) => {
      const response = await apiClient.post<ModuleContent>(
        `/api/courses/${coursePk}/modules/${modulePk}/contents/`,
        data
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: moduleContentQueryKeys.all,
      });
      toast.success({
        message: `Content "${data.title}" added successfully.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to add content. Please try again.",
      });
    },
  });
};

export interface UpdateContentPayload {
  coursePk: string;
  modulePk: string;
  id: string;
  title?: string;
  content_type?: "text" | "video" | "file";
  order?: number;
  body?: string;
  video_url?: string;
  duration_seconds?: number;
  file_name?: string;
  file?: string;
}

export const useUpdateModuleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: moduleContentMutationKeys.updateContent(),
    mutationFn: async ({
      coursePk,
      modulePk,
      id,
      ...data
    }: UpdateContentPayload) => {
      const response = await apiClient.patch<ModuleContent>(
        `/api/courses/${coursePk}/modules/${modulePk}/contents/${id}/`,
        data
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: moduleContentQueryKeys.all,
      });
      toast.success({
        message: `Content "${data.title}" updated successfully.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to update content. Please try again.",
      });
    },
  });
};

export interface DeleteContentPayload {
  coursePk: string;
  modulePk: string;
  id: string;
  title?: string;
}

export interface CompletionPayload {
  coursePk: string;
  modulePk: string;
  id: string;
}

export const useMarkContentComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: moduleContentMutationKeys.markComplete(),
    mutationFn: async ({ coursePk, modulePk, id }: CompletionPayload) => {
      await apiClient.post(
        `/api/courses/${coursePk}/modules/${modulePk}/contents/${id}/mark_complete/`
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseQueryKeys.courseMyProgress(variables.coursePk),
      });
      queryClient.invalidateQueries({
        queryKey: courseQueryKeys.courseContents(variables.coursePk),
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Could not mark lesson complete.",
      });
    },
  });
};

export const useMarkContentIncomplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: moduleContentMutationKeys.markIncomplete(),
    mutationFn: async ({ coursePk, modulePk, id }: CompletionPayload) => {
      await apiClient.post(
        `/api/courses/${coursePk}/modules/${modulePk}/contents/${id}/mark_incomplete/`
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseQueryKeys.courseMyProgress(variables.coursePk),
      });
      queryClient.invalidateQueries({
        queryKey: courseQueryKeys.courseContents(variables.coursePk),
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Could not mark lesson incomplete.",
      });
    },
  });
};

export const useDeleteModuleContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: moduleContentMutationKeys.deleteContent(),
    mutationFn: async ({ coursePk, modulePk, id }: DeleteContentPayload) => {
      await apiClient.delete(
        `/api/courses/${coursePk}/modules/${modulePk}/contents/${id}/`
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: moduleContentQueryKeys.all,
      });
      toast.success({
        message: `Content${variables.title ? ` "${variables.title}"` : ""} deleted successfully.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to delete content. Please try again.",
      });
    },
  });
};
