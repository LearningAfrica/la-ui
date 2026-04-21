import { Link, Outlet, href, useParams } from "react-router";
import { ArrowLeft, LogOut, Moon, Sun, User } from "lucide-react";
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
import { OrganizationGuard } from "@/components/auth/organization-guard";
import { useTheme } from "@/providers/theme-provider";
import { useAuthStore } from "@/stores/auth/auth-hooks";
import { useCourse } from "@/features/courses/course-queries";

function LessonReaderHeader() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course } = useCourse(courseId ?? "");
  const { setTheme, theme } = useTheme();
  const { user, logout, role } = useAuthStore();

  const profileHref =
    role === "super_admin" ? href("/system/profile") : href("/client/profile");

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
        {courseId && (
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link to={`/client/dashboard/courses/${courseId}/preview`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Course</span>
            </Link>
          </Button>
        )}
        <div className="bg-border hidden h-6 w-px sm:block" />
        <Link
          to={href("/client/dashboard/my-courses")}
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
                <AvatarFallback className="bg-linear-to-br from-orange-400 to-amber-500 text-xs text-white">
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
              <Link to={profileHref}>
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
      <OrganizationGuard>
        <div className="bg-background min-h-screen">
          <LessonReaderHeader />
          <Outlet />
        </div>
      </OrganizationGuard>
    </RouteGuard>
  );
}
