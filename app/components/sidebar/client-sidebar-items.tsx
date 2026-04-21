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
  SidebarSeparator,
} from "../ui/sidebar";
import { Badge } from "../ui/badge";
import { OrganizationSelector } from "../dashboard/organization-selector";
import { href, Link, useLocation } from "react-router";
import { useAuthStore } from "@/stores/auth/auth-hooks";
import { useMemo } from "react";
import {
  Home,
  LayoutDashboard,
  UsersIcon,
  BookOpen,
  GraduationCap,
  Award,
  FolderOpen,
  MailOpen,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { useMyInvites } from "@/features/invites/invites-queries";
import type {
  MyOrganization,
  OrganizationMembershipRole,
} from "@/features/organizations/organization-queries";

type RoleCheckType = OrganizationMembershipRole[] | "*";

interface NavItem {
  title: string;
  url: string;
  NavItemIcon: LucideIcon;
  roles: RoleCheckType;
  badgeCount?: number;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export default function ClientSidebarItems() {
  const { role } = useAuthStore();
  const location = useLocation();
  const { selectedOrganization } = useOrganizationStore();
  const { data: invitesData } = useMyInvites();

  // Only counts invites that are still open (not used). Expired ones still
  // show so the user can see the full pending queue until the backend prunes
  // them — keeps the filter pure and the rendered count stable per query.
  const pendingInvitesCount = useMemo(
    () => invitesData?.data?.filter((inv) => !inv.is_used).length ?? 0,
    [invitesData]
  );

  const canSee = (
    org: MyOrganization | null,
    itemRoles: RoleCheckType
  ): boolean => {
    if (itemRoles === "*") return true;

    return !!(org && org.role && itemRoles.includes(org.role));
  };

  const sections = useMemo<NavSection[]>(() => {
    const org = selectedOrganization ?? null;

    const overview: NavItem[] = [
      {
        title: "Organizations",
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
        title: "Invitations",
        url: href("/client/dashboard/invitations"),
        NavItemIcon: MailOpen,
        roles: "*",
        badgeCount: pendingInvitesCount,
      },
    ];

    const workspace: NavItem[] = [
      {
        title: "Members",
        url: href("/client/dashboard/members"),
        NavItemIcon: UsersIcon,
        roles: ["admin"],
      },
      {
        title: "Courses",
        url: href("/client/dashboard/courses"),
        NavItemIcon: BookOpen,
        roles: ["admin", "instructor"],
      },
      {
        title: "Categories",
        url: href("/client/dashboard/categories"),
        NavItemIcon: FolderOpen,
        roles: ["admin", "instructor"],
      },
      {
        title: "Live Sessions",
        url: href("/client/dashboard/live-sessions"),
        NavItemIcon: Video,
        roles: "*",
      },
    ];

    const learning: NavItem[] = [
      {
        title: "My Courses",
        url: href("/client/dashboard/my-courses"),
        NavItemIcon: BookOpen,
        roles: "*",
      },
      {
        title: "My Learning",
        url: href("/client/dashboard/my-learning"),
        NavItemIcon: GraduationCap,
        roles: "*",
      },
      {
        title: "Certificates",
        url: href("/client/dashboard/certificates"),
        NavItemIcon: Award,
        roles: "*",
      },
    ];

    const filter = (items: NavItem[]) =>
      items.filter((item) => canSee(org, item.roles));

    return [
      { label: "Overview", items: filter(overview) },
      { label: "Workspace", items: filter(workspace) },
      { label: "Learning", items: filter(learning) },
    ].filter((section) => section.items.length > 0);
  }, [selectedOrganization, pendingInvitesCount]);

  const isActive = (path: string): boolean => {
    if (path === "/") return location.pathname === "/";

    if (path === href("/client/dashboard")) {
      return location.pathname === path;
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
      <SidebarSeparator />
      <SidebarContent>
        {sections.map((section, idx) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.NavItemIcon;
                  const showBadge = !!item.badgeCount && item.badgeCount > 0;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        tooltip={
                          showBadge
                            ? `${item.title} (${item.badgeCount})`
                            : item.title
                        }
                      >
                        <Link to={item.url}>
                          <Icon />
                          <span>{item.title}</span>
                          {showBadge && (
                            <Badge
                              variant="secondary"
                              className="ml-auto h-5 min-w-5 px-1.5 text-xs group-data-[collapsible=icon]:hidden"
                            >
                              {item.badgeCount}
                            </Badge>
                          )}
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
