'use client';

import React from 'react';

import { useState } from 'react';
import {
	ArrowUpDown,
	CheckCircle,
	Download,
	Eye,
	Filter,
	MoreHorizontal,
	PlusCircle,
	SlidersHorizontal,
	Trash2,
	XCircle,
} from 'lucide-react';

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
import { toast } from 'sonner';

// Sample course data
const courses = [
	{
		id: 'c1',
		title: 'JavaScript Fundamentals',
		instructor: 'Jane Doe',
		instructorId: 'i1',
		category: 'Programming',
		categoryId: 'cat1',
		price: 49.99,
		status: 'published',
		students: 1245,
		rating: 4.8,
		lastUpdated: '2023-12-15',
		featured: true,
	},
	{
		id: 'c2',
		title: 'Advanced React Patterns',
		instructor: 'John Smith',
		instructorId: 'i2',
		category: 'Web Development',
		categoryId: 'cat2',
		price: 79.99,
		status: 'published',
		students: 892,
		rating: 4.9,
		lastUpdated: '2024-01-10',
		featured: true,
	},
	{
		id: 'c3',
		title: 'Introduction to Python',
		instructor: 'Michael Johnson',
		instructorId: 'i3',
		category: 'Programming',
		categoryId: 'cat1',
		price: 39.99,
		status: 'published',
		students: 2103,
		rating: 4.7,
		lastUpdated: '2023-11-05',
		featured: false,
	},
	{
		id: 'c4',
		title: 'UI/UX Design Principles',
		instructor: 'Sarah Williams',
		instructorId: 'i4',
		category: 'Design',
		categoryId: 'cat3',
		price: 59.99,
		status: 'pending',
		students: 0,
		rating: 0,
		lastUpdated: '2024-02-01',
		featured: false,
	},
	{
		id: 'c5',
		title: 'Data Science with R',
		instructor: 'David Brown',
		instructorId: 'i5',
		category: 'Data Science',
		categoryId: 'cat4',
		price: 69.99,
		status: 'draft',
		students: 0,
		rating: 0,
		lastUpdated: '2024-01-25',
		featured: false,
	},
	{
		id: 'c6',
		title: 'Machine Learning Fundamentals',
		instructor: 'Emily Davis',
		instructorId: 'i6',
		category: 'Data Science',
		categoryId: 'cat4',
		price: 89.99,
		status: 'published',
		students: 756,
		rating: 4.6,
		lastUpdated: '2023-10-20',
		featured: false,
	},
	{
		id: 'c7',
		title: 'Full Stack Development with MERN',
		instructor: 'Robert Wilson',
		instructorId: 'i7',
		category: 'Web Development',
		categoryId: 'cat2',
		price: 99.99,
		status: 'published',
		students: 1032,
		rating: 4.8,
		lastUpdated: '2023-12-05',
		featured: true,
	},
	{
		id: 'c8',
		title: 'iOS App Development with Swift',
		instructor: 'Jennifer Lee',
		instructorId: 'i8',
		category: 'Mobile Development',
		categoryId: 'cat5',
		price: 79.99,
		status: 'pending',
		students: 0,
		rating: 0,
		lastUpdated: '2024-01-30',
		featured: false,
	},
	{
		id: 'c9',
		title: 'Cybersecurity Essentials',
		instructor: 'Thomas Clark',
		instructorId: 'i9',
		category: 'Security',
		categoryId: 'cat6',
		price: 69.99,
		status: 'rejected',
		students: 0,
		rating: 0,
		lastUpdated: '2024-01-15',
		featured: false,
	},
	{
		id: 'c10',
		title: 'Cloud Computing with AWS',
		instructor: 'Lisa Anderson',
		instructorId: 'i10',
		category: 'Cloud Computing',
		categoryId: 'cat7',
		price: 89.99,
		status: 'published',
		students: 645,
		rating: 4.5,
		lastUpdated: '2023-11-25',
		featured: false,
	},
];

