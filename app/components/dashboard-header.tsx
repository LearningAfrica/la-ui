import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/providers/theme-provider";
import { useAuthStore } from "@/stores/auth/auth-store";
import { Bell, LogOut, Monitor, Moon, Settings, Sun, User } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  notificationCount?: number;
}

export function DashboardHeader({
  title = "Dashboard",
  notificationCount = 0,
}: DashboardHeaderProps) {
  const { setTheme, theme } = useTheme();
  const { user, logout } = useAuthStore();

  const userName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "User";
  const userEmail = user?.email ?? "";

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="size-4" />;

    if (theme === "dark") return <Moon className="size-4" />;

    return <Monitor className="size-4" />;
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getUserInitials = () => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="bg-border h-6 w-px" />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <Bell className="size-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notificationCount > 0 ? (
              <>
                <DropdownMenuItem className="flex flex-col items-start py-3">
                  <p className="font-medium">New course available</p>
                  <p className="text-muted-foreground text-sm">
                    Advanced React Patterns is now live
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start py-3">
                  <p className="font-medium">Assignment due</p>
                  <p className="text-muted-foreground text-sm">
                    Submit your project by tomorrow
                  </p>
                </DropdownMenuItem>
              </>
            ) : (
              <div className="text-muted-foreground py-6 text-center text-sm">
                No new notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage alt={userName} />
                <AvatarFallback className="bg-linear-to-br from-orange-400 to-amber-500 text-white">
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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
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
