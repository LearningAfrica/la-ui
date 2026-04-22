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
  course_image: string | null;
  created_at: string;
  category: CourseCategory;
  tags: string[];
  modules: CourseModule[];
}

export interface UseCoursesParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const useCourses = (params: UseCoursesParams = {}) => {
  const { page = 1, pageSize = 10, search } = params;
  const { selectedOrganization } = useOrganizationStore();
  const organizationId = selectedOrganization?.id;

  return useQuery({
    queryKey: courseQueryKeys.courses(organizationId, page, pageSize, search),
    queryFn: async () => {
      const response = await apiClient.get<Paginated<Course>>("/api/courses/", {
        params: {
          page,
          page_size: pageSize,
          limit: pageSize,
          search,
          organization_id: organizationId,
        },
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
  id: string;
  title: string;
  order: number;
  content_type: "text" | "video" | "file";
  data: Record<string, unknown>;
  is_completed: boolean;
}

export interface CourseProgressModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  module_progress: number;
  contents: CourseProgressContent[];
}

// Backend returns the enriched course with nested module → content progress.
// Individual completion lives on each content row, so the top level surfaces
// `course_progress` and modules rather than a flat contents array.
export interface CourseMyProgress {
  id: string;
  title: string;
  course_progress: number;
  modules: CourseProgressModule[];
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
