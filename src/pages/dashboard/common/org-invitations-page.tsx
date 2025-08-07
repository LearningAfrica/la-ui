import { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Building2,
  Check,
  X,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { AcceptOrgInviteDialog } from '@/components/invites/accept-org-invite-dialog';
import { DeclineOrgInviteDialog } from '@/components/invites/decline-org-invite-dialog';
import { ViewOrgInviteDialog } from '@/components/invites/view-org-invite-dialog';
import { addDays, subDays } from 'date-fns';

// Types
interface Invitation {
  id: string;
  organizationName: string;
  organizationLogo: string;
  role: 'instructor' | 'admin';
  invitedBy: {
    name: string;
    email: string;
    avatar: string;
  };
  message: string;
  sentDate: string;
  expiresDate: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

// Mock data for invitations
const mockInvitations: Invitation[] = [
  {
    id: 'inv-1',
    organizationName: 'TechEdu Academy',
    organizationLogo: '/placeholder.svg?height=40&width=40',
    role: 'instructor',
    invitedBy: {
      name: 'Sarah Johnson',
      email: 'sarah@techedu.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    message:
      "We'd love to have you join our team as an instructor. Your expertise in web development would be a great addition to our platform.",
    sentDate: new Date().toISOString().split('T')[0], // Today's date
    expiresDate: addDays(new Date(), 30).toISOString().split('T')[0], // 30 days from today
    status: 'pending',
  },
  {
    id: 'inv-2',
    organizationName: 'Digital Learning Hub',
    organizationLogo: '/placeholder.svg?height=40&width=40',
    role: 'admin',
    invitedBy: {
      name: 'Michael Chen',
      email: 'michael@digitallearning.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    message:
      'Join us as an admin to help manage our growing platform and support our instructor community.',
    sentDate: '2024-01-10',
    expiresDate: addDays(new Date('2024-01-10'), 2).toISOString().split('T')[0], // 30 days from sentDate
    status: 'pending',
  },
  {
    id: 'inv-3',
    organizationName: 'CodeMaster Institute',
    organizationLogo: '/placeholder.svg?height=40&width=40',
    role: 'instructor',
    invitedBy: {
      name: 'Emily Rodriguez',
      email: 'emily@codemaster.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    message:
      "We're impressed with your background and would like you to teach programming courses on our platform.",
    sentDate: subDays(new Date(), 10).toISOString().split('T')[0], // 10 days ago
    expiresDate: subDays(new Date(), 5).toISOString().split('T')[0], // 5 days ago
    status: 'expired',
  },
  {
    id: 'inv-4',
    organizationName: 'LearnTech Solutions',
    organizationLogo: '/placeholder.svg?height=40&width=40',
    role: 'instructor',
    invitedBy: {
      name: 'David Kim',
      email: 'david@learntech.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    message:
      'Thank you for accepting our invitation! Welcome to the LearnTech family.',
    sentDate: subDays(new Date(), 20).toISOString().split('T')[0], // 20 days ago
    expiresDate: subDays(new Date(), 10).toISOString().split('T')[0], // 30 days from today
    status: 'accepted',
  },
  {
    id: 'inv-5',
    organizationName: 'SkillForge Academy',
    organizationLogo: '/placeholder.svg?height=40&width=40',
    role: 'admin',
    invitedBy: {
      name: 'Lisa Wang',
      email: 'lisa@skillforge.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    message:
      'We believe your administrative skills would be perfect for our growing team.',
    sentDate: subDays(new Date(), 5).toISOString().split('T')[0], // 5 days ago
    expiresDate: addDays(new Date(), 30).toISOString().split('T')[0], // 30 days from today
    status: 'declined',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        >
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case 'accepted':
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        >
          <Check className="mr-1 h-3 w-3" />
          Accepted
        </Badge>
      );
    case 'declined':
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        >
          <X className="mr-1 h-3 w-3" />
          Declined
        </Badge>
      );
    case 'expired':
      return (
        <Badge
          variant="secondary"
          className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
        >
          <AlertCircle className="mr-1 h-3 w-3" />
          Expired
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'instructor':
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
        >
          Instructor
        </Badge>
      );
    case 'admin':
      return (
        <Badge
          variant="outline"
          className="border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300"
        >
          Admin
        </Badge>
      );
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

const isExpired = (expiresDate: string) => {
  return new Date(expiresDate) < new Date();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function UserOrgInvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleAcceptInvitation = async (invitationId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: 'accepted' as const } : inv,
      ),
    );

    toast.success('Invitation accepted successfully!');
    setAcceptDialogOpen(false);
    setSelectedInvitation(null);
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: 'declined' as const } : inv,
      ),
    );

    toast.success('Invitation declined');
    setDeclineDialogOpen(false);
    setSelectedInvitation(null);
  };

  const columns: ColumnDef<Invitation>[] = [
    {
      accessorKey: 'organizationName',
      header: 'Organization',
      cell: ({ row }) => {
        const invitation = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={invitation.organizationLogo || '/placeholder.svg'}
                alt={invitation.organizationName}
              />
              <AvatarFallback>
                <Building2 className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{invitation.organizationName}</div>
              <div className="text-muted-foreground text-sm">
                {getRoleBadge(invitation.role)}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'invitedBy',
      header: 'Invited By',
      cell: ({ row }) => {
        const invitedBy = row.original.invitedBy;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={invitedBy.avatar || '/placeholder.svg'}
                alt={invitedBy.name}
              />
              <AvatarFallback className="text-xs">
                {invitedBy.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{invitedBy.name}</div>
              <div className="text-muted-foreground text-xs">
                {invitedBy.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'sentDate',
      header: 'Sent Date',
      cell: ({ row }) => {
        return (
          <div className="text-sm">{formatDate(row.original.sentDate)}</div>
        );
      },
    },
    {
      accessorKey: 'expiresDate',
      header: 'Expires',
      cell: ({ row }) => {
        const expired = isExpired(row.original.expiresDate);
        return (
          <div className={`text-sm ${expired ? 'text-red-600' : ''}`}>
            {formatDate(row.original.expiresDate)}
            {expired && <div className="text-xs text-red-500">Expired</div>}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = isExpired(row.original.expiresDate)
          ? 'expired'
          : row.original.status;
        return getStatusBadge(status);
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const invitation = row.original;
        const expired = isExpired(invitation.expiresDate);
        const isPending = invitation.status === 'pending' && !expired;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedInvitation(invitation);
                  setViewDialogOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {isPending && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedInvitation(invitation);
                      setAcceptDialogOpen(true);
                    }}
                    className="text-green-600"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedInvitation(invitation);
                      setDeclineDialogOpen(true);
                    }}
                    className="text-red-600"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: invitations,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const pendingCount = invitations.filter(
    (inv) => inv.status === 'pending' && !isExpired(inv.expiresDate),
  ).length;
  const acceptedCount = invitations.filter(
    (inv) => inv.status === 'accepted',
  ).length;
  const expiredCount = invitations.filter((inv) =>
    isExpired(inv.expiresDate),
  ).length;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Invitations</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organization invitations and join new teams
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invitations
            </CardTitle>
            <Mail className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invitations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Filter organizations..."
            value={
              (table
                .getColumn('organizationName')
                ?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table
                .getColumn('organizationName')
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={
              (table.getColumn('status')?.getFilterValue() as string) ?? ''
            }
            onValueChange={(value) =>
              table
                .getColumn('status')
                ?.setFilterValue(value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No invitations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      {selectedInvitation && (
        <>
          <AcceptOrgInviteDialog
            invitation={selectedInvitation}
            open={acceptDialogOpen}
            onOpenChange={setAcceptDialogOpen}
            onAccept={handleAcceptInvitation}
          />
          <DeclineOrgInviteDialog
            invitation={selectedInvitation}
            open={declineDialogOpen}
            onOpenChange={setDeclineDialogOpen}
            onDecline={handleDeclineInvitation}
          />
          <ViewOrgInviteDialog
            invitation={selectedInvitation}
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
          />
        </>
      )}
    </div>
  );
}
