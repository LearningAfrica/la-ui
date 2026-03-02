import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseFormData } from "@/lib/schema/course-schema";
import { courseMutationKeys, courseQueryKeys } from "./course-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";
import type { Course } from "./course-queries";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: courseMutationKeys.createCourse(),
    mutationFn: async (data: CourseFormData) => {
      const formData = new FormData();

      formData.append("organization", data.organization);
      formData.append("category", data.category);
      formData.append("title", data.title);
      formData.append("overview", data.overview);
      formData.append("is_premium", String(data.is_premium));
      formData.append("price", String(data.price));
      formData.append("is_private", String(data.is_private));

      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag) => {
          formData.append("tags", tag);
        });
      }

      if (data.course_image) {
        formData.append("course_image", data.course_image);
      }

      const response = await apiClient.post<Course>("/api/courses/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: courseQueryKeys.courses(),
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