// Define the columns for the table
const columns: ColumnDef<(typeof courses)[0]>[] = [
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
		accessorKey: 'title',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<div className="font-medium">{row.getValue('title')}</div>
				{row.original.featured && (
					<Badge variant="outline" className="ml-2">
						Featured
					</Badge>
				)}
			</div>
		),
	},
	{
		accessorKey: 'instructor',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Instructor
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<Link
				to={`/dashboard/admin/instructors/${row.original.instructorId}`}
				className="text-primary hover:underline"
			>
				{row.getValue('instructor')}
			</Link>
		),
	},
	{
		accessorKey: 'category',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Category
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<Link
				to={`/dashboard/admin/categories/${row.original.categoryId}`}
				className="text-primary hover:underline"
			>
				{row.getValue('category')}
			</Link>
		),
	},
	{
		accessorKey: 'price',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Price
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const price = Number.parseFloat(row.getValue('price'));
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(price);
			return <div>{formatted}</div>;
		},
	},
	{
		accessorKey: 'students',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Students
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const students = Number.parseInt(row.getValue('students'));
			return <div className="text-right">{students.toLocaleString()}</div>;
		},
	},
	{
		accessorKey: 'rating',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Rating
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const rating = Number.parseFloat(row.getValue('rating'));
			return (
				<div className="text-right">
					{rating > 0 ? rating.toFixed(1) : 'N/A'}
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
				<div className="flex justify-center">
					<Badge
						variant={
							status === 'published'
								? 'default'
								: status === 'pending'
									? 'secondary'
									: status === 'rejected'
										? 'destructive'
										: 'outline'
						}
					>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</Badge>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: 'lastUpdated',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Last Updated
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = new Date(row.getValue('lastUpdated'));
			return <div>{date.toLocaleDateString()}</div>;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const course = row.original;
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
							<Link to={`/dashboard/admin/courses/${course.id}`}>
								<Eye className="mr-2 h-4 w-4" />
								View Details
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						{course.status === 'pending' && (
							<>
								<DropdownMenuItem
									onClick={() => {
										// toast({
										// 	title: 'Course Approved',
										// 	description: `${course.title} has been approved and published.`,
										// });
										toast.success(
											`Course ${course.title} has been approved and published.`,
										);
									}}
								>
									<CheckCircle className="mr-2 h-4 w-4" />
									Approve
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										// toast({
										// 	title: 'Course Rejected',
										// 	description: `${course.title} has been rejected.`,
										// 	variant: 'destructive',
										// });
										toast.error(`Course ${course.title} has been rejected.`);
									}}
								>
									<XCircle className="mr-2 h-4 w-4" />
									Reject
								</DropdownMenuItem>
								<DropdownMenuSeparator />
							</>
						)}
						<DropdownMenuItem
							onClick={() => {
								// toast({
								// 	title: course.featured
								// 		? 'Removed from Featured'
								// 		: 'Added to Featured',
								// 	description: `${course.title} has been ${
								// 		course.featured ? 'removed from' : 'added to'
								// 	} featured courses.`,
								// });
								toast.success(
									`Course ${course.title} has been ${
										course.featured ? 'removed from' : 'added to'
									} featured courses.`,
								);
							}}
						>
							{course.featured ? 'Remove from Featured' : 'Add to Featured'}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								// toast({
								// 	title: 'Course Deleted',
								// 	description: `${course.title} has been deleted.`,
								// 	variant: 'destructive',
								// });
								toast.error(`Course ${course.title} has been deleted.`);
							}}
							className="text-destructive focus:text-destructive"
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

