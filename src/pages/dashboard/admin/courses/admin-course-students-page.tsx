import { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpDown,
  Clock,
  Download,
  Filter,
  Mail,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

// Sample course data
const course = {
  id: 'c1',
  title: 'JavaScript Fundamentals',
  instructor: 'Jane Doe',
  instructorId: 'i1',
  category: 'Programming',
  students: 1245,
};

// Sample students data
const students = [
  {
    id: 's1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    image: 'https://i.pravatar.cc/150?u=alex.johnson@example.com',
    enrollmentDate: '2024-01-15',
    progress: 78,
    lastActivity: '2024-02-10',
    status: 'active',
  },
  {
    id: 's2',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    image: 'https://i.pravatar.cc/150?u=maria.garcia@example.com',
    enrollmentDate: '2024-01-12',
    progress: 92,
    lastActivity: '2024-02-12',
    status: 'active',
  },
  {
    id: 's3',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    image: 'https://i.pravatar.cc/150?u=james.wilson@example.com',
    enrollmentDate: '2024-01-10',
    progress: 45,
    lastActivity: '2024-02-01',
    status: 'inactive',
  },
  {
    id: 's4',
    name: 'Sarah Lee',
    email: 'sarah.lee@example.com',
    image: 'https://i.pravatar.cc/150?u=sarah.lee@example.com',
    enrollmentDate: '2024-01-08',
    progress: 100,
    lastActivity: '2024-02-11',
    status: 'completed',
  },
  {
    id: 's5',
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    image: 'https://i.pravatar.cc/150?u=robert.brown@example.com',
    enrollmentDate: '2024-01-05',
    progress: 65,
    lastActivity: '2024-02-09',
    status: 'active',
  },
  {
    id: 's6',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    image: 'https://i.pravatar.cc/150?u=emily.davis@example.com',
    enrollmentDate: '2024-01-20',
    progress: 32,
    lastActivity: '2024-02-08',
    status: 'active',
  },
  {
    id: 's7',
    name: 'Michael Thompson',
    email: 'michael.thompson@example.com',
    image: 'https://i.pravatar.cc/150?u=michael.thompson@example.com',
    enrollmentDate: '2024-01-18',
    progress: 88,
    lastActivity: '2024-02-12',
    status: 'active',
  },
  {
    id: 's8',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@example.com',
    image: 'https://i.pravatar.cc/150?u=sophia.martinez@example.com',
    enrollmentDate: '2024-01-25',
    progress: 12,
    lastActivity: '2024-02-05',
    status: 'inactive',
  },
  {
    id: 's9',
    name: 'Daniel Anderson',
    email: 'daniel.anderson@example.com',
    image: 'https://i.pravatar.cc/150?u=daniel.anderson@example.com',
    enrollmentDate: '2024-01-22',
    progress: 100,
    lastActivity: '2024-02-10',
    status: 'completed',
  },
  {
    id: 's10',
    name: 'Olivia Taylor',
    email: 'olivia.taylor@example.com',
    image: 'https://i.pravatar.cc/150?u=olivia.taylor@example.com',
    enrollmentDate: '2024-01-30',
    progress: 55,
    lastActivity: '2024-02-11',
    status: 'active',
  },
];

// Define the columns for the table
const columns: ColumnDef<(typeof students)[0]>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={row.original.image || '/placeholder.svg'}
            alt={row.getValue('name')}
          />
          <AvatarFallback>
            {row.getValue<string>('name').charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Link
          to={`/dashboard/admin/students/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.getValue('name')}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'enrollmentDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Enrolled
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('enrollmentDate'));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'progress',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Progress
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const progress = Number.parseInt(row.getValue('progress'));
      return (
        <div className="flex items-center gap-2">
          <Progress value={progress} className="h-2 w-[60px]" />
          <span className="text-muted-foreground text-xs">{progress}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'lastActivity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Last Activity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('lastActivity'));
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return (
        <div className="flex items-center gap-1">
          <Clock className="text-muted-foreground h-3 w-3" />
          <span>
            {diffDays === 1
              ? 'Yesterday'
              : diffDays === 0
                ? 'Today'
                : `${diffDays} days ago`}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'active'
              ? 'outline'
              : status === 'completed'
                ? 'secondary'
                : 'secondary'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const student = row.original;
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
              <Link to={`/dashboard/admin/students/${student.id}`}>
                <Users className="mr-2 h-4 w-4" />
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.success(`Email sent to ${student.name}`)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Student
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // toast({
                // 	title: 'Student Removed',
                // 	description: `${student.name} has been removed from this course.`,
                // 	variant: 'destructive',
                // });
                toast.error(`Student ${student.name} removed from course.`);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove from Course
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function CourseStudentsPage({
  params,
}: {
  params: { id: string };
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [progressFilter, setProgressFilter] = useState<string>('');

  // Create the table instance
  const table = useReactTable({
    data: students,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  // Filter by status
  const handleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  // Apply status filter
  useState(() => {
    if (statusFilter.length > 0) {
      table.getColumn('status')?.setFilterValue(statusFilter);
    } else {
      table.getColumn('status')?.setFilterValue(undefined);
    }
  });

  // Filter by progress
  const handleProgressFilter = (range: string) => {
    setProgressFilter(range);

    if (range) {
      const [min, max] = range.split('-').map(Number);
      table.getColumn('progress')?.setFilterValue((value: number) => {
        return value >= min && value <= max;
      });
    } else {
      table.getColumn('progress')?.setFilterValue(undefined);
    }
  };

  // Calculate stats
  const activeStudents = students.filter(
    (student) => student.status === 'active',
  ).length;
  const completedStudents = students.filter(
    (student) => student.status === 'completed',
  ).length;
  const inactiveStudents = students.filter(
    (student) => student.status === 'inactive',
  ).length;
  const averageProgress =
    students.reduce((sum, student) => sum + student.progress, 0) /
    students.length;

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/dashboard/admin/courses/${params.id}`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Course
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to={`/dashboard/admin/courses/${params.id}/students/add`}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Students
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {course.title}: Students
        </h2>
        <p className="text-muted-foreground">
          Manage students enrolled in this course
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-500">+5</span> in the last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageProgress.toFixed(0)}%
            </div>
            <div className="mt-2">
              <Progress value={averageProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((completedStudents / students.length) * 100).toFixed(0)}%
            </div>
            <p className="text-muted-foreground text-xs">
              {completedStudents} of {students.length} students completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Learners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((activeStudents / students.length) * 100).toFixed(0)}%
            </div>
            <p className="text-muted-foreground text-xs">
              {activeStudents} active, {inactiveStudents} inactive
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Progress
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Progress</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleProgressFilter('0-25')}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={progressFilter === '0-25'}
                    onCheckedChange={() => {}}
                  />
                  <span>0-25%</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleProgressFilter('26-50')}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={progressFilter === '26-50'}
                    onCheckedChange={() => {}}
                  />
                  <span>26-50%</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleProgressFilter('51-75')}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={progressFilter === '51-75'}
                    onCheckedChange={() => {}}
                  />
                  <span>51-75%</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleProgressFilter('76-99')}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={progressFilter === '76-99'}
                    onCheckedChange={() => {}}
                  />
                  <span>76-99%</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleProgressFilter('100-100')}
                  className="flex items-center gap-2"
                >
                  <Checkbox
                    checked={progressFilter === '100-100'}
                    onCheckedChange={() => {}}
                  />
                  <span>100% (Completed)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProgressFilter('')}>
                  Reset Filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter([]);
                setProgressFilter('');
                table.resetColumnFilters();
              }}
            >
              Reset Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== 'undefined' &&
                      column.getCanHide(),
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuItem
                        key={column.id}
                        className="capitalize"
                        onClick={() =>
                          column.toggleVisibility(!column.getIsVisible())
                        }
                      >
                        <Checkbox
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                          aria-label={`Toggle ${column.id} column`}
                          className="mr-2"
                        />
                        {column.id}
                      </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
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
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-2">
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
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {/* Similar content as "all" tab but filtered for active students */}
          <div className="rounded-md border">
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
                {students
                  .filter((student) => student.status === 'active')
                  .map((student) => {
                    const row = table
                      .getRowModel()
                      .rows.find((r) => r.original.id === student.id);
                    return row ? (
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
                    ) : null;
                  })}
                {students.filter((student) => student.status === 'active')
                  .length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No active students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {/* Similar content as "all" tab but filtered for inactive students */}
          <div className="rounded-md border">
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
                {students
                  .filter((student) => student.status === 'inactive')
                  .map((student) => {
                    const row = table
                      .getRowModel()
                      .rows.find((r) => r.original.id === student.id);
                    return row ? (
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
                    ) : null;
                  })}
                {students.filter((student) => student.status === 'inactive')
                  .length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No inactive students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {/* Similar content as "all" tab but filtered for completed students */}
          <div className="rounded-md border">
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
                {students
                  .filter((student) => student.status === 'completed')
                  .map((student) => {
                    const row = table
                      .getRowModel()
                      .rows.find((r) => r.original.id === student.id);
                    return row ? (
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
                    ) : null;
                  })}
                {students.filter((student) => student.status === 'completed')
                  .length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No completed students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
