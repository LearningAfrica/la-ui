import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import type { OrgUserRole } from '@/lib/validators/auth-schema';

type TrendDirection = 'up' | 'down';

type TabKey = 'overview' | 'approvals' | 'categories' | 'reports';

interface StatSummary {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  trend: TrendDirection;
}

interface PendingApproval {
  id: string;
  title: string;
  instructor: string;
  submitted: string;
  category: string;
  status: 'pending' | 'approved';
}

interface CategorySummary {
  id: string;
  name: string;
  courses: number;
  students: number;
  revenue: string;
}

interface ReportSummary {
  id: string;
  type: 'content' | 'technical' | 'inappropriate';
  course: string;
  reporter: string;
  reason: string;
  date: string;
  status: 'open' | 'investigating' | 'resolved';
}

interface DashboardContent {
  stats: StatSummary[];
  pendingApprovals: PendingApproval[];
  categories: CategorySummary[];
  reports: ReportSummary[];
}

const ADMIN_DASHBOARD_CONTENT: DashboardContent = {
  stats: [
    {
      title: 'Total Students',
      value: '5,234',
      icon: Users,
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Courses',
      value: '187',
      icon: BookOpen,
      change: '+8',
      trend: 'up',
    },
    {
      title: 'Total Revenue',
      value: '$124,500',
      icon: DollarSign,
      change: '+23%',
      trend: 'up',
    },
    {
      title: 'Course Completion',
      value: '78%',
      icon: BarChart3,
      change: '+5%',
      trend: 'up',
    },
  ],
  pendingApprovals: [
    {
      id: '1',
      title: 'Advanced React Patterns',
      instructor: 'Jane Smith',
      submitted: '2024-02-01',
      category: 'Programming',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Financial Planning Essentials',
      instructor: 'Robert Chen',
      submitted: '2024-02-03',
      category: 'Finance',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Digital Marketing Masterclass',
      instructor: 'Emily Davis',
      submitted: '2024-02-05',
      category: 'Marketing',
      status: 'pending',
    },
  ],
  categories: [
    {
      id: '1',
      name: 'Programming',
      courses: 54,
      students: 2345,
      revenue: '$54,300',
    },
    {
      id: '2',
      name: 'Data Science',
      courses: 32,
      students: 1876,
      revenue: '$42,800',
    },
    {
      id: '3',
      name: 'Design',
      courses: 28,
      students: 1543,
      revenue: '$38,600',
    },
    {
      id: '4',
      name: 'Business',
      courses: 35,
      students: 1987,
      revenue: '$49,700',
    },
  ],
  reports: [
    {
      id: '1',
      type: 'content',
      course: 'JavaScript Basics',
      reporter: 'John Doe',
      reason: 'Outdated content in Module 3',
      date: '2024-02-02',
      status: 'open',
    },
    {
      id: '2',
      type: 'technical',
      course: 'Python for Data Science',
      reporter: 'Sarah Williams',
      reason: 'Videos not loading in Chrome',
      date: '2024-02-04',
      status: 'investigating',
    },
    {
      id: '3',
      type: 'inappropriate',
      course: 'Public Speaking',
      reporter: 'Michael Johnson',
      reason: 'Inappropriate language in lecture 5',
      date: '2024-02-05',
      status: 'open',
    },
  ],
};

const ROLE_DASHBOARD_CONTENT: Partial<Record<OrgUserRole, DashboardContent>> = {
  admin: ADMIN_DASHBOARD_CONTENT,
};

export default function AdminDashboardPage() {
  const { user, getCurrentOrganization, getCurrentUserRole } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const organizationRole = useMemo<OrgUserRole | undefined>(() => {
    return getCurrentOrganization?.()?.role;
  }, [getCurrentOrganization, user?.organizations]);

  const systemRole = getCurrentUserRole?.();

  if (systemRole === 'super_admin') {
    return <Navigate to="/dashboard/super-admin" replace />;
  }

  const dashboardContent = organizationRole
    ? ROLE_DASHBOARD_CONTENT[organizationRole]
    : undefined;

  if (!dashboardContent) {
    return (
      <NonAdminDashboardMessage
        email={user?.email ?? 'there'}
        role={organizationRole}
      />
    );
  }

  const { stats, pendingApprovals, categories, reports } = dashboardContent;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}! Here's what's happening in your
            organization.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/admin/categories/create">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="bg-muted rounded-full p-2">
                    <Icon className="text-muted-foreground h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p
                    className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change} from last month
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabKey)}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="approvals">Course Approvals</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>
                  Courses waiting for your review
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingApprovals.slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="rounded-full bg-yellow-100 p-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{course.title}</p>
                      <p className="text-muted-foreground text-xs">
                        By {course.instructor} • {course.category}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Submitted: {course.submitted}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setActiveTab('approvals')}
                >
                  View All Approvals
                </Button>
              </CardFooter>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Issues reported by users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div
                      className={`rounded-full p-2 ${
                        report.type === 'inappropriate'
                          ? 'bg-red-100 text-red-600'
                          : report.type === 'technical'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{report.course}</p>
                      <p className="text-muted-foreground text-xs">
                        {report.reason}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Reported: {report.date}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setActiveTab('reports')}
                >
                  View All Reports
                </Button>
              </CardFooter>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>
                Overview of your top performing categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.slice(0, 3).map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{category.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {category.courses} courses
                      </p>
                    </div>
                    <Progress
                      value={(category.students / 3000) * 100}
                      className="h-2"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-xs">
                        {category.students.toLocaleString()} students
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Revenue: {category.revenue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setActiveTab('categories')}
              >
                View All Categories
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Approvals</CardTitle>
              <CardDescription>
                Review and approve submitted courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Course
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Instructor
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Category
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Submitted Date
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Status
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {pendingApprovals.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                      >
                        <td className="p-4 align-middle font-medium">
                          {course.title}
                        </td>
                        <td className="p-4 align-middle">
                          {course.instructor}
                        </td>
                        <td className="p-4 align-middle">{course.category}</td>
                        <td className="p-4 align-middle">{course.submitted}</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                to={`/dashboard/admin/approvals/${course.id}`}
                              >
                                Review
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-1 h-4 w-4" /> Approve
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage course categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Category
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Courses
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Students
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Revenue
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                      >
                        <td className="p-4 align-middle font-medium">
                          {category.name}
                        </td>
                        <td className="p-4 align-middle">{category.courses}</td>
                        <td className="p-4 align-middle">
                          {category.students.toLocaleString()}
                        </td>
                        <td className="p-4 align-middle">{category.revenue}</td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                to={`/dashboard/admin/categories/${category.id}`}
                              >
                                View
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                to={`/dashboard/admin/categories/${category.id}/edit`}
                              >
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Track reported issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Course
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Reporter
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Reason
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Date
                      </th>
                      <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {reports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                      >
                        <td className="p-4 align-middle font-medium">
                          {report.course}
                        </td>
                        <td className="p-4 align-middle">{report.reporter}</td>
                        <td className="p-4 align-middle">{report.reason}</td>
                        <td className="p-4 align-middle">{report.date}</td>
                        <td className="p-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {report.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NonAdminDashboardMessage({
  email,
  role,
}: {
  email: string;
  role?: OrgUserRole;
}) {
  return (
    <div className="flex-1 p-6 md:p-8">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Dashboard Access</CardTitle>
          <CardDescription>
            Hi {email}, this area is reserved for organization administrators.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Your current role{role ? ` (${role})` : ''} does not have access to
            the admin dashboard. If you believe this is an error, please reach
            out to your organization owner or support team.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link to="/dashboard">Go to main dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
