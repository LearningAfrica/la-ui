import { useMyOrganizationMembers } from "@/features/organizations/organization-queries";
import { useOrganizationStore } from "@/stores/organization/organization-store";
import { useMembersFilterStore } from "@/stores/members/members-filter-store";
import { MemberStatsCards } from "@/components/dashboard/member-stats-cards";
import { MembersTable } from "@/components/dashboard/members-table";
import { InviteMemberDialog } from "@/components/dashboard/invite-member-dialog";
import { useMemo, useState } from "react";

export default function ClientDashboardMembers() {
  const { selectedOrganization } = useOrganizationStore();
  const { page, page_size, role, is_active, search } = useMembersFilterStore();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

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

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="text-muted-foreground">
          Manage and view all organization members
        </p>
      </div>

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

      {/* Invite Members Dialog */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        organizationId={selectedOrganization?.id || ""}
      />
    </div>
  );
}
