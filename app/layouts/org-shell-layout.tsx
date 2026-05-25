import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { RouteGuard } from "@/components/auth/route-guard";
import {
  DashSidebar,
  DashTopbar,
  DashboardShell,
  NAV_ICON,
  SidebarUserCard,
  UserMenu,
} from "@/components/dashboard-shell";
import type {
  ContextOption,
  NavGroup,
  NavItem,
} from "@/components/dashboard-shell";
import { useMyInquiries } from "@/features/inquiries/inquiry-queries";
import { useMyInvites } from "@/features/invites/invites-queries";
import {
  useMyOrganizations,
  type OrganizationMembershipRole,
} from "@/features/organizations/organization-queries";
import { useAuthStore } from "@/stores/auth/auth-hooks";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { orgRoutes, personalRoutes } from "@/lib/utils/org-routes";

const initialsFor = (source?: string | null) => {
  const s = source?.trim() || "";

  if (!s) return "LA";

  const parts = s.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();

  return s.slice(0, 2).toUpperCase();
};

type RoleSet = OrganizationMembershipRole[] | "*";

const canSee = (role: OrganizationMembershipRole | undefined, set: RoleSet) =>
  set === "*" ? true : role != null && set.includes(role);

export default function OrgShellLayout() {
  return (
    <RouteGuard allowedRoles={["user"]} requireVerified>
      <OrgShellInner />
    </RouteGuard>
  );
}

