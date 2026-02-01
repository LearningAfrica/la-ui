import SidebarUserFooter from "./sidebar-user-footer";
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
import { OrganizationSelector } from "../dashboard/organization-selector";
import { href, Link, useLocation } from "react-router";
import { useAuthStore } from "@/stores/auth/auth-store";
import { useMemo } from "react";
import {
  ActivityIcon,
  BarChart3Icon,
  Home,
  LayoutDashboard,
  TvMinimalIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { useOrganizationStore } from "@/stores/organization/organization-store";
import type {
  MyOrganization,
  OrganizationMembershipRole,
} from "@/features/organizations/organization-queries";

type RoleCheckType = OrganizationMembershipRole[] | "*";
type NavItem = {
  title: string;
  url: string;
  NavItemIcon: LucideIcon;
  roles: RoleCheckType;
};

type NavSection = {
  navItems: NavItem[];
  dashboardItems?: NavItem[];
  moreInfoItems?: NavItem[];
};

export default function ClientSidebarItems() {
  const { role } = useAuthStore();
  const location = useLocation();
  const { selectedOrganization } = useOrganizationStore();
  const filterUserRole = (
    org?: MyOrganization,
    itemRoles: RoleCheckType = []
  ) => {
    if (itemRoles === "*") {
      return true;
    }

    return org && org.role && itemRoles.includes(org.role);
  };
  const {
    navItems,
    dashboardItems = [],
    moreInfoItems = [],
  } = useMemo(() => {
    const baseNavItems: NavItem[] = [
      {
        title: "Home",
        url: href("/dashboard"),
        NavItemIcon: Home,
        roles: "*",
      },
      {
        title: "Dashboard",
        url: href("/client/dashboard"),
        NavItemIcon: LayoutDashboard,
        roles: "*",
      },
      {
        title: "Members",
        url: href("/client/dashboard/members"),
        NavItemIcon: UsersIcon,
        roles: ["admin"],
      },
    ];
    const baseDashboardItems: NavItem[] = [
      {
        title: "Analytics",
        url: href("/client/dashboard"),
        NavItemIcon: BarChart3Icon,
        roles: ["admin"],
      },
      {
        title: "Users",
        url: href("/client/dashboard"),
        NavItemIcon: UsersIcon,
        roles: ["admin"],
      },
      {
        title: "Activity",
        url: href("/client/dashboard"),
        NavItemIcon: ActivityIcon,
        roles: ["admin"],
      },
      {
        title: "Live sessions",
        url: href("/client/dashboard"),
        NavItemIcon: TvMinimalIcon,
        roles: ["instructor", "learner"],
      },
    ];
    const baseMoreInfoItems: NavItem[] = [];
    const navs: NavSection = {
      navItems: baseNavItems.filter((item) =>
        filterUserRole(selectedOrganization!, item.roles)
      ),
      dashboardItems: baseDashboardItems.filter((item) =>
        filterUserRole(selectedOrganization!, item.roles)
      ),
      moreInfoItems: baseMoreInfoItems.filter((item) =>
        filterUserRole(selectedOrganization!, item.roles)
      ),
    };

    return navs;
  }, [selectedOrganization]);
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  if (role !== "user") {
    return null;
  }

  return (
    <>
      <SidebarHeader>
        <OrganizationSelector />
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

        {dashboardItems.length > 0 && (
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
        {moreInfoItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>More Info</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {moreInfoItems.map((item) => {
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
