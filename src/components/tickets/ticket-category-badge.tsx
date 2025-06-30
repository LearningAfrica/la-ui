import { Badge } from '@/components/ui/badge';
import type { TicketCategory } from '@/types/ticket';
import {
  BookOpen,
  CreditCard,
  HelpCircle,
  MonitorSmartphone,
  User,
  FileText,
} from 'lucide-react';

interface TicketCategoryBadgeProps {
  category: TicketCategory;
}

export function TicketCategoryBadge({ category }: TicketCategoryBadgeProps) {
  const categoryConfig = {
    technical: {
      label: 'Technical',
      icon: MonitorSmartphone,
      variant: 'outline' as const,
    },
    content: {
      label: 'Content',
      icon: BookOpen,
      variant: 'outline' as const,
    },
    billing: {
      label: 'Billing',
      icon: CreditCard,
      variant: 'outline' as const,
    },
    account: {
      label: 'Account',
      icon: User,
      variant: 'outline' as const,
    },
    certificate: {
      label: 'Certificate',
      icon: FileText,
      variant: 'outline' as const,
    },
    other: {
      label: 'Other',
      icon: HelpCircle,
      variant: 'outline' as const,
    },
  };

  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
