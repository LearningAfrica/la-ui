import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

import { RouteGuard } from "@/components/auth/route-guard";
import {
  DashSidebar,
  DashTopbar,
  DashboardShell,
  NAV_ICON,
  SidebarUserCard,
  UserMenu,
} from "@/components/dashboard-shell";
import type { ContextOption, NavGroup } from "@/components/dashboard-shell";
import { useMyOrganizations } from "@/features/organizations/organization-queries";
import { orgRoutes, personalRoutes } from "@/lib/utils/org-routes";
import { useAuthStore } from "@/stores/auth/auth-hooks";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";

const initialsFor = (source?: string | null) => {
  const s = source?.trim() || "";

  if (!s) return "LA";

  const parts = s.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();

  return s.slice(0, 2).toUpperCase();
};

export default function PlatformShellLayout() {
  return (
    <RouteGuard allowedRoles={["super_admin"]} requireVerified>
      <PlatformShellInner />
    </RouteGuard>
  );
}

function PlatformShellInner() {
  const { user, logout } = useAuthStore();
  const { setSelectedOrganization } = useOrganizationStore();
  const { data: orgsData } = useMyOrganizations();
  const navigate = useNavigate();
  const location = useLocation();

  const orgs = useMemo(() => orgsData ?? [], [orgsData]);

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Member";

  const pageTitle = useMemo(() => {
    const last = location.pathname.split("/").filter(Boolean).pop() ?? "";
    const titles: Record<string, string> = {
      dashboard: "Platform overview",
      inquiries: "Inquiries",
      users: "Platform users",
      organizations: "All organizations",
      profile: "Profile",
    };

    return titles[last] ?? "Platform";
  }, [location.pathname]);

  const sidebarGroups = useMemo<NavGroup[]>(
    () => [
      {
        id: "platform",
        label: "Platform admin",
        accent: true,
        items: [
          {
            id: "platform-dashboard",
            label: "Overview",
            to: "/system/dashboard",
            icon: <NAV_ICON.platform className="size-4" />,
          },
          {
            id: "platform-inquiries",
            label: "Platform inquiries",
            to: "/system/inquiries",
            icon: <NAV_ICON.inbox className="size-4" />,
          },
          {
            id: "platform-orgs",
            label: "All organizations",
            to: "/system/organizations",
            icon: <NAV_ICON.platformOrgs className="size-4" />,
          },
          {
            id: "platform-users",
            label: "Platform users",
            to: "/system/users",
            icon: <NAV_ICON.platformUsers className="size-4" />,
          },
        ],
      },
    ],
    []
  );

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

    options.push({
      id: "platform",
      kind: "platform",
      label: "Platform admin",
      hint: "System-wide control",
      to: "/system/dashboard",
      initials: "PL",
    });

    return options;
  }, [orgs, navigate, setSelectedOrganization]);

  const contextGroups = useMemo(
    () => [
      {
        label: "Organizations",
        ids: contextOptions.filter((o) => o.kind === "org").map((o) => o.id),
      },
      { label: "Platform", ids: ["platform"] },
    ],
    [contextOptions]
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
          avatarTone="amber"
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
          subtitle="Platform administration"
          crumbs={[{ label: "Platform" }]}
          onMenuClick={onMenuClick}
          rightSlot={
            <UserMenu
              initials={initialsFor(fullName)}
              name={fullName}
              email={user?.email ?? ""}
              profileTo="/system/profile"
              avatarTone="amber"
              onSignOut={handleSignOut}
              contextOptions={contextOptions}
              currentContextId="platform"
              contextGroups={contextGroups}
              viewAllOrgsTo={personalRoutes.orgs()}
            />
          }
        />
      )}
    />
  );
}
