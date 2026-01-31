import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { InquiryInterface } from "@/features/inquiries/inquiry-queries";
import { Calendar, Mail, Building2, Users } from "lucide-react";

interface InquiryDetailsDialogProps {
  inquiry: InquiryInterface | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (inquiry: InquiryInterface) => void;
  onReject?: (inquiry: InquiryInterface) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function InquiryDetailsDialog({
  inquiry,
  open,
  onOpenChange,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
}: InquiryDetailsDialogProps) {
  if (!inquiry) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">
                {inquiry.company_name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Organization onboarding request details
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(inquiry.status)}>
              {inquiry.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contact Person */}
          <div>
            <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
              Contact Person
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10">
                  <span className="font-medium text-orange-500">
                    {inquiry.user.first_name[0]}
                    {inquiry.user.last_name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {inquiry.user.first_name} {inquiry.user.last_name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {inquiry.user.is_verified
                      ? "Verified Account"
                      : "Unverified Account"}
                  </p>
                </div>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>{inquiry.user.email}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Organization Details */}
          <div>
            <h3 className="text-muted-foreground mb-3 text-sm font-semibold">
              Organization Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Building2 className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">Category</p>
                  <p className="font-medium">{inquiry.company_category}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Users className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">Company Size</p>
                  <p className="font-medium">{inquiry.company_size}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description & Reason */}
          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-semibold">
              Description
            </h3>
            <p className="text-sm leading-relaxed">
              {inquiry.company_description}
            </p>
          </div>

          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-semibold">
              Reason for Request
            </h3>
            <p className="text-sm leading-relaxed">{inquiry.reason}</p>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Submitted: {formatDate(inquiry.created_at)}</span>
            </div>
            {inquiry.reviewed_at && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Reviewed: {formatDate(inquiry.reviewed_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {inquiry.status.toLowerCase() === "pending" &&
          (onApprove || onReject) && (
            <>
              <Separator />
              <div className="flex justify-end gap-3">
                {onReject && (
                  <Button
                    variant="outline"
                    onClick={() => onReject(inquiry)}
                    disabled={isApproving || isRejecting}
                  >
                    {isRejecting ? "Rejecting..." : "Reject"}
                  </Button>
                )}
                {onApprove && (
                  <Button
                    onClick={() => onApprove(inquiry)}
                    disabled={isApproving || isRejecting}
                    className="bg-linear-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </Button>
                )}
              </div>
            </>
          )}
      </DialogContent>
    </Dialog>
  );
}
