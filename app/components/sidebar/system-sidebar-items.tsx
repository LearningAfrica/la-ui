import React, { useMemo } from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Link } from "react-router";
import SidebarUserFooter from "./sidebar-user-footer";
import { useAuthStore } from "@/stores/auth/auth-store";
import { useLocation } from "react-router";
import { Home, LayoutDashboard, type LucideIcon } from "lucide-react";
import { href } from "react-router";
import type { SystemUserRole } from "@/features/auth/auth-mutations";

type NavItem = {
  title: string;
  url: string;
  NavItemIcon: LucideIcon;
};

type NavSection = {
  navItems: NavItem[];
  dashboardItems?: NavItem[];
};

export default function SystemSidebarItems() {
  const { role } = useAuthStore();
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

  if (role !== "super_admin") {
    return null;
  }

  return (
    <>
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
      <SidebarUserFooter />
    </>
  );
}
