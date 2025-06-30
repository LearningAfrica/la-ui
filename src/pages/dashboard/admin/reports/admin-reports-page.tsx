import { useState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle, Eye, MoreHorizontal, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Mock data for reports
const initialReports = [
  {
    id: '1',
    type: 'content',
    course: 'JavaScript Basics',
    courseId: 'course-1',
    reporter: 'John Doe',
    reporterId: 'user-1',
    reason: 'Outdated content in Module 3',
    details:
      'The JavaScript syntax shown in Module 3 is outdated and no longer recommended practice.',
    date: '2024-02-02',
    status: 'open',
  },
  {
    id: '2',
    type: 'technical',
    course: 'Python for Data Science',
    courseId: 'course-2',
    reporter: 'Sarah Williams',
    reporterId: 'user-2',
    reason: 'Videos not loading in Chrome',
    details:
      'Unable to play videos in Chrome browser. Works fine in Firefox and Edge.',
    date: '2024-02-04',
    status: 'investigating',
  },
  {
    id: '3',
    type: 'inappropriate',
    course: 'Public Speaking',
    courseId: 'course-3',
    reporter: 'Michael Johnson',
    reporterId: 'user-3',
    reason: 'Inappropriate language in lecture 5',
    details:
      'The instructor uses inappropriate language around the 12:30 mark in lecture 5.',
    date: '2024-02-05',
    status: 'open',
  },
  {
    id: '4',
    type: 'copyright',
    course: 'Digital Photography',
    courseId: 'course-4',
    reporter: 'Emily Davis',
    reporterId: 'user-4',
    reason: 'Copyright infringement in course materials',
    details:
      'The images used in lecture 8 appear to be copyrighted without proper attribution.',
    date: '2024-02-06',
    status: 'open',
  },
  {
    id: '5',
    type: 'technical',
    course: 'React Native for Beginners',
    courseId: 'course-5',
    reporter: 'David Kim',
    reporterId: 'user-5',
    reason: 'Code examples not working',
    details:
      "The code examples in Module 4 don't work with the latest version of React Native.",
    date: '2024-02-07',
    status: 'investigating',
  },
  {
    id: '6',
    type: 'content',
    course: 'Machine Learning A-Z',
    courseId: 'course-6',
    reporter: 'Lisa Chen',
    reporterId: 'user-6',
    reason: 'Incorrect information in Module 7',
    details:
      'The explanation of gradient descent in Module 7 contains mathematical errors.',
    date: '2024-02-01',
    status: 'resolved',
    resolution: 'Content updated with correct mathematical formulas.',
  },
  {
    id: '7',
    type: 'technical',
    course: 'Advanced Excel',
    courseId: 'course-7',
    reporter: 'Robert Taylor',
    reporterId: 'user-7',
    reason: 'Download links broken',
    details: 'Unable to download the exercise files for Module 5.',
    date: '2024-01-28',
    status: 'resolved',
    resolution:
      'Fixed broken download links and added alternative download method.',
  },
  {
    id: '8',
    type: 'inappropriate',
    course: 'Business Communication',
    courseId: 'course-8',
    reporter: 'Jennifer Lopez',
    reporterId: 'user-8',
    reason: 'Offensive content in lecture 3',
    details:
      'The examples used in lecture 3 contain culturally insensitive material.',
    date: '2024-01-25',
    status: 'dismissed',
    resolution: 'Content reviewed and found to be within platform guidelines.',
  },
];

export default function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(initialReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('open');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolution, setResolution] = useState('');

  // Filter reports based on search query and active tab
  const filteredReports = reports.filter(
    (report) =>
      (report.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.type.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeTab === 'all' || report.status === activeTab),
  );

  // Handle report resolution
  const handleResolveReport = (id: string) => {
    setSelectedReport(id);
    setResolution('');
    setIsResolveDialogOpen(true);
  };

  const confirmResolve = () => {
    if (selectedReport && resolution.trim()) {
      setReports(
        reports.map((report) =>
          report.id === selectedReport
            ? { ...report, status: 'resolved', resolution: resolution.trim() }
            : report,
        ),
      );
      toast.success('Report marked as resolved');
      setSelectedReport(null);
      setResolution('');
      setIsResolveDialogOpen(false);
    }
  };

  // Count reports by status
  const openCount = reports.filter((report) => report.status === 'open').length;
  const investigatingCount = reports.filter(
    (report) => report.status === 'investigating',
  ).length;
  const resolvedCount = reports.filter(
    (report) => report.status === 'resolved',
  ).length;
  const dismissedCount = reports.filter(
    (report) => report.status === 'dismissed',
  ).length;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Manage user reports and issues
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Reports</CardTitle>
          <CardDescription>
            Review and address reports submitted by users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            defaultValue="open"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="open">
                Open{' '}
                <Badge className="ml-2 bg-red-100 text-red-800">
                  {openCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="investigating">
                Investigating{' '}
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                  {investigatingCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved{' '}
                <Badge className="ml-2 bg-green-100 text-green-800">
                  {resolvedCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="dismissed">
                Dismissed{' '}
                <Badge className="ml-2 bg-gray-100 text-gray-800">
                  {dismissedCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Type
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Reporter
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Date
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No reports found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                <Link
                                  to={`/dashboard/admin/courses/${report.courseId}`}
                                  className="text-primary hover:underline"
                                >
                                  {report.course}
                                </Link>
                              </div>
                              <div className="text-muted-foreground line-clamp-1 text-sm">
                                {report.reason}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden capitalize md:table-cell">
                            <Badge
                              variant="outline"
                              className={
                                report.type === 'inappropriate'
                                  ? 'border-red-200 bg-red-50 text-red-700'
                                  : report.type === 'technical'
                                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                                    : report.type === 'copyright'
                                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                                      : 'border-gray-200 bg-gray-50 text-gray-700'
                              }
                            >
                              {report.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Link
                              to={`/dashboard/admin/users/${report.reporterId}`}
                              className="text-primary hover:underline"
                            >
                              {report.reporter}
                            </Link>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {report.date}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                report.status === 'open'
                                  ? 'bg-red-100 text-red-800'
                                  : report.status === 'investigating'
                                    ? 'bg-blue-100 text-blue-800'
                                    : report.status === 'resolved'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {report.status.charAt(0).toUpperCase() +
                                report.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/admin/reports/${report.id}`,
                                    )
                                  }
                                >
                                  <Eye className="mr-2 h-4 w-4" /> View details
                                </DropdownMenuItem>
                                {(report.status === 'open' ||
                                  report.status === 'investigating') && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleResolveReport(report.id)
                                      }
                                      className="text-green-600"
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />{' '}
                                      Mark as resolved
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {report.status === 'resolved' &&
                                  report.resolution && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuLabel className="text-muted-foreground text-xs font-normal normal-case">
                                        Resolution: {report.resolution}
                                      </DropdownMenuLabel>
                                    </>
                                  )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Resolve Dialog */}
      <AlertDialog
        open={isResolveDialogOpen}
        onOpenChange={setIsResolveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resolve Report</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide details on how this report was resolved. This
              information will be recorded for administrative purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mb-4">
            <Input
              placeholder="Resolution details"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResolve}
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={!resolution.trim()}
            >
              Mark as Resolved
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
