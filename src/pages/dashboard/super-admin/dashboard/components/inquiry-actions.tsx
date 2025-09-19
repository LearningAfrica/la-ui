import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

import type { Inquiry } from '../types';
import { RequisitionDetailModal } from './requisition-detail-modal';
import { useApiClient } from '@/lib/api';

interface InquiryActionsProps {
  inquiry: Inquiry;
}

export function InquiryActions({ inquiry }: InquiryActionsProps) {
  const queryClient = useQueryClient();
  const client = useApiClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'approved' | 'rejected';
    }) => {
      try {
        const { data } = await client.patch(
          `/users/organization-setup-requests/${id}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          },
        );
        return data;
      } catch (error) {
        throw new Error('Failed to update inquiry status');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  return (
    <div className="flex items-center gap-2">
      <RequisitionDetailModal inquiry={inquiry} />
      {inquiry.status === 'pending' && (
        <>
          <Button
            size="sm"
            onClick={() =>
              updateStatusMutation.mutate({
                id: inquiry.id,
                status: 'approved',
              })
            }
            disabled={updateStatusMutation.isPending}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              updateStatusMutation.mutate({
                id: inquiry.id,
                status: 'rejected',
              })
            }
            disabled={updateStatusMutation.isPending}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
