import { useMemo } from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import { href, Link, useLocation } from "react-router";
import SidebarUserFooter from "./sidebar-user-footer";
import { useAuthStore } from "@/stores/auth/auth-hooks";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Building2,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  NavItemIcon: LucideIcon;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export default function SystemSidebarItems() {
  const { role } = useAuthStore();
  const location = useLocation();

  const sections = useMemo<NavSection[]>(
    () => [
      {
        label: "Overview",
        items: [
          {
            title: "Dashboard",
            url: href("/system/dashboard"),
            NavItemIcon: LayoutDashboard,
          },
        ],
      },
      {
        label: "Manage",
        items: [
          {
            title: "Inquiries",
            url: href("/system/inquiries"),
            NavItemIcon: MessageSquare,
          },
          {
            title: "Users",
            url: href("/system/users"),
            NavItemIcon: Users,
          },
          {
            title: "Organizations",
            url: href("/system/organizations"),
            NavItemIcon: Building2,
          },
        ],
      },
    ],
    []
  );

  const isActive = (path: string): boolean => {
    if (path === href("/system/dashboard")) {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  if (role !== "super_admin") {
    return null;
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg font-bold">
            LA
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">Learning Africa</span>
            <span className="text-muted-foreground text-xs">System Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {sections.map((section, idx) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
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
            {idx < sections.length - 1 && <SidebarSeparator className="mt-2" />}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarUserFooter />
    </>
  );
}
