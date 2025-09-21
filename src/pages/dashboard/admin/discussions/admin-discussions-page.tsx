import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  useNavigate,
  Link,
  useSearchParams,
} from 'react-router-dom';
import {
  ArrowUpDown,
  ChevronDown,
  Flag,
  MessageCircle,
  MoreHorizontal,
  Search,
  Shield,
  X,
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

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdvancedSearchDialog } from '@/components/discussions/advanced-search-dialog';
import { toast } from 'sonner';

// Types
type Discussion = {
  id: string;
  title: string;
  course: {
    id: string;
    title: string;
  };
  student: {
    id: string;
    name: string;
    image?: string;
  };
  instructor?: {
    id: string;
    name: string;
    image?: string;
  };
  status: 'open' | 'resolved' | 'flagged' | 'archived';
  messageCount: number;
  lastActivity: string;
  created: string;
  isPrivate: boolean;
  hasAttachments?: boolean;
  hasFlaggedContent?: boolean;
};

type FlaggedContent = {
  id: string;
  discussionId: string;
  discussionTitle: string;
  content: string;
  reporter: {
    id: string;
    name: string;
    role: 'student' | 'instructor' | 'admin';
  };
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  reportedAt: string;
};

// Sample data
const discussionsData: Discussion[] = [
  {
    id: 'disc-1',
    title: 'Question about JavaScript Promises',
    course: {
      id: 'course-1',
      title: 'Advanced JavaScript',
    },
    student: {
      id: 'student-1',
      name: 'John Smith',
      image: '/placeholder.svg?height=40&width=40',
    },
    instructor: {
      id: 'instructor-1',
      name: 'Jane Doe',
      image: '/placeholder.svg?height=40&width=40',
    },
    status: 'open',
    messageCount: 5,
    lastActivity: '2024-04-18T14:30:00',
    created: '2024-04-15T10:15:00',
    isPrivate: false,
    hasAttachments: false,
  },
  {
    id: 'disc-2',
    title: 'Help with React Hooks implementation',
    course: {
      id: 'course-2',
      title: 'React Fundamentals',
    },
    student: {
      id: 'student-2',
      name: 'Emily Johnson',
      image: '/placeholder.svg?height=40&width=40',
    },
    instructor: {
      id: 'instructor-2',
      name: 'Michael Brown',
      image: '/placeholder.svg?height=40&width=40',
    },
    status: 'resolved',
    messageCount: 8,
    lastActivity: '2024-04-17T16:45:00',
    created: '2024-04-14T09:30:00',
    isPrivate: false,
    hasAttachments: true,
  },
  {
    id: 'disc-3',
    title: 'Clarification on CSS Grid layout',
    course: {
      id: 'course-3',
      title: 'Modern CSS Techniques',
    },
    student: {
      id: 'student-3',
      name: 'David Wilson',
      image: '/placeholder.svg?height=40&width=40',
    },
    status: 'flagged',
    messageCount: 3,
    lastActivity: '2024-04-19T11:20:00',
    created: '2024-04-19T09:10:00',
    isPrivate: false,
    hasFlaggedContent: true,
  },
  {
    id: 'disc-4',
    title: 'Private: Grade dispute for final project',
    course: {
      id: 'course-1',
      title: 'Advanced JavaScript',
    },
    student: {
      id: 'student-4',
      name: 'Sarah Miller',
      image: '/placeholder.svg?height=40&width=40',
    },
    instructor: {
      id: 'instructor-1',
      name: 'Jane Doe',
      image: '/placeholder.svg?height=40&width=40',
    },
    status: 'open',
    messageCount: 4,
    lastActivity: '2024-04-18T13:15:00',
    created: '2024-04-17T15:30:00',
    isPrivate: true,
  },
  {
    id: 'disc-5',
    title: 'Node.js deployment issues',
    course: {
      id: 'course-4',
      title: 'Backend Development with Node.js',
    },
    student: {
      id: 'student-5',
      name: 'Robert Chen',
      image: '/placeholder.svg?height=40&width=40',
    },
    instructor: {
      id: 'instructor-3',
      name: 'Lisa Wang',
      image: '/placeholder.svg?height=40&width=40',
    },
    status: 'archived',
    messageCount: 12,
    lastActivity: '2024-04-10T09:45:00',
    created: '2024-04-05T14:20:00',
    isPrivate: false,
    hasAttachments: true,
  },
  {
    id: 'disc-6',
    title: 'Feedback on UI/UX assignment',
    course: {
      id: 'course-5',
      title: 'UI/UX Design Principles',
    },
    student: {
      id: 'student-6',
      name: 'Amanda Taylor',
      image: '/placeholder.svg?height=40&width=40',
    },
    status: 'open',
    messageCount: 2,
    lastActivity: '2024-04-19T10:30:00',
    created: '2024-04-19T09:15:00',
    isPrivate: false,
  },
  {
    id: 'disc-7',
    title: 'Private: Accommodation request',
    course: {
      id: 'course-2',
      title: 'React Fundamentals',
    },
    student: {
      id: 'student-7',
      name: 'James Wilson',
      image: '/placeholder.svg?height=40&width=40',
    },
    instructor: {
      id: 'instructor-2',
      name: 'Michael Brown',
      image: '/placeholder.svg?height=40&width=40',
    },
    status: 'resolved',
    messageCount: 6,
    lastActivity: '2024-04-16T11:20:00',
    created: '2024-04-14T13:45:00',
    isPrivate: true,
  },
];

