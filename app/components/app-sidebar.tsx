import { Link, useLocation } from "react-router";
import {
  Home,
  LayoutDashboard,
  Settings,
  User,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth/auth-store";
import type { SystemUserRole } from "@/features/auth/auth-mutations";
import { useMemo } from "react";
import { href } from "react-router";

type NavItem = {
  title: string;
  url: string;
  NavItemIcon: LucideIcon;
};

type NavSection = {
  navItems: NavItem[];
  dashboardItems?: NavItem[];
};

export function AppSidebar() {
  // const user = useCurrentUser();
  const { user, role } = useAuthStore();
  const location = useLocation();

  const { navItems, dashboardItems = [] } = useMemo(() => {
    const navs: Record<SystemUserRole, NavSection> = {
      super_admin: {
        navItems: [
          {
            title: "Dashboard",
            url: href("/system/dashboard"),
            NavItemIcon: Home,
          },
          {
            title: "Inquiries",
            url: href("/system/inquiries"),
            NavItemIcon: LayoutDashboard,
          },
          // {
          //   title: "Features",
          //   url: "/features",
          //   NavItemIcon: Sparkles,
          // },
          // {
          //   title: "Contact",
          //   url: "/contact",
          //   NavItemIcon: Mail,
          // },
        ],
        dashboardItems: [
          // {
          //   title: "Analytics",
          //   url: "/dashboard",
          //   NavItemIcon: BarChart3,
          // },
          // {
          //   title: "Users",
          //   url: "/dashboard",
          //   NavItemIcon: Users,
          // },
          // {
          //   title: "Activity",
          //   url: "/dashboard",
          //   NavItemIcon: Activity,
          // },
        ],
      },
      user: {
        navItems: [],
      },
    };

    if (role && navs[role]) {
      return navs[role];
    }

    return { navItems: [], dashboardItems: [] };
  }, [role]);
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg font-bold">
            LA
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">Learning Africa</span>
            <span className="text-muted-foreground text-xs">
              Empowering Learning
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.NavItemIcon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {location.pathname.includes("/dashboard") &&
          dashboardItems.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {dashboardItems.map((item) => {
                    const Icon = item.NavItemIcon;

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title}>
                          <Link to={item.url}>
                            <Icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <User className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="text-sidebar-foreground/70 truncate text-xs">
                  {user?.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link to="/dashboard">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <button type="button">
                <LogOut />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
