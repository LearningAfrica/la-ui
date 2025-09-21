import { useState } from 'react';
import {
  Award,
  Download,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Certificate template data
type CertificateTemplate = {
  id: string;
  name: string;
  description: string;
  image: string;
  status: 'active' | 'draft' | 'archived';
  courses: number;
  issued: number;
  createdAt: string;
  updatedAt: string;
};

const certificateTemplates: CertificateTemplate[] = [
  {
    id: 'cert-001',
    name: 'Course Completion',
    description:
      'Standard certificate awarded upon successful course completion',
    image:
      'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    status: 'active',
    courses: 24,
    issued: 1458,
    createdAt: '2023-06-15',
    updatedAt: '2023-11-02',
  },
  {
    id: 'cert-002',
    name: 'Professional Certification',
    description: 'Advanced certification for professional-level courses',
    image:
      'https://images.unsplash.com/photo-1589330694653-ded6df03f754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    status: 'active',
    courses: 8,
    issued: 342,
    createdAt: '2023-07-22',
    updatedAt: '2023-10-18',
  },
  {
    id: 'cert-003',
    name: 'Achievement Award',
    description: 'Special recognition for outstanding performance',
    image:
      'https://images.unsplash.com/photo-1569383746724-6f1b882b8cb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    status: 'draft',
    courses: 0,
    issued: 0,
    createdAt: '2023-11-05',
    updatedAt: '2023-11-05',
  },
  {
    id: 'cert-004',
    name: 'Specialization Certificate',
    description: 'Certificate for completing a series of related courses',
    image:
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    status: 'active',
    courses: 12,
    issued: 876,
    createdAt: '2023-08-10',
    updatedAt: '2023-10-30',
  },
  {
    id: 'cert-005',
    name: 'Legacy Certificate',
    description: 'Old certificate format no longer in use',
    image:
      'https://images.unsplash.com/photo-1574421233466-7440a0e5f7b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    status: 'archived',
    courses: 0,
    issued: 2145,
    createdAt: '2022-03-15',
    updatedAt: '2023-09-01',
  },
];

// Certificate issuance data
type CertificateIssuance = {
  id: string;
  certificateId: string;
  certificateName: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  issuedAt: string;
  expiresAt: string | null;
  status: 'active' | 'expired' | 'revoked';
};

const certificateIssuances: CertificateIssuance[] = [
  {
    id: 'issue-001',
    certificateId: 'cert-001',
    certificateName: 'Course Completion',
    courseId: 'course-001',
    courseName: 'JavaScript Fundamentals',
    studentId: 'student-001',
    studentName: 'Alex Johnson',
    studentEmail: 'alex.j@example.com',
    issuedAt: '2023-10-15',
    expiresAt: null,
    status: 'active',
  },
  {
    id: 'issue-002',
    certificateId: 'cert-002',
    certificateName: 'Professional Certification',
    courseId: 'course-003',
    courseName: 'Advanced React Development',
    studentId: 'student-002',
    studentName: 'Jamie Smith',
    studentEmail: 'jamie.s@example.com',
    issuedAt: '2023-09-22',
    expiresAt: '2025-09-22',
    status: 'active',
  },
  {
    id: 'issue-003',
    certificateId: 'cert-004',
    certificateName: 'Specialization Certificate',
    courseId: 'course-005',
    courseName: 'Full Stack Web Development',
    studentId: 'student-003',
    studentName: 'Taylor Wilson',
    studentEmail: 'taylor.w@example.com',
    issuedAt: '2023-08-30',
    expiresAt: '2025-08-30',
    status: 'active',
  },
  {
    id: 'issue-004',
    certificateId: 'cert-001',
    certificateName: 'Course Completion',
    courseId: 'course-002',
    courseName: 'CSS Mastery',
    studentId: 'student-004',
    studentName: 'Morgan Lee',
    studentEmail: 'morgan.l@example.com',
    issuedAt: '2023-07-12',
    expiresAt: null,
    status: 'active',
  },
  {
    id: 'issue-005',
    certificateId: 'cert-005',
    certificateName: 'Legacy Certificate',
    courseId: 'course-004',
    courseName: 'Introduction to Programming',
    studentId: 'student-005',
    studentName: 'Casey Brown',
    studentEmail: 'casey.b@example.com',
    issuedAt: '2022-11-05',
    expiresAt: '2023-11-05',
    status: 'expired',
  },
];

// Certificate template columns
const templateColumns: ColumnDef<CertificateTemplate>[] = [
  {
    accessorKey: 'name',
    header: 'Template Name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-16 overflow-hidden rounded-md">
            <img
              src={row.original.image || '/placeholder.svg'}
              alt={row.original.name}
              width={64}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-muted-foreground text-xs">
              {row.getValue('id')}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className="text-xs">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant="outline"
          className={
            status === 'active'
              ? 'border-green-200 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : status === 'draft'
                ? 'border-amber-200 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                : 'border-gray-200 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'courses',
    header: 'Courses',
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('courses')}</div>
    ),
  },
  {
    accessorKey: 'issued',
    header: 'Issued',
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('issued')}</div>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) => <div>{row.getValue('updatedAt')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const template = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/admin/certificates/${template.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/admin/certificates/${template.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Template
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // toast({
                // 	title: 'Certificate template duplicated',
                // 	description: `${template.name} has been duplicated.`,
                // });
                toast.success('Certificate template duplicated');
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // toast({
                // 	title: 'Certificate template deleted',
                // 	description: `${template.name} has been deleted.`,
                // 	variant: 'destructive',
                // });
                toast.error('Certificate template deleted');
              }}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Certificate issuance columns
const issuanceColumns: ColumnDef<CertificateIssuance>[] = [
  {
    accessorKey: 'studentName',
    header: 'Student',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <img
              src={`https://i.pravatar.cc/32?u=${row.original.studentId}`}
              alt={row.original.studentName}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{row.getValue('studentName')}</div>
            <div className="text-muted-foreground text-xs">
              {row.original.studentEmail}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'certificateName',
    header: 'Certificate',
    cell: ({ row }) => <div>{row.getValue('certificateName')}</div>,
  },
  {
    accessorKey: 'courseName',
    header: 'Course',
    cell: ({ row }) => <div>{row.getValue('courseName')}</div>,
  },
  {
    accessorKey: 'issuedAt',
    header: 'Issue Date',
    cell: ({ row }) => <div>{row.getValue('issuedAt')}</div>,
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expiry Date',
    cell: ({ row }) => <div>{row.getValue('expiresAt') || 'Never'}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant="outline"
          className={
            status === 'active'
              ? 'border-green-200 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : status === 'expired'
                ? 'border-amber-200 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                : 'border-red-200 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: () => {
      // const issuance = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                // toast({
                // 	title: 'Certificate downloaded',
                // 	description: `Certificate for ${issuance.studentName} has been downloaded.`,
                // });
                toast.success('Certificate downloaded');
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // toast({
                // 	title: 'Email sent',
                // 	description: `Certificate has been emailed to ${issuance.studentEmail}.`,
                // });
                toast.success('Email sent to student');
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Email to Student
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // toast({
                // 	title: 'Certificate revoked',
                // 	description: `Certificate for ${issuance.studentName} has been revoked.`,
                // 	variant: 'destructive',
                // });
                toast.error('Certificate revoked');
              }}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Revoke
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Stats data
const statsData = [
  {
    title: 'Total Templates',
    value: '5',
    description: 'Active templates: 3',
    icon: FileText,
  },
  {
    title: 'Total Certificates Issued',
    value: '4,821',
    description: 'This month: 342',
    icon: Award,
  },
  {
    title: 'Courses with Certificates',
    value: '44',
    description: 'Out of 56 courses',
    icon: FileText,
  },
];

export default function CertificatesPage() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [, setActiveTab] = useState('templates');

  // Table for templates
  const templatesTable = useReactTable({
    data: certificateTemplates,
    columns: templateColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Table for issuances
  const issuancesTable = useReactTable({
    data: certificateIssuances,
    columns: issuanceColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Certificates</h2>
          <p className="text-muted-foreground">
            Manage certificate templates and track certificate issuance
          </p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/admin/certificates/create')}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <stat.icon className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-muted-foreground text-xs">
                    {stat.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs
        defaultValue="templates"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="templates">Certificate Templates</TabsTrigger>
          <TabsTrigger value="issuances">Certificate Issuances</TabsTrigger>
        </TabsList>
        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search templates..."
                value={
                  (templatesTable
                    .getColumn('name')
                    ?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  templatesTable
                    .getColumn('name')
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <Select
                value={
                  (templatesTable
                    .getColumn('status')
                    ?.getFilterValue() as string) ?? ''
                }
                onValueChange={(value) =>
                  templatesTable
                    .getColumn('status')
                    ?.setFilterValue(value || undefined)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {templatesTable.getHeaderGroups().map((headerGroup) => (
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
                {templatesTable.getRowModel().rows?.length ? (
                  templatesTable.getRowModel().rows.map((row) => (
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
                      colSpan={templateColumns.length}
                      className="h-24 text-center"
                    >
                      No certificate templates found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <div className="text-muted-foreground text-sm">
              Page {templatesTable.getState().pagination.pageIndex + 1} of{' '}
              {templatesTable.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => templatesTable.previousPage()}
              disabled={!templatesTable.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => templatesTable.nextPage()}
              disabled={!templatesTable.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="issuances" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by student name..."
                value={
                  (issuancesTable
                    .getColumn('studentName')
                    ?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  issuancesTable
                    .getColumn('studentName')
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <Select
                value={
                  (issuancesTable
                    .getColumn('status')
                    ?.getFilterValue() as string) ?? ''
                }
                onValueChange={(value) =>
                  issuancesTable
                    .getColumn('status')
                    ?.setFilterValue(value || undefined)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {issuancesTable.getHeaderGroups().map((headerGroup) => (
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
                {issuancesTable.getRowModel().rows?.length ? (
                  issuancesTable.getRowModel().rows.map((row) => (
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
                      colSpan={issuanceColumns.length}
                      className="h-24 text-center"
                    >
                      No certificate issuances found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <div className="text-muted-foreground text-sm">
              Page {issuancesTable.getState().pagination.pageIndex + 1} of{' '}
              {issuancesTable.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => issuancesTable.previousPage()}
              disabled={!issuancesTable.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => issuancesTable.nextPage()}
              disabled={!issuancesTable.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