const flaggedContentData: FlaggedContent[] = [
  {
    id: 'flag-1',
    discussionId: 'disc-3',
    discussionTitle: 'Clarification on CSS Grid layout',
    content:
      'This content contains inappropriate language that violates community guidelines.',
    reporter: {
      id: 'student-2',
      name: 'Emily Johnson',
      role: 'student',
    },
    reason: 'Inappropriate language',
    status: 'pending',
    reportedAt: '2024-04-19T11:30:00',
  },
  {
    id: 'flag-2',
    discussionId: 'disc-8',
    discussionTitle: 'Python Data Structures Question',
    content: 'This message contains spam links to external websites.',
    reporter: {
      id: 'instructor-3',
      name: 'Lisa Wang',
      role: 'instructor',
    },
    reason: 'Spam content',
    status: 'reviewed',
    reportedAt: '2024-04-18T09:15:00',
  },
  {
    id: 'flag-3',
    discussionId: 'disc-9',
    discussionTitle: 'Database Normalization Help',
    content:
      'This message contains personally identifiable information that should not be shared.',
    reporter: {
      id: 'admin-1',
      name: 'Admin User',
      role: 'admin',
    },
    reason: 'Personal information',
    status: 'dismissed',
    reportedAt: '2024-04-17T14:20:00',
  },
];