function OrgShellInner() {
  const { user, role: systemRole, logout } = useAuthStore();
  const { selectedOrganization, setSelectedOrganization } =
    useOrganizationStore();
  const { data: invitesData } = useMyInvites();
  const { data: inquiriesData } = useMyInquiries();
  const { data: orgsData } = useMyOrganizations();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ orgId: string }>();
  const urlOrgId = params.orgId;

  const isSuperAdmin = systemRole === "super_admin";
  const orgs = useMemo(() => orgsData ?? [], [orgsData]);

  const activeOrg = useMemo(
    () => orgs.find((o) => o.id === urlOrgId) ?? null,
    [orgs, urlOrgId]
  );

  useEffect(() => {
    if (activeOrg && selectedOrganization?.id !== activeOrg.id) {
      setSelectedOrganization(activeOrg);
    }
  }, [activeOrg, selectedOrganization?.id, setSelectedOrganization]);

  useEffect(() => {
    if (urlOrgId && orgs.length > 0 && !activeOrg) {
      navigate(personalRoutes.orgs(), { replace: true });
    }
  }, [urlOrgId, orgs.length, activeOrg, navigate]);

  const orgRole = activeOrg?.role;
  const personalInviteCount =
    invitesData?.data?.filter((inv) => !inv.is_used).length ?? 0;
  const inquiryCount = inquiriesData?.meta?.total_docs ?? 0;
  const showInquiries = isSuperAdmin || inquiryCount > 0;

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Member";

  const pageTitle = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";

    if (last === urlOrgId) return "Overview";

    const titles: Record<string, string> = {
      members: "Members",
      courses: "Courses",
      categories: "Categories",
      "live-sessions": "Live sessions",
      "my-courses": "My courses",
      "my-learning": "My learning",
      certificates: "Certificates",
      invitations: "Invitations",
      new: "New course",
      edit: "Edit course",
      preview: "Course preview",
      modules: "Modules",
    };

    return titles[last] ?? "Workspace";
  }, [location.pathname, urlOrgId]);

  const sidebarGroups = useMemo<NavGroup[]>(() => {
    if (!urlOrgId) return [];

    const item = (
      i: Omit<NavItem, "icon"> & { icon: React.ReactNode }
    ): NavItem => i;

    // Personal items always sit at the top — Home is the implicit "exit".
    const personalItems: NavItem[] = [
      item({
        id: "home",
        label: "Home",
        to: "/dashboard",
        icon: <NAV_ICON.home className="size-4" />,
      }),
      item({
        id: "personal-invitations",
        label: "My invitations",
        to: "/dashboard/invitations",
        icon: <NAV_ICON.invitations className="size-4" />,
        badge: personalInviteCount > 0 ? personalInviteCount : undefined,
        badgeTone: "warn",
      }),
    ];

    if (showInquiries) {
      personalItems.push(
        item({
          id: "personal-inquiries",
          label: "My inquiries",
          to: "/dashboard/inquiries",
          icon: <NAV_ICON.inbox className="size-4" />,
        })
      );
    }

    const personal: NavGroup = { id: "personal", items: personalItems };

    const workspace: NavGroup = {
      id: "workspace",
      label: "Workspace",
      items: [
        item({
          id: "overview",
          label: "Overview",
          to: orgRoutes.overview(urlOrgId),
          icon: <NAV_ICON.home className="size-4" />,
        }),
        item({
          id: "org-invitations",
          label: "Member invitations",
          to: orgRoutes.invitations(urlOrgId),
          icon: <NAV_ICON.invitations className="size-4" />,
        }),
      ],
    };

    const manageItems: NavItem[] = [];

    if (canSee(orgRole, ["admin"])) {
      manageItems.push(
        item({
          id: "members",
          label: "Members",
          to: orgRoutes.members(urlOrgId),
          icon: <NAV_ICON.members className="size-4" />,
        })
      );
    }

    if (canSee(orgRole, ["admin", "instructor"])) {
      manageItems.push(
        item({
          id: "courses",
          label: "Courses",
          to: orgRoutes.courses(urlOrgId),
          icon: <NAV_ICON.courses className="size-4" />,
          end: false,
        }),
        item({
          id: "categories",
          label: "Categories",
          to: orgRoutes.categories(urlOrgId),
          icon: <NAV_ICON.categories className="size-4" />,
        })
      );
    }

    manageItems.push(
      item({
        id: "live-sessions",
        label: "Live sessions",
        to: orgRoutes.liveSessions(urlOrgId),
        icon: <NAV_ICON.liveSessions className="size-4" />,
      })
    );

    const manage: NavGroup = {
      id: "manage",
      label: "Manage",
      items: manageItems,
    };

    const learning: NavGroup = {
      id: "learning",
      label: "Learning",
      items: [
        item({
          id: "my-courses",
          label: "My courses",
          to: orgRoutes.myCourses(urlOrgId),
          icon: <NAV_ICON.myCourses className="size-4" />,
        }),
        item({
          id: "my-learning",
          label: "My learning",
          to: orgRoutes.myLearning(urlOrgId),
          icon: <NAV_ICON.browse className="size-4" />,
        }),
        item({
          id: "certificates",
          label: "Certificates",
          to: orgRoutes.certificates(urlOrgId),
          icon: <NAV_ICON.certificates className="size-4" />,
        }),
      ],
    };

    return [personal, workspace, manage, learning];
  }, [urlOrgId, orgRole, personalInviteCount, showInquiries]);

  const contextOptions = useMemo<ContextOption[]>(() => {
    const options: ContextOption[] = [];

    orgs.forEach((org) => {
      options.push({
        id: `org-${org.id}`,
        kind: "org",
        label: org.name,
        hint: org.role,
        to: orgRoutes.overview(org.id),
        initials: initialsFor(org.name),
        onSelect: () => {
          setSelectedOrganization(org);
          navigate(orgRoutes.overview(org.id));
        },
      });
    });

    if (isSuperAdmin) {
      options.push({
        id: "platform",
        kind: "platform",
        label: "Platform admin",
        hint: "System-wide control",
        to: "/system/dashboard",
        initials: "PL",
      });
    }

    return options;
  }, [orgs, isSuperAdmin, setSelectedOrganization, navigate]);

  const currentContextId = `org-${urlOrgId ?? ""}`;

  const contextGroups = useMemo(
    () => [
      {
        label: "Organizations",
        ids: contextOptions.filter((o) => o.kind === "org").map((o) => o.id),
      },
      ...(isSuperAdmin ? [{ label: "Platform", ids: ["platform"] }] : []),
    ],
    [contextOptions, isSuperAdmin]
  );

  const handleSignOut = () => {
    logout();
    navigate("/sign-in");
  };

  const sidebar = (
    <DashSidebar
      groups={sidebarGroups}
      footer={
        <SidebarUserCard
          initials={initialsFor(fullName)}
          name={fullName}
          email={user?.email ?? ""}
          onSignOut={handleSignOut}
        />
      }
    />
  );

  return (
    <DashboardShell
      sidebar={sidebar}
      topbar={({ onMenuClick, onSearchClick }) => (
        <DashTopbar
          title={activeOrg?.name ?? selectedOrganization?.name ?? "Workspace"}
          subtitle={pageTitle}
          onMenuClick={onMenuClick}
          onSearchClick={onSearchClick}
          rightSlot={
            <UserMenu
              initials={initialsFor(fullName)}
              name={fullName}
              email={user?.email ?? ""}
              profileTo={personalRoutes.profile()}
              onSignOut={handleSignOut}
              contextOptions={contextOptions}
              currentContextId={currentContextId}
              contextGroups={contextGroups}
              viewAllOrgsTo={personalRoutes.orgs()}
            />
          }
        />
      )}
    />
  );
}
