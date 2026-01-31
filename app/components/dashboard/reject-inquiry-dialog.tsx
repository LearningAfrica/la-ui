import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RejectInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  companyName?: string;
  isLoading?: boolean;
}

export function RejectInquiryDialog({
  open,
  onOpenChange,
  onConfirm,
  companyName,
  isLoading = false,
}: RejectInquiryDialogProps) {
  const [reason, setReason] = useState("");

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setReason("");
    }

    onOpenChange(newOpen);
  };

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Organization Request</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reject the request from {companyName}? This
            action will notify the requester with the reason provided below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejection-reason">
            Rejection Reason <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="rejection-reason"
            placeholder="Please provide a reason for rejecting this request..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
            className="min-h-25"
          />
          {reason.trim() === "" && (
            <p className="text-muted-foreground text-xs">
              A rejection reason is required
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isLoading || reason.trim() === ""}
            className="bg-red-500 hover:bg-red-600"
          >
            {isLoading ? "Rejecting..." : "Reject"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
