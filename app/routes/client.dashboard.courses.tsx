import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
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
import GraduationCap from "~icons/lucide/graduation-cap";
import ChevronLeft from "~icons/lucide/chevron-left";
import ChevronRight from "~icons/lucide/chevron-right";
import Plus from "~icons/lucide/plus";
import RefreshCw from "~icons/lucide/refresh-cw";
import Eye from "~icons/lucide/eye";
import Pencil from "~icons/lucide/pencil";
import Trash2 from "~icons/lucide/trash-2";
import MoreHorizontal from "~icons/lucide/more-horizontal";
import ArrowRight from "~icons/lucide/arrow-right";
import Search from "~icons/lucide/search";
import { OptimisticImage } from "@/components/ui/optimistic-image";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CourseForm } from "@/components/dashboard/course-form";

function CourseCard({
  course,
  orgId,
  canManage,
  onEdit,
}: {
  course: Course;
  orgId: string;
  canManage: boolean;
  onEdit: (course: Course) => void;
}) {
  const deleteModal = useAppModal("delete-course");
  const moduleCount = course.modules?.length ?? 0;
  const lessonCount =
    course.modules?.reduce((acc, m) => acc + (m.contents?.length ?? 0), 0) ?? 0;
  const primaryTo = canManage
    ? orgRoutes.courseModules(orgId, course.id)
    : orgRoutes.coursePreview(orgId, course.id);

  return (
    <div className="group border-la-rule-strong bg-la-paper flex flex-col overflow-hidden rounded-lg border transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Thumbnail */}
      <Link
        prefetch="intent"
        to={orgRoutes.coursePreview(orgId, course.id)}
        className="block"
      >
        <OptimisticImage
          src={
            course.course_image
              ? createMediaUrl(course.course_image)
              : undefined
          }
          alt={course.title}
          wrapperClassName="aspect-[16/9] w-full"
          iconSize="size-10"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {course.category && (
          <span className="border-la-rule bg-la-cream text-la-ink-2 w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium">
            {course.category.category_name}
          </span>
        )}
        <h3 className="font-display text-la-ink line-clamp-2 font-bold">
          {course.title}
        </h3>
        <p className="text-la-muted text-sm tabular-nums">
          {moduleCount} {moduleCount === 1 ? "module" : "modules"} &middot;{" "}
          {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
        </p>
      </div>

      {/* Footer */}
      <div className="border-la-rule flex items-center justify-between border-t px-4 py-3">
        <span
          className={cn(
            "font-display rounded-full px-2.5 py-0.5 text-xs font-semibold",
            course.is_premium
              ? "bg-la-forest-wash text-la-forest"
              : "bg-la-cream text-la-ink-2"
          )}
        >
          {course.is_premium ? `$${course.price} premium` : "Free"}
        </span>
        <div className="flex items-center gap-1">
          <Button asChild size="sm" variant="outline" className="h-8">
            <Link prefetch="intent" to={primaryTo}>
              {canManage ? "Manage" : "View course"}
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
          {canManage && (
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
                    Preview course
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(course)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
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
          )}
        </div>
      </div>
    </div>
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
  // Course create/edit lives in a right-side Sheet (no full-page nav / overlay modal).
  const [courseSheet, setCourseSheet] = useState<{
    open: boolean;
    course: Course | null;
  }>({ open: false, course: null });
  const openCreateCourse = () => setCourseSheet({ open: true, course: null });
  const openEditCourse = (course: Course) =>
    setCourseSheet({ open: true, course });
  const closeCourseSheet = () => setCourseSheet({ open: false, course: null });

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

  const statCards = [
    {
      key: "total",
      eyebrow: "Catalog",
      value: stats.total,
      title: "Total courses",
      accent: "bg-la-ink",
    },
    {
      key: "premium",
      eyebrow: "Premium",
      value: stats.premium,
      title: `of ${courses.length} on this page`,
      accent: "bg-la-forest",
    },
    {
      key: "modules",
      eyebrow: "Modules",
      value: stats.modules,
      title: "Across loaded courses",
      accent: "bg-la-forest-soft",
    },
    {
      key: "lessons",
      eyebrow: "Lessons",
      value: stats.lessons,
      title: "Across loaded courses",
      accent: "bg-la-ok",
    },
  ];

  const totalPages = coursesData?.meta?.total_pages || 1;
  const hasNext = coursesData?.meta?.has_next_page || false;
  const hasPrev = coursesData?.meta?.has_prev_page || false;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <p className="text-la-forest mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
          Learning workspace
        </p>
        <h1 className="font-display text-la-ink text-4xl font-bold tracking-tight lg:text-5xl">
          Courses
        </h1>
        <p className="text-la-muted mt-2 max-w-prose">
          {canCreate
            ? "Create and manage courses in your workspace."
            : "Browse and oversee courses in your workspace."}
        </p>
      </header>

      {/* Stat strip */}
      <div className="border-la-rule-strong bg-la-rule-strong mb-8 grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="bg-la-paper p-5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-4 h-10 w-14" />
                <Skeleton className="mt-2 h-3 w-20" />
              </div>
            ))
          : statCards.map((stat) => (
              <div key={stat.key} className="bg-la-paper relative p-5">
                <span
                  className={cn("absolute inset-x-0 top-0 h-1", stat.accent)}
                  aria-hidden
                />
                <p className="text-la-muted text-[0.7rem] font-semibold tracking-[0.15em] uppercase">
                  {stat.eyebrow}
                </p>
                <p className="font-display text-la-ink mt-3 text-4xl font-bold tabular-nums">
                  {stat.value}
                </p>
                <p className="text-la-ink-2 mt-1 text-sm font-medium">
                  {stat.title}
                </p>
              </div>
            ))}
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="text-la-muted pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-la-rule-strong bg-la-paper text-la-ink placeholder:text-la-muted focus:ring-la-forest h-9 w-52 rounded-lg border px-8 text-sm outline-none focus:ring-1"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="free">Free</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {canCreate && (
            <Button size="sm" onClick={openCreateCourse}>
              <Plus className="mr-1 h-4 w-4" />
              Create course
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

      {/* Course grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-la-rule-strong bg-la-paper overflow-hidden rounded-lg border"
            >
              <Skeleton className="aspect-[16/9] w-full" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="border-la-rule-strong bg-la-paper flex flex-col items-center justify-center gap-3 rounded-lg border py-16 text-center">
          <div className="bg-la-forest-wash text-la-forest rounded-full p-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-la-ink text-lg font-semibold">
              No courses yet
            </h3>
            <p className="text-la-muted max-w-sm text-sm">
              {canCreate
                ? "Create your first course to start adding modules and lessons for your learners."
                : "Courses created in this organization will appear here."}
            </p>
          </div>
          {canCreate && (
            <Button className="mt-2" onClick={openCreateCourse}>
              <Plus className="mr-1 h-4 w-4" />
              Create your first course
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                orgId={orgId}
                canManage={canCreate}
                onEdit={openEditCourse}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-la-muted text-sm">
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

      {/* Create / edit course — right-side Sheet with grouped sections */}
      <Sheet
        open={courseSheet.open}
        onOpenChange={(v) => !v && closeCourseSheet()}
      >
        <SheetContent
          dismissible={false}
          className="w-full overflow-y-auto sm:max-w-xl"
        >
          <SheetHeader>
            <SheetTitle className="font-display">
              {courseSheet.course ? "Edit course" : "Create course"}
            </SheetTitle>
            <SheetDescription>
              {courseSheet.course
                ? "Update the course details."
                : "Set up a new course in your workspace."}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            {courseSheet.open && (
              <CourseForm
                key={courseSheet.course?.id ?? "new"}
                course={courseSheet.course ?? undefined}
                onSuccess={() => {
                  closeCourseSheet();
                  refetch();
                }}
                onCancel={closeCourseSheet}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialogs */}
      <ViewCourseDialog />
      <DeleteCourseDialog />
    </div>
  );
}
