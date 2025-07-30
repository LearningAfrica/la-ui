import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LifeBuoy,
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { useAuth } from "@/hooks/use-auth";
import { DASHBOARD_SIDEBAR_NAV_LINKS } from "@/lib/data/sidebar-nav-links";
import type { Organization } from "@/lib/types/organization";
import type { UserRole } from "@/lib/types/auth";

interface DashboardSidebarNewProps {
  className?: string;
}

export function DashboardSidebarNew({ className }: DashboardSidebarNewProps) {
  const [expanded, setExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const userRole = user?.role || "student";
  const filteredNavItems = DASHBOARD_SIDEBAR_NAV_LINKS.filter((item) =>
    item.roles.includes(userRole as UserRole)
  );

  const userInitial = user?.username?.charAt(0) || "U";

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const NavItem = ({ item }: { item: typeof DASHBOARD_SIDEBAR_NAV_LINKS[0] }) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            to={item.href}
            className={cn(
              "flex h-10 items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              isActive && "bg-muted text-foreground font-medium",
              !expanded && "justify-center px-2"
            )}
          >
            <item.icon className={cn("h-5 w-5", expanded ? "mr-0" : "mr-0")} />
            {expanded && <span>{item.label}</span>}
          </Link>
        </TooltipTrigger>
        {!expanded && (
          <TooltipContent side="right">
            {item.label}
          </TooltipContent>
        )}
      </Tooltip>
    );
  };

  const Sidebar = (
    <div className={cn("flex flex-col h-full", expanded ? "w-64" : "w-16")}>
      <div className="flex h-16 items-center px-4 border-b">
        {expanded ? (
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold">Learning Africa</span>
          </Link>
        ) : (
          <Link to="/" className="mx-auto">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <GraduationCap className="h-4 w-4" />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        {expanded && (
          <div className="px-3 mb-6">
            <OrganizationSwitcher />
          </div>
        )}

        <TooltipProvider>
          <nav className="px-3 space-y-1">
            {filteredNavItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </nav>
        </TooltipProvider>
      </div>

      <div className="mt-auto p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn(
              "flex items-center gap-3 h-auto w-full px-3 py-2",
              !expanded && "justify-center px-2"
            )}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt={user?.username} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              {expanded && (
                <div className="flex flex-1 flex-col text-left text-sm">
                  <span className="font-medium">{user?.username}</span>
                  <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">{user?.username}</p>
                <p className="text-muted-foreground text-xs leading-none">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/help">
                <LifeBuoy className="mr-2 h-4 w-4" />
                Help & Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="h-full flex flex-col">
            <div className="flex h-16 items-center gap-2 px-4 border-b">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="text-xl font-bold">Learning Africa</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="px-3 py-4">
                <OrganizationSwitcher />
              </div>
              <Separator />
              <nav className="px-3 py-4 space-y-1">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-lg px-3 text-muted-foreground hover:bg-muted hover:text-foreground",
                      pathname === item.href && "bg-muted text-foreground font-medium"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt={user?.username} />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                  <span className="font-medium">{user?.username}</span>
                  <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <aside className={cn("hidden md:flex h-screen sticky top-0 border-r", className)}>
        {Sidebar}
      </aside>
    </>
  );
}
