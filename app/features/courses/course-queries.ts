import { useQuery } from "@tanstack/react-query";
import { courseQueryKeys } from "./course-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";
import type { ModuleContent } from "@/features/module-contents/module-content-queries";
import type { User } from "@/features/users/user-queries";
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
          organization: organizationId,
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
//
// When the learner is NOT enrolled the backend returns only
// `{ is_enrolled: "false" }` (200), so every course field is optional.
// Note `is_enrolled` arrives as a string ("false"/"true"), not a boolean.
export interface CourseMyProgress {
  id?: string;
  title?: string;
  course_progress?: number;
  modules?: CourseProgressModule[];
  is_enrolled?: boolean | string;
}

// Enrolled payloads omit `is_enrolled`; the not-enrolled payload sets it to
// "false" (string). So: enrolled unless the flag is explicitly false.
export function isLearnerEnrolled(progress?: CourseMyProgress): boolean {
  if (!progress) return false;

  return progress.is_enrolled !== false && progress.is_enrolled !== "false";
}

export interface CourseWithProgress extends Course {
  course_progress?: number;
  is_enrolled?: boolean;
  enrolled_time?: string;
}

// Org progress groups learners under each course; per-learner progress carries
// the overall percent plus a per-module breakdown.
export interface OrgProgressModule {
  module_id: string;
  title: string;
  module_progress: number;
  total_contents: number;
  completed_contents: number;
}

export interface OrgProgressLearner {
  learner: User;
  enrolled_time: string;
  course_progress: number;
  modules: OrgProgressModule[];
}

export interface OrgProgressCourse {
  course_id: string;
  course_title: string;
  learners: OrgProgressLearner[];
}

export interface UseOrgProgressParams {
  page?: number;
  pageSize?: number;
}

export const useOrgProgress = (params: UseOrgProgressParams = {}) => {
  const { page = 1, pageSize = 20 } = params;
  const { selectedOrganization } = useOrganizationStore();
  const organizationId = selectedOrganization?.id;

  return useQuery({
    queryKey: courseQueryKeys.orgProgress(organizationId, page, pageSize),
    queryFn: async () => {
      const response = await apiClient.get<Paginated<OrgProgressCourse>>(
        "/api/courses/org_progress/",
        {
          params: {
            page,
            limit: pageSize,
            page_size: pageSize,
            organization: organizationId,
          },
        }
      );

      return response.data;
    },
    enabled: !!organizationId,
  });
};

export interface UseMyProgressParams {
  page?: number;
  pageSize?: number;
}

// Backend may return either a paginated wrapper or a raw array;
// callers should use `useMyProgress().data ?? []`.
export const useMyProgress = (params: UseMyProgressParams = {}) => {
  const { page = 1, pageSize = 50 } = params;
  const { selectedOrganization } = useOrganizationStore();
  const organizationId = selectedOrganization?.id;

  return useQuery({
    queryKey: courseQueryKeys.myProgress(organizationId, page, pageSize),
    queryFn: async () => {
      const response = await apiClient.get<
        Paginated<CourseWithProgress> | CourseWithProgress[]
      >("/api/my_progress/", {
        params: {
          page,
          limit: pageSize,
          page_size: pageSize,
          organization: organizationId,
        },
      });
      const body = response.data;
      const items = Array.isArray(body) ? body : (body?.data ?? []);

      return { data: items };
    },
    enabled: !!organizationId,
  });
};

// Enrolled courses for the current learner. Documented endpoint:
// /api/my-courses/?organization=<org_id>. Returns enrollment + course detail
// (with course_progress when the backend includes it).
export const useMyCourses = (params: UseMyProgressParams = {}) => {
  const { page = 1, pageSize = 50 } = params;
  const { selectedOrganization } = useOrganizationStore();
  const organizationId = selectedOrganization?.id;

  return useQuery({
    queryKey: courseQueryKeys.myCourses(organizationId, page, pageSize),
    queryFn: async () => {
      const response = await apiClient.get<
        Paginated<CourseWithProgress> | CourseWithProgress[]
      >("/api/my-courses/", {
        params: {
          page,
          limit: pageSize,
          page_size: pageSize,
          organization: organizationId,
        },
      });
      const body = response.data;
      const items = Array.isArray(body) ? body : (body?.data ?? []);

      return { data: items };
    },
    enabled: !!organizationId,
  });
};

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

export const useCourseLearnerProgress = (id: string) => {
  return useQuery({
    queryKey: courseQueryKeys.courseLearnerProgress(id),
    queryFn: async () => {
      const response = await apiClient.get<CourseMyProgress>(
        `/api/courses/${id}/learner_progress/`
      );

      return response.data;
    },
    enabled: !!id,
  });
};
