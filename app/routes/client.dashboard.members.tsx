import {
  useMyOrganizationMembers,
  useOrganizationInvites,
} from "@/features/organizations/organization-queries";
import { useOrganizationStore } from "@/stores/organization/organization-store";
import { useMembersFilterStore } from "@/stores/members/members-filter-store";
import { useInvitesFilterStore } from "@/stores/invites/invites-filter-store";
import { MemberStatsCards } from "@/components/dashboard/member-stats-cards";
import { MembersTable } from "@/components/dashboard/members-table";
import { InviteMemberDialog } from "@/components/dashboard/invite-member-dialog";
import { OrganizationInvitesTable } from "@/components/dashboard/organization-invites-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";

export default function ClientDashboardMembers() {
  const { selectedOrganization } = useOrganizationStore();
  const { page, page_size, role, is_active, search } = useMembersFilterStore();
  const {
    page: invitesPage,
    page_size: invitesPageSize,
    role: invitesRole,
    status: invitesStatus,
    search: invitesSearch,
  } = useInvitesFilterStore();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("members");

  const {
    data: membersData,
    isLoading,
    error,
    refetch,
  } = useMyOrganizationMembers({
    organizationId: selectedOrganization?.id || "",
    filters: {
      page,
      page_size,
      role,
      is_active,
      search,
    },
  });

  const {
    data: invitesData,
    isLoading: invitesLoading,
    error: invitesError,
    refetch: refetchInvites,
  } = useOrganizationInvites({
    organizationId: selectedOrganization?.id || "",
    filters: {
      page: invitesPage,
      page_size: invitesPageSize,
      role: invitesRole,
      status: invitesStatus,
      search: invitesSearch,
    },
  });

  const members = useMemo(() => membersData?.data || [], [membersData]);
  const meta = membersData?.meta || {
    total_docs: 0,
    total_pages: 0,
    page: 1,
    limit: 10,
    has_next_page: false,
    has_prev_page: false,
    next_page: null,
    prev_page: null,
  };

  const invites = useMemo(() => invitesData?.data || [], [invitesData]);
  const invitesMeta = invitesData?.meta || {
    total_docs: 0,
    total_pages: 0,
    page: 1,
    limit: 10,
    has_next_page: false,
    has_prev_page: false,
    next_page: null,
    prev_page: null,
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Members & Invites</h1>
        <p className="text-muted-foreground">
          Manage organization members and pending invitations
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invites">
            Invites
            {invitesMeta.total_docs > 0 && (
              <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                {invitesMeta.total_docs}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          {/* Stats Cards */}
          <MemberStatsCards members={members} totalMembers={meta.total_docs} />

          {/* Members Table */}
          <MembersTable
            members={members}
            totalPages={meta.total_pages}
            currentPage={meta.page}
            totalDocs={meta.total_docs}
            isLoading={isLoading}
            error={error}
            onRefresh={() => refetch()}
            onInvite={() => setInviteDialogOpen(true)}
            organizationId={selectedOrganization?.id || ""}
          />
        </TabsContent>

        <TabsContent value="invites" className="space-y-6">
          <OrganizationInvitesTable
            invites={invites}
            totalPages={invitesMeta.total_pages}
            currentPage={invitesMeta.page}
            totalDocs={invitesMeta.total_docs}
            isLoading={invitesLoading}
            error={invitesError}
            onRefresh={() => refetchInvites()}
            onInvite={() => setInviteDialogOpen(true)}
          />
        </TabsContent>
      </Tabs>

      {/* Invite Members Dialog */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        organizationId={selectedOrganization?.id || ""}
      />
    </div>
  );
}
