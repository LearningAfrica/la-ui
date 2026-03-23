import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseFormData } from "@/lib/schema/course-schema";
import { courseMutationKeys, courseQueryKeys } from "./course-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";
import { toFormData } from "@/lib/utils/to-form-data";
import type { Course } from "./course-queries";

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: courseMutationKeys.updateCourse(),
    mutationFn: async ({ id, data }: { id: string; data: CourseFormData }) => {
      const response = await apiClient.patch<Course>(
        `/api/courses/${id}/`,
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
        queryKey: courseQueryKeys.all,
      });
      toast.success({
        message: `Course "${data.title}" has been updated successfully.`,
      });
    },
    onError: (error) => {
      const errorMessage = extractError(error);

      toast.error({
        message: errorMessage,
        description: "Failed to update course. Please try again.",
      });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: courseMutationKeys.deleteCourse(),
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/courses/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: courseQueryKeys.all,
      });
      toast.success({
        message: "Course has been deleted successfully.",
      });
    },
    onError: (error) => {
      const errorMessage = extractError(error);

      toast.error({
        message: errorMessage,
        description: "Failed to delete course. Please try again.",
      });
    },
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: courseMutationKeys.createCourse(),
    mutationFn: async (data: CourseFormData) => {
      const response = await apiClient.post<Course>(
        "/api/courses/",
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
        queryKey: courseQueryKeys.all,
      });
      toast.success({
        message: `Course "${data.title}" has been created successfully.`,
      });
    },
    onError: (error) => {
      const errorMessage = extractError(error);

      toast.error({
        message: errorMessage,
        description: "Failed to create course. Please try again.",
      });
    },
  });
};
