import { useMemo } from "react";
import { useNavigate } from "react-router";

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
import type { ContextOption, NavGroup } from "@/components/dashboard-shell";
import { useMyOrganizations } from "@/features/organizations/organization-queries";
import { useMyInvites } from "@/features/invites/invites-queries";
import { orgRoutes } from "@/lib/utils/org-routes";
import { useAuthStore } from "@/stores/auth/auth-hooks";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";

const initialsFor = (name?: string | null, email?: string | null) => {
  const source = name?.trim() || email?.trim() || "";

  if (!source) return "LA";

  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
};

export default function DashboardShellLayout() {
  return (
    <RouteGuard requireVerified>
      <DashboardShellInner />
    </RouteGuard>
  );
}

function DashboardShellInner() {
  const { user, role, logout } = useAuthStore();
  const { setSelectedOrganization } = useOrganizationStore();
  const navigate = useNavigate();

  const isSuperAdmin = role === "super_admin";

  const { data: invitesData } = useMyInvites();
  const { data: orgsData } = useMyOrganizations();

  const inviteCount = invitesData?.data?.length ?? 0;

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Member";

  const orgs = useMemo(() => orgsData ?? [], [orgsData]);

  const sidebarGroups = useMemo<NavGroup[]>(() => {
    const personal: NavGroup = {
      id: "personal",
      label: "Personal",
      items: [
        {
          id: "home",
          label: "Home",
          to: "/dashboard",
          icon: <NAV_ICON.home className="size-4" />,
        },
        {
          id: "invitations",
          label: "Invitations",
          to: "/dashboard/invitations",
          icon: <NAV_ICON.invitations className="size-4" />,
          badge: inviteCount > 0 ? inviteCount : undefined,
          badgeTone: "warn",
        },
        {
          id: "inquiries",
          label: "Inquiries",
          to: "/dashboard/inquiries",
          icon: <NAV_ICON.inbox className="size-4" />,
        },
      ],
    };

    const orgsGroup: NavGroup = {
      id: "orgs",
      label: "Organizations",
      items: [
        {
          id: "my-orgs",
          label: "My organizations",
          to: "/dashboard/orgs",
          icon: <NAV_ICON.myOrgs className="size-4" />,
          badge: orgs.length > 0 ? orgs.length : undefined,
        },
        {
          id: "browse",
          label: "Browse public courses",
          to: "/dashboard/browse",
          icon: <NAV_ICON.browse className="size-4" />,
        },
      ],
    };

    const groups: NavGroup[] = [personal, orgsGroup];

    if (isSuperAdmin) {
      groups.push({
        id: "platform",
        label: "Platform admin",
        accent: true,
        items: [
          {
            id: "platform-dashboard",
            label: "Super admin dashboard",
            to: "/system/dashboard",
            icon: <NAV_ICON.platform className="size-4" />,
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
      });
    }

    return groups;
  }, [inviteCount, orgs.length, isSuperAdmin]);

  const contextOptions = useMemo<ContextOption[]>(() => {
    const options: ContextOption[] = [
      {
        id: "personal",
        kind: "personal",
        label: "Personal",
        hint: "Invitations, inquiries, your orgs",
        to: "/dashboard",
        initials: initialsFor(fullName, user?.email),
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
  }, [
    fullName,
    user?.email,
    orgs,
    isSuperAdmin,
    setSelectedOrganization,
    navigate,
  ]);

  const currentContext = contextOptions[0];

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
          initials={initialsFor(fullName, user?.email)}
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
          title="Personal"
          subtitle="Your invitations, inquiries, and organizations."
          onMenuClick={onMenuClick}
          rightSlot={
            <UserMenu
              initials={initialsFor(fullName, user?.email)}
              name={fullName}
              email={user?.email ?? ""}
              profileTo="/dashboard/profile"
              onSignOut={handleSignOut}
            />
          }
        />
      )}
    />
  );
}
