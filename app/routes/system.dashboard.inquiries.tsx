import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAllInquiries,
  type InquiryInterface,
} from "@/features/inquiries/inquiry-queries";
import {
  useApproveInquiry,
  useRejectInquiry,
} from "@/features/inquiries/inquiry-mutations";
import { inquiryQueryKeys } from "@/features/inquiries/inquiry-query-keys";
import { InquiryStatsCards } from "@/components/dashboard/inquiry-stats-cards";
import { AdminInquiriesTable } from "@/components/dashboard/admin-inquiries-table";
import { InquiryDetailsDialog } from "@/components/dashboard/inquiry-details-dialog";
import { ConfirmationDialog } from "@/components/dashboard/confirmation-dialog";
import { RejectInquiryDialog } from "@/components/dashboard/reject-inquiry-dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInquiryModalStore } from "@/stores/inquiries/inquiry-modal-store";

export default function SystemDashboardInquiries() {
  const [page, setPage] = useState(1);
  const [search] = useState("");

  const {
    selectedInquiry,
    detailsDialogOpen,
    approveDialogOpen,
    rejectDialogOpen,
    pendingAction,
    openDetailsDialog,
    closeDetailsDialog,
    setDetailsDialogOpen,
    openApproveDialog,
    closeApproveDialog,
    openRejectDialog,
    closeRejectDialog,
  } = useInquiryModalStore();

  const queryClient = useQueryClient();
  const { data: inquiriesData, isLoading: inquiriesLoading } = useAllInquiries(
    page,
    search
  );
  const approveMutation = useApproveInquiry();
  const rejectMutation = useRejectInquiry();

  // Compute stats from loaded inquiries
  const stats = useMemo(() => {
    if (!inquiriesData?.data) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      };
    }

    return {
      total: inquiriesData.meta.total_docs,
      pending: inquiriesData.data.filter(
        (inquiry) => inquiry.status.toLowerCase() === "pending"
      ).length,
      approved: inquiriesData.data.filter(
        (inquiry) => inquiry.status.toLowerCase() === "approved"
      ).length,
      rejected: inquiriesData.data.filter(
        (inquiry) => inquiry.status.toLowerCase() === "rejected"
      ).length,
    };
  }, [inquiriesData]);

  const handleViewDetails = (inquiry: InquiryInterface) => {
    openDetailsDialog(inquiry);
  };

  const handleApproveClick = (inquiry: InquiryInterface) => {
    openApproveDialog(inquiry);
  };

  const handleRejectClick = (inquiry: InquiryInterface) => {
    openRejectDialog(inquiry);
  };

  const handleApproveConfirm = async () => {
    if (!pendingAction) return;

    try {
      await approveMutation.mutateAsync(pendingAction.id);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: inquiryQueryKeys.allInquiries(page, search),
      });
      closeApproveDialog();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!pendingAction) return;

    try {
      await rejectMutation.mutateAsync({
        inquiryId: pendingAction.id,
        reason,
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: inquiryQueryKeys.allInquiries(page, search),
      });
      closeRejectDialog();
    } catch {
      // Error is handled by the mutation
    }
  };

  const totalPages = inquiriesData?.meta?.total_pages || 1;
  const hasNext = inquiriesData?.meta?.has_next_page || false;
  const hasPrev = inquiriesData?.meta?.has_prev_page || false;

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Organization Inquiries</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage organization onboarding requests
        </p>
      </div>

      {/* Stats Cards */}
      <InquiryStatsCards stats={stats} isLoading={inquiriesLoading} />

      {/* Inquiries Table */}
      <div className="rounded-lg border bg-white p-6 dark:bg-gray-900">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">All Inquiries</h2>
          <p className="text-muted-foreground text-sm">
            View and manage all organization requests
          </p>
        </div>

        {inquiriesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading inquiries...</div>
          </div>
        ) : (
          <>
            <AdminInquiriesTable
              inquiries={inquiriesData?.data || []}
              onViewDetails={handleViewDetails}
              onApprove={handleApproveClick}
              onReject={handleRejectClick}
              isApproving={approveMutation.isPending}
              isRejecting={rejectMutation.isPending}
            />

            {/* Pagination */}
            {inquiriesData && inquiriesData.data.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Page {page} of {totalPages} • {inquiriesData.meta.total_docs}{" "}
                  total inquiries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrev}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNext}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Inquiry Details Dialog */}
      <InquiryDetailsDialog
        inquiry={selectedInquiry}
        open={detailsDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDetailsDialog();
          else setDetailsDialogOpen(true);
        }}
        onApprove={handleApproveClick}
        onReject={handleRejectClick}
        isApproving={approveMutation.isPending}
        isRejecting={rejectMutation.isPending}
      />

      {/* Approve Confirmation Dialog */}
      <ConfirmationDialog
        open={approveDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeApproveDialog();
        }}
        onConfirm={handleApproveConfirm}
        title="Approve Organization Request"
        description={`Are you sure you want to approve the request from ${pendingAction?.company_name}? This will create a new organization and notify the requester.`}
        confirmText="Approve"
        cancelText="Cancel"
        isLoading={approveMutation.isPending}
        variant="default"
      />

      {/* Reject Confirmation Dialog */}
      <RejectInquiryDialog
        open={rejectDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeRejectDialog();
        }}
        onConfirm={handleRejectConfirm}
        companyName={pendingAction?.company_name}
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}
