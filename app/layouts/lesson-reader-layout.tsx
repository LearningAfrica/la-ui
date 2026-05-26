import { Link, Outlet, useParams } from "react-router";
import ArrowLeft from "~icons/lucide/arrow-left";
import LogOut from "~icons/lucide/log-out";
import Moon from "~icons/lucide/moon";
import Sun from "~icons/lucide/sun";
import User from "~icons/lucide/user";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RouteGuard } from "@/components/auth/route-guard";
import { useTheme } from "@/providers/theme-provider";
import { useAuthStore } from "@/stores/auth/auth-hooks";
import { useCourse } from "@/features/courses/course-queries";
import { orgRoutes, personalRoutes } from "@/lib/utils/org-routes";

function LessonReaderHeader() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const { data: course } = useCourse(courseId ?? "");
  const { setTheme, theme } = useTheme();
  const { user, logout, role } = useAuthStore();

  const profileHref =
    role === "super_admin" ? "/system/profile" : personalRoutes.profile();

  const userName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "User";
  const userEmail = user?.email ?? "";

  const getUserInitials = () =>
    userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="bg-background/80 sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {courseId && orgId && (
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link
              prefetch="intent"
              to={orgRoutes.coursePreview(orgId, courseId)}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Course</span>
            </Link>
          </Button>
        )}
        <div className="bg-border hidden h-6 w-px sm:block" />
        <Link
          prefetch="intent"
          to={orgId ? orgRoutes.myCourses(orgId) : personalRoutes.home()}
          className="text-primary hover:text-primary/80 hidden shrink-0 text-sm font-bold transition-colors sm:block"
        >
          Learning Africa
        </Link>
        {course?.title && (
          <>
            <div className="bg-border hidden h-6 w-px md:block" />
            <p className="text-muted-foreground hidden truncate text-sm font-medium md:block">
              {course.title}
            </p>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Moon className="size-4" />
          ) : (
            <Sun className="size-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage alt={userName} />
                <AvatarFallback className="bg-la-forest text-la-paper text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">{userName}</p>
                <p className="text-muted-foreground text-xs leading-none">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link prefetch="intent" to={profileHref}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function LessonReaderLayout() {
  return (
    <RouteGuard allowedRoles={["user"]} requireVerified>
      <div className="bg-background min-h-screen">
        <LessonReaderHeader />
        <Outlet />
      </div>
    </RouteGuard>
  );
}