export default function CoursesPage() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState({});
	const [statusFilter, setStatusFilter] = useState<string[]>([]);

	// Create the table instance
	const table = useReactTable({
		data: courses,
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
	React.useEffect(() => {
		if (statusFilter.length > 0) {
			table.getColumn('status')?.setFilterValue(statusFilter);
		} else {
			table.getColumn('status')?.setFilterValue(undefined);
		}
	}, [statusFilter, table]);

	// Calculate stats
	const totalCourses = courses.length;
	const publishedCourses = courses.filter(
		(course) => course.status === 'published',
	).length;
	const pendingCourses = courses.filter(
		(course) => course.status === 'pending',
	).length;
	const featuredCourses = courses.filter((course) => course.featured).length;
	const totalStudents = courses.reduce(
		(sum, course) => sum + course.students,
		0,
	);
	const averageRating =
		courses
			.filter((course) => course.rating > 0)
			.reduce((sum, course) => sum + course.rating, 0) /
		courses.filter((course) => course.rating > 0).length;

	return (
		<div className="flex-1 space-y-4 p-6 md:p-8">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Courses</h2>
					<p className="text-muted-foreground">
						Manage and monitor all courses on the platform
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button asChild>
						<Link to="/dashboard/admin/courses/create">
							<PlusCircle className="mr-2 h-4 w-4" />
							Add Course
						</Link>
					</Button>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Courses</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalCourses}</div>
						<p className="text-muted-foreground text-xs">
							Across all categories and instructors
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Published Courses
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{publishedCourses}</div>
						<p className="text-muted-foreground text-xs">
							{((publishedCourses / totalCourses) * 100).toFixed(1)}% of total
							courses
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Students
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{totalStudents.toLocaleString()}
						</div>
						<p className="text-muted-foreground text-xs">
							{(totalStudents / publishedCourses).toFixed(1)} students per
							course avg.
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Average Rating
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
						<p className="text-muted-foreground text-xs">
							Across {publishedCourses} published courses
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="all" className="space-y-4">
				<div className="flex items-center justify-between">
					<TabsList>
						<TabsTrigger value="all">All Courses</TabsTrigger>
						<TabsTrigger value="published">Published</TabsTrigger>
						<TabsTrigger value="pending">Pending Review</TabsTrigger>
						<TabsTrigger value="featured">Featured</TabsTrigger>
					</TabsList>
					<div className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									<Filter className="mr-2 h-4 w-4" />
									Filter
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-[200px]">
								<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => handleStatusFilter('published')}
									className="flex items-center gap-2"
								>
									<Checkbox
										checked={statusFilter.includes('published')}
										onCheckedChange={() => {}}
									/>
									<span>Published</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleStatusFilter('pending')}
									className="flex items-center gap-2"
								>
									<Checkbox
										checked={statusFilter.includes('pending')}
										onCheckedChange={() => {}}
									/>
									<span>Pending</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleStatusFilter('draft')}
									className="flex items-center gap-2"
								>
									<Checkbox
										checked={statusFilter.includes('draft')}
										onCheckedChange={() => {}}
									/>
									<span>Draft</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleStatusFilter('rejected')}
									className="flex items-center gap-2"
								>
									<Checkbox
										checked={statusFilter.includes('rejected')}
										onCheckedChange={() => {}}
									/>
									<span>Rejected</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setStatusFilter([])}
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
						<Input
							placeholder="Search courses..."
							value={
								(table.getColumn('title')?.getFilterValue() as string) ?? ''
							}
							onChange={(event) =>
								table.getColumn('title')?.setFilterValue(event.target.value)
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
											No courses found.
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

				<TabsContent value="published" className="space-y-4">
					{/* Similar content as "all" tab but filtered for published courses */}
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
								{courses
									.filter((course) => course.status === 'published')
									.map((course) => {
										const row = table
											.getRowModel()
											.rows.find((r) => r.original.id === course.id);
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
								{courses.filter((course) => course.status === 'published')
									.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No published courses found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</TabsContent>

				<TabsContent value="pending" className="space-y-4">
					{/* Similar content as "all" tab but filtered for pending courses */}
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
								{courses
									.filter((course) => course.status === 'pending')
									.map((course) => {
										const row = table
											.getRowModel()
											.rows.find((r) => r.original.id === course.id);
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
								{courses.filter((course) => course.status === 'pending')
									.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No pending courses found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</TabsContent>

				<TabsContent value="featured" className="space-y-4">
					{/* Similar content as "all" tab but filtered for featured courses */}
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
								{courses
									.filter((course) => course.featured)
									.map((course) => {
										const row = table
											.getRowModel()
											.rows.find((r) => r.original.id === course.id);
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
								{courses.filter((course) => course.featured).length === 0 && (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No featured courses found.
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
