import { useState } from 'react';
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
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash,
  User,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Define the Student type
type Student = {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
  lastActive: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
};

export default function StudentsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Fetch students data
  const {
    data: students = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      // In a real app, this would be an API call
      return new Promise<Student[]>((resolve) => {
        setTimeout(() => {
          // Generate mock data
          const mockStudents: Student[] = Array.from(
            { length: 50 },
            (_, i) => ({
              id: `STU${1000 + i}`,
              name: `Student ${i + 1}`,
              email: `student${i + 1}@example.com`,
              enrolledCourses: Math.floor(Math.random() * 10) + 1,
              lastActive: new Date(
                Date.now() -
                  Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
              )
                .toISOString()
                .split('T')[0],
              joinDate: new Date(
                Date.now() -
                  Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
              )
                .toISOString()
                .split('T')[0],
              status: ['active', 'inactive', 'suspended'][
                Math.floor(Math.random() * 3)
              ] as 'active' | 'inactive' | 'suspended',
            }),
          );
          resolve(mockStudents);
        }, 500);
      });
    },
  });

  // Define table columns
  const columns: ColumnDef<Student>[] = [
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
      header: 'Student',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`/abstract-geometric-shapes.png?height=32&width=32&query=${row.original.name}`}
              alt={row.original.name}
            />
            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.original.name}</div>
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
    },
    {
      accessorKey: 'enrolledCourses',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Courses
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.original.enrolledCourses}</div>
      ),
    },
    {
      accessorKey: 'lastActive',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Last Active
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'joinDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Join Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === 'active'
                ? 'default'
                : status === 'inactive'
                  ? 'outline'
                  : 'destructive'
            }
            className="capitalize"
          >
            {status}
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
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/admin/students/${student.id}`}>
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // toast({
                  // 	title: 'Email sent',
                  // 	description: `Email sent to ${student.email}`,
                  // });
                  toast.success(`Email sent to ${student.email}`, {
                    duration: 3000,
                  });
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Contact Student
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // toast({
                  // 	title: 'Status updated',
                  // 	description: `${student.name}'s status has been changed.`,
                  // });
                  toast.success(`${student.name}'s status has been changed.`, {
                    duration: 3000,
                  });
                }}
                className={
                  student.status === 'active'
                    ? 'text-destructive'
                    : 'text-green-600'
                }
              >
                {student.status === 'active' ? (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Suspend Account
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Activate Account
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // toast({
                  // 	title: 'Student deleted',
                  // 	description: `${student.name}'s account has been deleted.`,
                  // 	variant: 'destructive',
                  // });
                  toast.error(`${student.name}'s account has been deleted.`, {
                    duration: 3000,
                  });
                }}
                className="text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Initialize the table
  const table = useReactTable({
    data: students,
    columns,
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

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(
    (student) => student.status === 'active',
  ).length;
  const inactiveStudents = students.filter(
    (student) => student.status === 'inactive',
  ).length;
  const suspendedStudents = students.filter(
    (student) => student.status === 'suspended',
  ).length;

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage and monitor all students in the system.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/dashboard/admin/students/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <User className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-muted-foreground text-xs">
              All registered students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <User className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
            <p className="text-muted-foreground text-xs">
              {((activeStudents / totalStudents) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Students
            </CardTitle>
            <User className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveStudents}</div>
            <p className="text-muted-foreground text-xs">
              {((inactiveStudents / totalStudents) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Suspended Students
            </CardTitle>
            <Shield className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suspendedStudents}</div>
            <p className="text-muted-foreground text-xs">
              {((suspendedStudents / totalStudents) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>
            View and manage all students in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    className="pl-8"
                    value={
                      (table.getColumn('name')?.getFilterValue() as string) ??
                      ''
                    }
                    onChange={(event) =>
                      table
                        .getColumn('name')
                        ?.setFilterValue(event.target.value)
                    }
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={
                        table.getColumn('status')?.getFilterValue() ===
                          undefined ||
                        (
                          table
                            .getColumn('status')
                            ?.getFilterValue() as string[]
                        )?.includes('active')
                      }
                      onCheckedChange={(checked) => {
                        const filterValues =
                          (table
                            .getColumn('status')
                            ?.getFilterValue() as string[]) || [];
                        if (checked) {
                          table
                            .getColumn('status')
                            ?.setFilterValue([...filterValues, 'active']);
                        } else {
                          table
                            .getColumn('status')
                            ?.setFilterValue(
                              filterValues.filter(
                                (value) => value !== 'active',
                              ),
                            );
                        }
                      }}
                    >
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={
                        table.getColumn('status')?.getFilterValue() ===
                          undefined ||
                        (
                          table
                            .getColumn('status')
                            ?.getFilterValue() as string[]
                        )?.includes('inactive')
                      }
                      onCheckedChange={(checked) => {
                        const filterValues =
                          (table
                            .getColumn('status')
                            ?.getFilterValue() as string[]) || [];
                        if (checked) {
                          table
                            .getColumn('status')
                            ?.setFilterValue([...filterValues, 'inactive']);
                        } else {
                          table
                            .getColumn('status')
                            ?.setFilterValue(
                              filterValues.filter(
                                (value) => value !== 'inactive',
                              ),
                            );
                        }
                      }}
                    >
                      Inactive
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={
                        table.getColumn('status')?.getFilterValue() ===
                          undefined ||
                        (
                          table
                            .getColumn('status')
                            ?.getFilterValue() as string[]
                        )?.includes('suspended')
                      }
                      onCheckedChange={(checked) => {
                        const filterValues =
                          (table
                            .getColumn('status')
                            ?.getFilterValue() as string[]) || [];
                        if (checked) {
                          table
                            .getColumn('status')
                            ?.setFilterValue([...filterValues, 'suspended']);
                        } else {
                          table
                            .getColumn('status')
                            ?.setFilterValue(
                              filterValues.filter(
                                (value) => value !== 'suspended',
                              ),
                            );
                        }
                      }}
                    >
                      Suspended
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        table.getColumn('status')?.setFilterValue(undefined);
                      }}
                    >
                      Clear Filters
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Columns
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // toast({
                    // 	title: 'Export Data',
                    // 	description: 'Student data has been exported to CSV.',
                    // });
                    toast.success('Student data has been exported to CSV.', {
                      duration: 3000,
                    });
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (Object.keys(rowSelection).length > 0) {
                      // toast({
                      // 	title: 'Bulk Action',
                      // 	description: `Action applied to ${Object.keys(rowSelection).length} selected students.`,
                      // });
                      toast.success(
                        `Action applied to ${Object.keys(rowSelection).length} selected students.`,
                        {
                          duration: 3000,
                        },
                      );
                      setRowSelection({});
                    } else {
                      // toast({
                      // 	title: 'No Selection',
                      // 	description:
                      // 		'Please select students to perform bulk actions.',
                      // 	variant: 'destructive',
                      // });
                      toast.error(
                        'Please select students to perform bulk actions.',
                        {
                          duration: 3000,
                        },
                      );
                    }
                  }}
                >
                  Bulk Actions
                </Button>
              </div>
            </div>
            <Separator />
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
                        {isLoading ? 'Loading...' : 'No students found.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
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
        </CardFooter>
      </Card>
    </div>
  );
}
