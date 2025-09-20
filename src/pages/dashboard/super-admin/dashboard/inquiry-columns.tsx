import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Mail, Clock } from 'lucide-react';

import type { Inquiry } from './types';
import { InquiryActions } from './components/inquiry-actions';

const STATUS_STYLES: Record<string, string> = {
  approved: 'bg-green-100 text-green-700 hover:bg-green-100',
  rejected: 'bg-red-100 text-red-700 hover:bg-red-100',
  pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
};

const formatDate = (value: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const inquiryColumns: ColumnDef<Inquiry>[] = [
  {
    accessorKey: 'company_name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-semibold"
      >
        Company
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="font-medium">{row.original.company_name}</p>
        <p className="text-sm text-muted-foreground">
          {row.original.company_category || 'Category not specified'}
        </p>
      </div>
    ),
  },
  {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="font-medium">
          {row.original.user.first_name} {row.original.user.last_name}
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          <a
            href={`mailto:${row.original.user.email}`}
            className="hover:text-primary"
          >
            {row.original.user.email}
          </a>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const style = STATUS_STYLES[status] ?? 'bg-muted text-foreground';
      return <Badge className={style}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-semibold"
      >
        Submitted
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>{formatDate(row.original.created_at)}</span>
      </div>
    ),
  },
  {
    accessorKey: 'company_size',
    header: 'Size',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.company_size}</Badge>
    ),
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.original.reason}>
        {row.original.reason || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'company_description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.original.company_description}>
        {row.original.company_description}
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <InquiryActions inquiry={row.original} />,
  },
];
