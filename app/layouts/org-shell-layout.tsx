import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { RouteGuard } from "@/components/auth/route-guard";
import {
  ContextSwitcher,
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
  const { data: orgsData } = useMyOrganizations();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ orgId: string }>();
  const urlOrgId = params.orgId;

  const isSuperAdmin = systemRole === "super_admin";
  const orgs = useMemo(() => orgsData ?? [], [orgsData]);

  // URL is the source of truth — sync the orgId from the URL into Redux
  // whenever it changes (so existing components reading the store stay valid).
  const activeOrg = useMemo(
    () => orgs.find((o) => o.id === urlOrgId) ?? null,
    [orgs, urlOrgId]
  );

  useEffect(() => {
    if (activeOrg && selectedOrganization?.id !== activeOrg.id) {
      setSelectedOrganization(activeOrg);
    }
  }, [activeOrg, selectedOrganization?.id, setSelectedOrganization]);

  // If we have orgs loaded and the URL's orgId isn't one of them, bounce home.
  useEffect(() => {
    if (urlOrgId && orgs.length > 0 && !activeOrg) {
      navigate(personalRoutes.orgs(), { replace: true });
    }
  }, [urlOrgId, orgs.length, activeOrg, navigate]);

  const orgRole = activeOrg?.role;
  const inviteCount =
    invitesData?.data?.filter((inv) => !inv.is_used).length ?? 0;

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Member";

  const pageTitle = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";

    // Org dashboard root looks like /dashboard/org/:orgId — last segment is the id.
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

    const overview: NavGroup = {
      id: "overview",
      label: "Workspace",
      items: [
        item({
          id: "overview",
          label: "Overview",
          to: orgRoutes.overview(urlOrgId),
          icon: <NAV_ICON.home className="size-4" />,
        }),
        item({
          id: "invitations",
          label: "Invitations",
          to: orgRoutes.invitations(urlOrgId),
          icon: <NAV_ICON.invitations className="size-4" />,
          badge: inviteCount > 0 ? inviteCount : undefined,
          badgeTone: "warn",
        }),
      ],
    };

    const adminItems: NavItem[] = [];

    if (canSee(orgRole, ["admin"])) {
      adminItems.push(
        item({
          id: "members",
          label: "Members",
          to: orgRoutes.members(urlOrgId),
          icon: <NAV_ICON.members className="size-4" />,
        })
      );
    }

    if (canSee(orgRole, ["admin", "instructor"])) {
      adminItems.push(
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

    adminItems.push(
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
      items: adminItems,
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

    const groups: NavGroup[] = [overview, manage, learning];

    if (isSuperAdmin) {
      groups.push({
        id: "platform",
        label: "Platform admin",
        accent: true,
        items: [
          item({
            id: "platform-dashboard",
            label: "Super admin dashboard",
            to: "/system/dashboard",
            icon: <NAV_ICON.platform className="size-4" />,
          }),
        ],
      });
    }

    return groups;
  }, [urlOrgId, orgRole, isSuperAdmin, inviteCount]);

  const contextOptions = useMemo<ContextOption[]>(() => {
    const options: ContextOption[] = [
      {
        id: "personal",
        kind: "personal",
        label: "Personal",
        hint: "Invitations, inquiries, your orgs",
        to: personalRoutes.home(),
        initials: initialsFor(fullName),
        onSelect: () => {
          setSelectedOrganization(null);
          navigate(personalRoutes.home());
        },
      },
    ];

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
  }, [fullName, orgs, isSuperAdmin, setSelectedOrganization, navigate]);

  const currentContext =
    contextOptions.find((o) => o.id === `org-${urlOrgId ?? ""}`) ??
    contextOptions[0];

  const handleSignOut = () => {
    logout();
    navigate("/sign-in");
  };

  const sidebar = (
    <DashSidebar
      groups={sidebarGroups}
      header={
        <ContextSwitcher
          current={currentContext}
          options={contextOptions}
          groups={[
            { label: "You", ids: ["personal"] },
            {
              label: "Organizations",
              ids: contextOptions
                .filter((o) => o.kind === "org")
                .map((o) => o.id),
            },
            ...(isSuperAdmin ? [{ label: "Platform", ids: ["platform"] }] : []),
          ]}
        />
      }
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
      topbar={({ onMenuClick }) => (
        <DashTopbar
          title={pageTitle}
          subtitle={activeOrg?.name}
          crumbs={[{ label: "Workspace" }, { label: activeOrg?.name ?? "" }]}
          onMenuClick={onMenuClick}
          rightSlot={
            <UserMenu
              initials={initialsFor(fullName)}
              name={fullName}
              email={user?.email ?? ""}
              profileTo={personalRoutes.profile()}
              onSignOut={handleSignOut}
            />
          }
        />
      )}
    />
  );
}
