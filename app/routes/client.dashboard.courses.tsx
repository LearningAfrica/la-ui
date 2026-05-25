import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Link, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Crown,
  Layers,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Image as ImageIcon,
  ArrowRight,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourses, type Course } from "@/features/courses/course-queries";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { useTableFilters } from "@/stores/filters/use-table-filters";
import { orgRoutes } from "@/lib/utils/org-routes";
import { createMediaUrl } from "@/lib/api";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { ViewCourseDialog } from "@/components/dashboard/view-course-dialog";
import { DeleteCourseDialog } from "@/components/dashboard/delete-course-dialog";

type StatTone = "blue" | "amber" | "violet" | "emerald";

const TONE_CLASSES: Record<StatTone, string> = {
  blue: "bg-[var(--color-la-forest)]/10 text-[var(--color-la-forest)]",
  amber: "bg-[var(--color-la-amber)]/10 text-[var(--color-la-amber)]",
  violet:
    "bg-[var(--color-la-forest-soft)]/10 text-[var(--color-la-forest-soft)]",
  emerald: "bg-[var(--color-la-ok)]/10 text-[var(--color-la-ok)]",
};

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  isLoading,
  hint,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: StatTone;
  isLoading?: boolean;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {label}
        </CardTitle>
        <div className={cn("rounded-lg p-2", TONE_CLASSES[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <>
            <div className="text-2xl font-bold tabular-nums">{value}</div>
            {hint && (
              <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function CourseCard({ course, orgId }: { course: Course; orgId: string }) {
  const deleteModal = useAppModal("delete-course");
  const moduleCount = course.modules?.length ?? 0;
  const lessonCount =
    course.modules?.reduce((acc, m) => acc + (m.contents?.length ?? 0), 0) ?? 0;

  return (
    <Card className="flex flex-col overflow-hidden">
      {/* Thumbnail */}
      <div className="bg-muted relative aspect-[16/9] w-full">
        {course.course_image ? (
          <img
            src={createMediaUrl(course.course_image)}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        {course.category && (
          <Badge variant="outline" className="w-fit text-xs">
            {course.category.category_name}
          </Badge>
        )}
        <h3 className="line-clamp-2 font-semibold">{course.title}</h3>
        <p className="text-muted-foreground text-sm">
          {moduleCount} {moduleCount === 1 ? "module" : "modules"} &middot;{" "}
          {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
        </p>
      </CardContent>

      {/* Footer */}
      <div className="border-t px-4 py-3">
        <div className="flex items-center justify-between">
          <Badge variant={course.is_premium ? "default" : "secondary"}>
            {course.is_premium ? `$${course.price} Premium` : "Free"}
          </Badge>
          <div className="flex items-center gap-1">
            <Button asChild size="sm" variant="outline" className="h-8">
              <Link
                prefetch="intent"
                to={orgRoutes.courseModules(orgId, course.id)}
              >
                Manage
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={orgRoutes.coursePreview(orgId, course.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Course
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={orgRoutes.courseEdit(orgId, course.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteModal.open(course)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ClientDashboardCourses() {
  const { orgId = "" } = useParams<{ orgId: string }>();
  const { state, setPage, setLimit } = useTableFilters("courses");
  const page = state.page;
  const pageSize = state.limit;
  const { selectedOrganization } = useOrganizationStore();
  const canCreate =
    selectedOrganization?.role === "instructor" ||
    selectedOrganization?.role === "admin";
  const {
    data: coursesData,
    isLoading,
    isFetching,
    refetch,
  } = useCourses({ page, pageSize });

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const courses = useMemo(() => coursesData?.data ?? [], [coursesData?.data]);

  const filteredCourses = useMemo(() => {
    let result = courses;

    if (typeFilter !== "all") {
      const isPremium = typeFilter === "premium";

      result = result.filter((course) => course.is_premium === isPremium);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(q) ||
          course.category?.category_name?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [courses, typeFilter, searchQuery]);

  const stats = useMemo(() => {
    const premium = courses.filter((c) => c.is_premium).length;
    let modules = 0;
    let lessons = 0;

    for (const course of courses) {
      modules += course.modules?.length ?? 0;

      for (const mod of course.modules ?? []) {
        lessons += mod.contents?.length ?? 0;
      }
    }

    return {
      total: coursesData?.meta?.total_docs ?? 0,
      premium,
      modules,
      lessons,
    };
  }, [courses, coursesData]);

  const totalPages = coursesData?.meta?.total_pages || 1;
  const hasNext = coursesData?.meta?.has_next_page || false;
  const hasPrev = coursesData?.meta?.has_prev_page || false;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground mt-1">
          {canCreate
            ? "Create and manage courses in your workspace"
            : "Browse and oversee courses in your workspace"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Courses"
          value={stats.total}
          icon={GraduationCap}
          tone="blue"
          isLoading={isLoading}
        />
        <StatCard
          label="Premium"
          value={stats.premium}
          icon={Crown}
          tone="amber"
          isLoading={isLoading}
          hint={`of ${courses.length} on this page`}
        />
        <StatCard
          label="Modules"
          value={stats.modules}
          icon={Layers}
          tone="violet"
          isLoading={isLoading}
          hint="across loaded courses"
        />
        <StatCard
          label="Lessons"
          value={stats.lessons}
          icon={BookOpen}
          tone="emerald"
          isLoading={isLoading}
          hint="across loaded courses"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring h-9 w-52 rounded-lg border px-8 text-sm outline-none focus:ring-1"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="free">Free</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {canCreate && (
            <Button asChild size="sm">
              <Link to={orgRoutes.courseNew(orgId)}>
                <Plus className="mr-1 h-4 w-4" />
                Create Course
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn("mr-1 h-4 w-4", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[16/9] w-full" />
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="border-border/60 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <div className="bg-primary/10 text-primary rounded-full p-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">No courses yet</h3>
            <p className="text-muted-foreground max-w-sm text-sm">
              {canCreate
                ? "Create your first course to start adding modules and lessons for your learners."
                : "Courses created in this organization will appear here."}
            </p>
          </div>
          {canCreate && (
            <Button asChild className="mt-2">
              <Link to={orgRoutes.courseNew(orgId)}>
                <Plus className="mr-1 h-4 w-4" />
                Create your first course
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} orgId={orgId} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-muted-foreground text-sm">
              Page {page} of {totalPages} &bull; {coursesData?.meta?.total_docs}{" "}
              total courses
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => setLimit(Number(value))}
              >
                <SelectTrigger className="h-8 w-[90px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={!hasPrev}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={!hasNext}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Dialogs */}
      <ViewCourseDialog />
      <DeleteCourseDialog />
    </div>
  );
}
