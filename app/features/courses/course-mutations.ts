import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseFormData } from "@/lib/schema/course-schema";
import { courseMutationKeys, courseQueryKeys } from "./course-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";
import { toFormData } from "@/lib/utils/to-form-data";
import type { Course } from "./course-queries";

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
