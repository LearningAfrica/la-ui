import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

import type { Inquiry } from '../types';
import { RequisitionDetailModal } from './requisition-detail-modal';
import { useApiClient } from '@/lib/api';

interface InquiryActionsProps {
  inquiry: Inquiry;
}

type ActionType = 'approve' | 'reject' | null;

export function InquiryActions({ inquiry }: InquiryActionsProps) {
  const queryClient = useQueryClient();
  const client = useApiClient();
  const [confirmAction, setConfirmAction] = useState<ActionType>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const closeDialog = () => {
    setConfirmAction(null);
    setRejectionReason('');
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      reason,
    }: {
      id: number;
      status: 'approved' | 'rejected';
      reason?: string;
    }) => {
      const payload: { status: 'approved' | 'rejected'; reason?: string } = { status };

      if (status === 'rejected' && reason) {
        payload.reason = reason;
      }

      const { data } = await client.patch(
        `/invite/admin-action-to-organization-request/${id}/`,
        payload,
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });

      toast.success(
        `Inquiry ${variables.status === 'approved' ? 'approved' : 'rejected'}`,
        {
          description:
            variables.status === 'approved'
              ? 'The organization inquiry has been approved.'
              : 'The organization inquiry has been rejected.',
        },
      );
      closeDialog();
    },
    onError: () => {
      toast.error('Unable to update inquiry', {
        description: 'Please try again or contact support.',
      });
    },
  });

  const handleConfirm = () => {
    if (!confirmAction) return;

    updateStatusMutation.mutate({
      id: inquiry.id,
      status: confirmAction === 'approve' ? 'approved' : 'rejected',
      reason: confirmAction === 'reject' ? rejectionReason.trim() : undefined,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <RequisitionDetailModal inquiry={inquiry} />
      {inquiry.status === 'pending' && (
        <>
          <Button
            size="sm"
            onClick={() => setConfirmAction('approve')}
            disabled={updateStatusMutation.isPending}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {updateStatusMutation.isPending && confirmAction === 'approve' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setConfirmAction('reject')}
            disabled={updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending && confirmAction === 'reject' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
          </Button>
        </>
      )}

      <Dialog open={Boolean(confirmAction)} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'approve' ? 'Approve inquiry' : 'Reject inquiry'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'approve'
                ? 'Confirm that you want to approve this organization inquiry.'
                : 'Add a short note explaining why the inquiry is being rejected.'}
            </DialogDescription>
          </DialogHeader>

          {confirmAction === 'reject' && (
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection reason</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Let the requester know why their inquiry was rejected"
                rows={4}
              />
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant={confirmAction === 'reject' ? 'destructive' : 'default'}
              onClick={handleConfirm}
              disabled={
                updateStatusMutation.isPending ||
                (confirmAction === 'reject' && !rejectionReason.trim())
              }
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : confirmAction === 'approve' ? (
                'Approve'
              ) : (
                'Reject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
