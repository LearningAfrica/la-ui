import { useMyOrganizationMembers } from "@/features/organizations/organization-queries";
import { useOrganizationStore } from "@/stores/organization/organization-store";
import { useMembersFilterStore } from "@/stores/members/members-filter-store";
import { MemberStatsCards } from "@/components/dashboard/member-stats-cards";
import { MembersTable } from "@/components/dashboard/members-table";
import { RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export default function ClientDashboardMembers() {
  const { selectedOrganization } = useOrganizationStore();
  const { page, page_size, role, is_active, search } = useMembersFilterStore();

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground">
            Manage and view all organization members
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
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
      />
    </div>
  );
}