// Table columns for discussions
const discussionsColumns: ColumnDef<Discussion>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
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
    header: 'Discussion',
    cell: ({ row }) => {
      const discussion = row.original;
      return (
        <div className="flex flex-col">
          <Link
            to={`/dashboard/admin/discussions/${discussion.id}`}
            className="cursor-pointer font-medium hover:underline"
          >
            {discussion.isPrivate && (
              <span className="text-muted-foreground mr-1">[Private]</span>
            )}
            {discussion.title}
          </Link>
          <div className="text-muted-foreground text-xs">
            {new Date(discussion.created).toLocaleDateString()}
          </div>
          <div className="mt-1 flex gap-1">
            {discussion.hasAttachments && (
              <Badge variant="outline" className="text-xs">
                Attachments
              </Badge>
            )}
            {discussion.hasFlaggedContent && (
              <Badge variant="destructive" className="text-xs">
                Flagged
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'course.title',
    header: 'Course',
    cell: ({ row }) => {
      const course = row.original.course;
      return (
        <Link
          to={`/dashboard/admin/courses/${course.id}`}
          className="hover:underline"
        >
          {course.title}
        </Link>
      );
    },
  },
  {
    accessorKey: 'student.name',
    header: 'Student',
    cell: ({ row }) => {
      const student = row.original.student;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={student.image || '/placeholder.svg'}
              alt={student.name}
            />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Link
            to={`/dashboard/admin/students/${student.id}`}
            className="hover:underline"
          >
            {student.name}
          </Link>
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
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === 'open'
              ? 'default'
              : status === 'resolved'
                ? 'secondary'
                : status === 'flagged'
                  ? 'destructive'
                  : 'outline'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'messageCount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Messages
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original.messageCount}
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
      return (
        <div className="text-sm">
          {new Date(row.original.lastActivity).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const discussion = row.original;
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
              <Link to={`/dashboard/admin/discussions/${discussion.id}`}>
                View details
              </Link>
            </DropdownMenuItem>
            {discussion.status !== 'resolved' && (
              <DropdownMenuItem
                onClick={() => {
                  //   toast({
                  //     title: "Discussion marked as resolved",
                  //     description: `"${discussion.title}" has been marked as resolved.`,
                  //   })
                  toast.success(
                    `"${discussion.title}" has been marked as resolved.`,
                    {
                      duration: 3000,
                      icon: <Shield className="h-4 w-4" />,
                    },
                  );
                }}
              >
                Mark as resolved
              </DropdownMenuItem>
            )}
            {discussion.status !== 'flagged' && (
              <DropdownMenuItem
                onClick={() => {
                  //   toast({
                  //     title: "Discussion flagged",
                  //     description: `"${discussion.title}" has been flagged for review.`,
                  //   })
                  toast.error(
                    `"${discussion.title}" has been flagged for review.`,
                    {
                      duration: 3000,
                      icon: <Flag className="h-4 w-4" />,
                    },
                  );
                }}
              >
                Flag for review
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // toast({
                //   title: "Discussion archived",
                //   description: `"${discussion.title}" has been archived.`,
                //   variant: "default",
                // })
                toast(`"${discussion.title}" has been archived.`, {
                  duration: 3000,
                  icon: <MessageCircle className="h-4 w-4" />,
                });
              }}
            >
              Archive discussion
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                // toast({
                //   title: "Discussion deleted",
                //   description: `"${discussion.title}" has been deleted.`,
                //   variant: "destructive",
                // })
                toast.error(`"${discussion.title}" has been deleted.`, {
                  duration: 3000,
                  icon: <X className="h-4 w-4" />,
                });
              }}
            >
              Delete discussion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Table columns for flagged content
const flaggedContentColumns: ColumnDef<FlaggedContent>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
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
    accessorKey: 'discussionTitle',
    header: 'Discussion',
    cell: ({ row }) => {
      const flagged = row.original;
      return (
        <div className="flex flex-col">
          <Link
            to={`/dashboard/admin/discussions/${flagged.discussionId}`}
            className="font-medium hover:underline"
          >
            {flagged.discussionTitle}
          </Link>
          <div className="text-muted-foreground text-xs">
            {new Date(flagged.reportedAt).toLocaleDateString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'content',
    header: 'Flagged Content',
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px] truncate">{row.original.content}</div>
      );
    },
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => {
      return <div>{row.original.reason}</div>;
    },
  },
  {
    accessorKey: 'reporter.name',
    header: 'Reported By',
    cell: ({ row }) => {
      const reporter = row.original.reporter;
      return (
        <div className="flex items-center gap-1">
          <span>{reporter.name}</span>
          <Badge variant="outline" className="ml-1">
            {reporter.role}
          </Badge>
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
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === 'pending'
              ? 'default'
              : status === 'reviewed'
                ? 'secondary'
                : 'outline'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const flagged = row.original;
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
              <Link to={`/dashboard/admin/discussions/${flagged.discussionId}`}>
                View discussion
              </Link>
            </DropdownMenuItem>
            {flagged.status === 'pending' && (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    // toast({
                    //   title: "Content reviewed",
                    //   description: "The flagged content has been marked as reviewed.",
                    // })
                    toast.success(
                      'The flagged content has been marked as reviewed.',
                      {
                        duration: 3000,
                        icon: <Shield className="h-4 w-4" />,
                      },
                    );
                  }}
                >
                  Mark as reviewed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // toast({
                    //   title: "Flag dismissed",
                    //   description: "The flag has been dismissed.",
                    // })
                    toast.success('The flag has been dismissed.', {
                      duration: 3000,
                      icon: <X className="h-4 w-4" />,
                    });
                  }}
                >
                  Dismiss flag
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                // toast({
                //   title: "Content removed",
                //   description: "The flagged content has been removed.",
                //   variant: "destructive",
                // })
                toast.error('The flagged content has been removed.', {
                  duration: 3000,
                  icon: <X className="h-4 w-4" />,
                });
              }}
            >
              Remove content
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function DiscussionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramsString = searchParams?.toString() || '';

  const [discussionSorting, setDiscussionSorting] = useState<SortingState>([]);
  const [discussionColumnFilters, setDiscussionColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [discussionColumnVisibility, setDiscussionColumnVisibility] =
    useState<VisibilityState>({});
  const [discussionRowSelection, setDiscussionRowSelection] = useState({});

  const [flaggedSorting, setFlaggedSorting] = useState<SortingState>([]);
  const [flaggedColumnFilters, setFlaggedColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [flaggedColumnVisibility, setFlaggedColumnVisibility] =
    useState<VisibilityState>({});
  const [flaggedRowSelection, setFlaggedRowSelection] = useState({});

  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredDiscussions, setFilteredDiscussions] =
    useState(discussionsData);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  // Apply search parameters from URL
  useEffect(() => {
    if (!searchParams) return;

    const params = {
      keyword: searchParams.get('keyword'),
      status: searchParams.get('status'),
      courses: searchParams.get('courses'),
      participants: searchParams.get('participants'),
      from: searchParams.get('from'),
      to: searchParams.get('to'),
      minMessages: searchParams.get('minMessages'),
      maxMessages: searchParams.get('maxMessages'),
      isPrivate: searchParams.get('isPrivate'),
      hasAttachments: searchParams.get('hasAttachments'),
      hasFlagged: searchParams.get('hasFlagged'),
    };

    let filtered = [...discussionsData];
    const newActiveFilters: string[] = [];

    if (params.keyword) {
      const keywordLower = params.keyword.toLowerCase();
      filtered = filtered.filter((d) =>
        d.title.toLowerCase().includes(keywordLower),
      );
      newActiveFilters.push(`Keyword: ${params.keyword}`);
    }

    if (params.status && params.status !== 'all') {
      const statuses = params.status.split(',');
      filtered = filtered.filter((d) => statuses.includes(d.status));
      newActiveFilters.push(`Status: ${statuses.join(', ')}`);
    }

    if (params.courses) {
      const courseIds = params.courses.split(',');
      filtered = filtered.filter((d) => courseIds.includes(d.course.id));
      newActiveFilters.push(`${courseIds.length} course(s)`);
    }

    if (params.participants) {
      const participantIds = params.participants.split(',');
      filtered = filtered.filter(
        (d) =>
          participantIds.includes(d.student.id) ||
          (d.instructor && participantIds.includes(d.instructor.id)),
      );
      newActiveFilters.push(`${participantIds.length} participant(s)`);
    }

    if (params.from) {
      const fromDate = new Date(params.from);
      filtered = filtered.filter((d) => new Date(d.created) >= fromDate);
      newActiveFilters.push(
        `From: ${new Date(params.from).toLocaleDateString()}`,
      );
    }

    if (params.to) {
      const toDate = new Date(params.to);
      filtered = filtered.filter((d) => new Date(d.created) <= toDate);
      newActiveFilters.push(`To: ${new Date(params.to).toLocaleDateString()}`);
    }

    if (params.minMessages) {
      filtered = filtered.filter(
        (d) => d.messageCount >= Number.parseInt(params.minMessages!),
      );
      newActiveFilters.push(`Min messages: ${params.minMessages}`);
    }

    if (params.maxMessages) {
      filtered = filtered.filter(
        (d) => d.messageCount <= Number.parseInt(params.maxMessages!),
      );
      newActiveFilters.push(`Max messages: ${params.maxMessages}`);
    }

    if (params.isPrivate === 'true') {
      filtered = filtered.filter((d) => d.isPrivate);
      newActiveFilters.push('Private only');
    }

    if (params.hasAttachments === 'true') {
      filtered = filtered.filter((d) => d.hasAttachments);
      newActiveFilters.push('Has attachments');
    }

    if (params.hasFlagged === 'true') {
      filtered = filtered.filter((d) => d.hasFlaggedContent);
      newActiveFilters.push('Has flagged content');
    }

    const filteredChanged =
      JSON.stringify(filtered) !== JSON.stringify(filteredDiscussions);
    const filtersChanged =
      JSON.stringify(newActiveFilters) !== JSON.stringify(activeFilters);

    if (filteredChanged || filtersChanged) {
      setFilteredDiscussions(filtered);
      setActiveFilters(newActiveFilters);

      if (
        newActiveFilters.length > 0 &&
        filtered.length !== discussionsData.length
      ) {
        toast.success(`Search filters applied - Showing ${filtered.length} of ${discussionsData.length} discussions`);
      }
    }
  }, [paramsString]);

  const statusFilteredDiscussions = useMemo(() => {
    return statusFilter === 'all'
      ? filteredDiscussions
      : filteredDiscussions.filter(
          (discussion) => discussion.status === statusFilter,
        );
  }, [filteredDiscussions, statusFilter]);

  // Setup discussions table
  const discussionsTable = useReactTable({
    data: statusFilteredDiscussions,
    columns: discussionsColumns,
    onSortingChange: setDiscussionSorting,
    onColumnFiltersChange: setDiscussionColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setDiscussionColumnVisibility,
    onRowSelectionChange: setDiscussionRowSelection,
    state: {
      sorting: discussionSorting,
      columnFilters: discussionColumnFilters,
      columnVisibility: discussionColumnVisibility,
      rowSelection: discussionRowSelection,
    },
  });

  // Setup flagged content table
  const flaggedContentTable = useReactTable({
    data: flaggedContentData,
    columns: flaggedContentColumns,
    onSortingChange: setFlaggedSorting,
    onColumnFiltersChange: setFlaggedColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setFlaggedColumnVisibility,
    onRowSelectionChange: setFlaggedRowSelection,
    state: {
      sorting: flaggedSorting,
      columnFilters: flaggedColumnFilters,
      columnVisibility: flaggedColumnVisibility,
      rowSelection: flaggedRowSelection,
    },
  });

  // Count discussions by status
  const openCount = filteredDiscussions.filter(
    (d) => d.status === 'open',
  ).length;
  // const _resolvedCount = filteredDiscussions.filter(
  //   (d) => d.status === 'resolved',
  // ).length;
  // const _flaggedCount = filteredDiscussions.filter(
  //   (d) => d.status === 'flagged',
  // ).length;
  // const _archivedCount = filteredDiscussions.filter(
  //   (d) => d.status === 'archived',
  // ).length;
  const privateCount = filteredDiscussions.filter((d) => d.isPrivate).length;

  // Count flagged content by status
  const pendingFlags = flaggedContentData.filter(
    (f) => f.status === 'pending',
  ).length;

  // Clear all filters
  const clearAllFilters = () => {
    navigate('/dashboard/admin/discussions');
    setFilteredDiscussions(discussionsData);
    setActiveFilters([]);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    discussionsTable.getColumn('title')?.setFilterValue(e.target.value);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Discussions</h2>
          <p className="text-muted-foreground">
            Manage and moderate all discussions across the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AdvancedSearchDialog />
          <Button
            variant="outline"
            onClick={() => {
              toast.success(`Bulk action completed - Action applied to ${Object.keys(activeTab === 'all' ? discussionRowSelection : flaggedRowSelection).length} selected items.`);
              if (activeTab === 'all') {
                setDiscussionRowSelection({});
              } else {
                setFlaggedRowSelection({});
              }
            }}
            disabled={
              Object.keys(
                activeTab === 'all'
                  ? discussionRowSelection
                  : flaggedRowSelection,
              ).length === 0
            }
          >
            Bulk Actions
          </Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="bg-muted/50 rounded-md p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Search className="text-muted-foreground mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Active filters:</span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear all
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {activeFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {filter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    clearAllFilters();
                  }}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Discussions
            </CardTitle>
            <MessageCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredDiscussions.length}
            </div>
            <p className="text-muted-foreground text-xs">
              Across {new Set(filteredDiscussions.map((d) => d.course.id)).size}{' '}
              courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Discussions
            </CardTitle>
            <MessageCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openCount}</div>
            <p className="text-muted-foreground text-xs">
              {filteredDiscussions.length > 0
                ? `${Math.round((openCount / filteredDiscussions.length) * 100)}% of filtered discussions`
                : 'No discussions match filters'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Flagged Content
            </CardTitle>
            <Flag className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {flaggedContentData.length}
            </div>
            <p className="text-muted-foreground text-xs">
              {pendingFlags} pending review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Private Discussions
            </CardTitle>
            <Shield className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{privateCount}</div>
            <p className="text-muted-foreground text-xs">
              {filteredDiscussions.length > 0
                ? `${Math.round((privateCount / filteredDiscussions.length) * 100)}% of filtered discussions`
                : 'No discussions match filters'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Discussions</TabsTrigger>
            <TabsTrigger value="flagged">
              Flagged Content
              {pendingFlags > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingFlags}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Input
                placeholder="Search discussions..."
                value={searchValue}
                onChange={handleSearchChange}
                className="h-8 w-[150px] lg:w-[250px]"
              />
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="ml-auto h-8 bg-transparent"
                  >
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {discussionsTable
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
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {discussionsTable.getHeaderGroups().map((headerGroup) => (
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
                {discussionsTable.getRowModel().rows?.length ? (
                  discussionsTable.getRowModel().rows.map((row) => (
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
                      colSpan={discussionsColumns.length}
                      className="h-24 text-center"
                    >
                      No discussions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {discussionsTable.getFilteredSelectedRowModel().rows.length} of{' '}
              {discussionsTable.getFilteredRowModel().rows.length} row(s)
              selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => discussionsTable.previousPage()}
                disabled={!discussionsTable.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => discussionsTable.nextPage()}
                disabled={!discussionsTable.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Input
                placeholder="Search flagged content..."
                value={
                  (flaggedContentTable
                    .getColumn('content')
                    ?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  flaggedContentTable
                    .getColumn('content')
                    ?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
              />
              <Select
                value={
                  (flaggedContentTable
                    .getColumn('status')
                    ?.getFilterValue() as string) ?? 'all'
                }
                onValueChange={(value) =>
                  flaggedContentTable
                    .getColumn('status')
                    ?.setFilterValue(value === 'all' ? '' : value)
                }
              >
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {flaggedContentTable.getHeaderGroups().map((headerGroup) => (
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
                {flaggedContentTable.getRowModel().rows?.length ? (
                  flaggedContentTable.getRowModel().rows.map((row) => (
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
                      colSpan={flaggedContentColumns.length}
                      className="h-24 text-center"
                    >
                      No flagged content found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {flaggedContentTable.getFilteredSelectedRowModel().rows.length} of{' '}
              {flaggedContentTable.getFilteredRowModel().rows.length} row(s)
              selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => flaggedContentTable.previousPage()}
                disabled={!flaggedContentTable.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => flaggedContentTable.nextPage()}
                disabled={!flaggedContentTable.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
