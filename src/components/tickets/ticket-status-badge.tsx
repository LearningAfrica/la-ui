import { Badge } from '@/components/ui/badge';
import type { TicketStatus } from '@/types/ticket';

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const statusConfig = {
    open: {
      label: 'Open',
      variant: 'default' as const,
    },
    'in-progress': {
      label: 'In Progress',
      variant: 'secondary' as const,
    },
    resolved: {
      label: 'Resolved',
      variant: 'success' as const,
    },
    closed: {
      label: 'Closed',
      variant: 'outline' as const,
    },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
