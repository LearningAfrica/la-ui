import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import ArrowLeft from "~icons/lucide/arrow-left";
import { useCourse } from "@/features/courses/course-queries";
import { CurriculumBuilder } from "@/components/dashboard/curriculum-builder";
import { CreateOrUpdateModuleDialog } from "@/components/dashboard/create-or-update-module-dialog";
import { OrgRoleGuard } from "@/components/auth/org-role-guard";
import { orgRoutes } from "@/lib/utils/org-routes";

export default function ClientDashboardCourseModules() {
  return (
    <OrgRoleGuard allowedRoles={["admin", "instructor"]}>
      <ClientDashboardCourseModulesInner />
    </OrgRoleGuard>
  );
}

function ClientDashboardCourseModulesInner() {
  const { orgId = "", courseId = "" } = useParams<{
    orgId: string;
    courseId: string;
  }>();

  const { data: course } = useCourse(courseId);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-2">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to={orgRoutes.courses(orgId)}>
            <ArrowLeft className="mr-1 size-4" />
            Courses
          </Link>
        </Button>
      </div>
      {course?.title && (
        <p className="text-la-muted mb-6 text-sm">
          Editing{" "}
          <span className="text-la-ink font-medium">{course.title}</span>
        </p>
      )}

      <CurriculumBuilder courseId={courseId} orgId={orgId} />

      {/* Create / edit module dialog — opened via the builder's Add module + row edit */}
      <CreateOrUpdateModuleDialog coursePk={courseId} />
    </div>
  );
}
