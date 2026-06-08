import { useMemo } from "react";
import { useNavigate } from "react-router";

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
import { useMyInquiries } from "@/features/inquiries/inquiry-queries";
import { useMyOrganizations } from "@/features/organizations/organization-queries";
import { useMyInvites } from "@/features/invites/invites-queries";
import { pendingInviteCount } from "@/features/invites/invite-selectors";
import { orgRoutes, personalRoutes } from "@/lib/utils/org-routes";
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
  const { data: inquiriesData } = useMyInquiries();

  const inviteCount = pendingInviteCount(invitesData?.data);
  const inquiryCount = inquiriesData?.meta?.total_docs ?? 0;
  const showInquiries = isSuperAdmin || inquiryCount > 0;

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Member";

  const orgs = useMemo(() => orgsData ?? [], [orgsData]);

  // Where the sidebar "Organizations" link should go. Auto-select the first
  // (or only) org so users don't get bounced through the picker every time.
  const organizationsTarget = useMemo(() => {
    if (orgs.length === 0) return personalRoutes.orgs();

    return orgRoutes.overview(orgs[0].id);
  }, [orgs]);

  const sidebarGroups = useMemo<NavGroup[]>(() => {
    const personalItems = [
      {
        id: "home",
        label: "Home",
        to: "/dashboard",
        icon: <NAV_ICON.home className="size-4" />,
      },
      {
        id: "invitations",
        label: "My invitations",
        to: "/dashboard/invitations",
        icon: <NAV_ICON.invitations className="size-4" />,
        badge: inviteCount > 0 ? inviteCount : undefined,
        badgeTone: "warn" as const,
      },
    ];

    if (showInquiries) {
      personalItems.push({
        id: "inquiries",
        label: "My inquiries",
        to: "/dashboard/inquiries",
        icon: <NAV_ICON.inbox className="size-4" />,
      });
    }

    const personal: NavGroup = { id: "personal", items: personalItems };

    const orgsGroup: NavGroup = {
      id: "orgs",
      label: "Organizations",
      items: [
        {
          id: "organizations",
          label: "Organizations",
          to: organizationsTarget,
          icon: <NAV_ICON.myOrgs className="size-4" />,
          badge: orgs.length > 0 ? orgs.length : undefined,
        },
      ],
    };

    return [personal, orgsGroup];
  }, [inviteCount, showInquiries, organizationsTarget, orgs.length]);

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
      topbar={({ onMenuClick, onSearchClick }) => (
        <DashTopbar
          title="Personal"
          subtitle="Your invitations, inquiries, and organizations."
          onMenuClick={onMenuClick}
          onSearchClick={onSearchClick}
          rightSlot={
            <UserMenu
              initials={initialsFor(fullName, user?.email)}
              name={fullName}
              email={user?.email ?? ""}
              profileTo="/dashboard/profile"
              onSignOut={handleSignOut}
              contextOptions={contextOptions}
              contextGroups={contextGroups}
              viewAllOrgsTo={personalRoutes.orgs()}
            />
          }
        />
      )}
    />
  );
}
