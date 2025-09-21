import { Badge } from '@/components/ui/badge';

type CourseStatus =
  | 'draft'
  | 'submitted'
  | 'in-review'
  | 'approved'
  | 'rejected'
  | 'published';

interface CourseStatusBadgeProps {
  status: CourseStatus;
  className?: string;
}

export function CourseStatusBadge({
  status,
  className,
}: CourseStatusBadgeProps) {
  const getStatusConfig = (status: CourseStatus) => {
    switch (status) {
      case 'draft':
        return {
          label: 'Draft',
          variant: 'outline' as const,
        };
      case 'submitted':
        return {
          label: 'Submitted',
          variant: 'secondary' as const,
        };
      case 'in-review':
        return {
          label: 'In Review',
          variant: 'secondary' as const,
        };
      case 'approved':
        return {
          label: 'Approved',
          variant: 'default' as const,
        };
      case 'rejected':
        return {
          label: 'Changes Requested',
          variant: 'destructive' as const,
        };
      case 'published':
        return {
          label: 'Published',
          variant: 'default' as const,
        };
      default:
        return {
          label: 'Unknown',
          variant: 'outline' as const,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
