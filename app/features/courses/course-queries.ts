import { useQuery } from "@tanstack/react-query";
import { courseQueryKeys } from "./course-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";

export interface CourseInstructor {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  profile: string | null;
}

export interface CourseCategory {
  id: string;
  category_name: string;
}

export interface CourseModuleContent {
  id: string;
  title?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  contents: CourseModuleContent[];
}

export interface Course {
  id: string;
  instructor: CourseInstructor;
  title: string;
  slug: string;
  overview: string;
  is_premium: boolean;
  is_private: boolean;
  price: number;
  course_image_url: string;
  created_at: string;
  category: CourseCategory;
  tags: string[];
  modules: CourseModule[];
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

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: courseQueryKeys.course(id),
    queryFn: async () => {
      const response = await apiClient.get<Course>(`/api/courses/${id}/`);

      return response.data;
    },
    enabled: !!id,
  });
};
