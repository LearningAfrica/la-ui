import { useQuery } from "@tanstack/react-query";
import { courseQueryKeys } from "./course-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";
import type { ModuleContent } from "@/features/module-contents/module-content-queries";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";

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
  const { selectedOrganization } = useOrganizationStore();
  const organizationId = selectedOrganization?.id;

  return useQuery({
    queryKey: courseQueryKeys.courses(organizationId, page, search),
    queryFn: async () => {
      const response = await apiClient.get<Paginated<Course>>("/api/courses/", {
        params: { page, search, organization_id: organizationId },
      });

      return response.data;
    },
    enabled: !!organizationId,
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

export interface CourseContentItem extends ModuleContent {
  module_id: string;
}

export const useCourseContents = (id: string) => {
  return useQuery({
    queryKey: courseQueryKeys.courseContents(id),
    queryFn: async () => {
      const response = await apiClient.get<CourseContentItem[]>(
        `/api/courses/${id}/contents/`
      );

      return response.data;
    },
    enabled: !!id,
  });
};

export interface CourseProgressContent {
  content_id: string;
  is_completed: boolean;
  completed_at: string | null;
}

export interface CourseMyProgress {
  course_id: string;
  total_contents: number;
  completed_contents: number;
  progress_percent: number;
  contents: CourseProgressContent[];
}

export const useCourseMyProgress = (id: string) => {
  return useQuery({
    queryKey: courseQueryKeys.courseMyProgress(id),
    queryFn: async () => {
      const response = await apiClient.get<CourseMyProgress>(
        `/api/courses/${id}/my_progress/`
      );

      return response.data;
    },
    enabled: !!id,
  });
};
