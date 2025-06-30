import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  CreditCard,
  Download,
  DollarSign,
  FileText,
  HelpCircle,
  Search,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for earnings
const earningsData = {
  totalRevenue: 12345.67,
  pendingPayouts: 2345.67,
  lifetimeEarnings: 45678.9,
  enrollments: 1234,
  courseCount: 8,
  averageRating: 4.8,
  monthlyRevenue: [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1400 },
    { month: 'Mar', revenue: 1100 },
    { month: 'Apr', revenue: 1600 },
    { month: 'May', revenue: 1800 },
    { month: 'Jun', revenue: 2200 },
    { month: 'Jul', revenue: 2400 },
    { month: 'Aug', revenue: 2100 },
    { month: 'Sep', revenue: 2300 },
    { month: 'Oct', revenue: 2500 },
    { month: 'Nov', revenue: 2700 },
    { month: 'Dec', revenue: 3000 },
  ],
  courseRevenue: [
    {
      id: '1',
      title: 'Complete JavaScript Course',
      revenue: 4560,
      students: 456,
      share: 37,
    },
    {
      id: '2',
      title: 'React Native for Beginners',
      revenue: 3280,
      students: 328,
      share: 26,
    },
    {
      id: '3',
      title: 'Advanced TypeScript Patterns',
      revenue: 2150,
      students: 215,
      share: 17,
    },
    {
      id: '4',
      title: 'Node.js API Development',
      revenue: 1450,
      students: 145,
      share: 12,
    },
    {
      id: '5',
      title: 'UI/UX Design Fundamentals',
      revenue: 980,
      students: 98,
      share: 8,
    },
  ],
  transactions: [
    {
      id: 't1',
      date: '2024-02-01',
      amount: 1245.67,
      type: 'payout',
      status: 'completed',
      method: 'Bank Transfer',
      reference: 'PAY-12345678',
    },
    {
      id: 't2',
      date: '2024-01-15',
      amount: 980.45,
      type: 'payout',
      status: 'completed',
      method: 'PayPal',
      reference: 'PAY-87654321',
    },
    {
      id: 't3',
      date: '2024-01-01',
      amount: 1100.0,
      type: 'payout',
      status: 'completed',
      method: 'Bank Transfer',
      reference: 'PAY-23456789',
    },
    {
      id: 't4',
      date: '2023-12-15',
      amount: 875.5,
      type: 'payout',
      status: 'completed',
      method: 'PayPal',
      reference: 'PAY-34567890',
    },
    {
      id: 't5',
      date: '2023-12-01',
      amount: 950.75,
      type: 'payout',
      status: 'completed',
      method: 'Bank Transfer',
      reference: 'PAY-45678901',
    },
  ],
  paymentMethods: [
    {
      id: 'pm1',
      type: 'bank',
      name: 'Bank of America',
      accountNumber: '****6789',
      isDefault: true,
    },
    {
      id: 'pm2',
      type: 'paypal',
      name: 'PayPal',
      email: 'instructor@example.com',
      isDefault: false,
    },
  ],
};

export default function InstructorEarningsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter transactions based on search query
  const filteredTransactions = earningsData.transactions.filter(
    (transaction) =>
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.method.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get max revenue for chart scaling
  const maxRevenue = Math.max(
    ...earningsData.monthlyRevenue.map((item) => item.revenue),
  );

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
          <p className="text-muted-foreground">
            Track your revenue, payments, and financial analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link to="/dashboard/instructor/earnings/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Available for Payout
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(earningsData.totalRevenue)}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <Button size="sm" className="w-full">
                Request Payout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Pending Payouts
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(earningsData.pendingPayouts)}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
                <CreditCard className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-xs">
                Next payout scheduled for March 15, 2024
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Lifetime Earnings
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(earningsData.lifetimeEarnings)}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-green-600 dark:text-green-400">
                +12.5% from last year
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold">{earningsData.enrollments}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-green-600 dark:text-green-400">
                +8.3% from last month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="courses">Course Revenue</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Your earnings over the past 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-end space-x-2">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="year">Last 12 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 h-[300px]">
                <div className="flex h-full items-end gap-2">
                  {earningsData.monthlyRevenue.map((item, i) => (
                    <div
                      key={i}
                      className="relative flex h-full w-full flex-col justify-end"
                    >
                      <div
                        className="bg-primary/90 w-full rounded-md"
                        style={{
                          height: `${(item.revenue / maxRevenue) * 100}%`,
                        }}
                      >
                        <div className="text-muted-foreground absolute -top-8 w-full text-center text-xs">
                          {formatCurrency(item.revenue)}
                        </div>
                      </div>
                      <div className="text-muted-foreground mt-2 text-center text-xs">
                        {item.month}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Courses</CardTitle>
                <CardDescription>Revenue breakdown by course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.courseRevenue.slice(0, 3).map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/dashboard/instructor/courses/${course.id}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {course.title}
                        </Link>
                        <span className="text-sm font-medium">
                          {formatCurrency(course.revenue)}
                        </span>
                      </div>
                      <Progress value={course.share} className="h-2" />
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span>{course.students} students</span>
                        <span>{course.share}% of total revenue</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your most recent payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.transactions.slice(0, 3).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {transaction.type === 'payout' ? 'Payout' : 'Revenue'}{' '}
                          - {transaction.reference}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {transaction.date} • {transaction.method}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${transaction.type === 'payout' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
                        >
                          {transaction.type === 'payout' ? '-' : '+'}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Earnings Insights</CardTitle>
              <CardDescription>Key metrics and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="text-muted-foreground h-4 w-4" />
                    <h4 className="text-sm font-medium">
                      Average Revenue per Student
                    </h4>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      earningsData.totalRevenue / earningsData.enrollments,
                    )}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Based on {earningsData.enrollments} total enrollments
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <h4 className="text-sm font-medium">
                      Average Monthly Revenue
                    </h4>
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      earningsData.monthlyRevenue.reduce(
                        (sum, item) => sum + item.revenue,
                        0,
                      ) / earningsData.monthlyRevenue.length,
                    )}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Over the past 12 months
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="text-muted-foreground h-4 w-4" />
                    <h4 className="text-sm font-medium">Revenue Growth Rate</h4>
                  </div>
                  <p className="text-2xl font-bold">+18.7%</p>
                  <p className="text-muted-foreground text-xs">
                    Compared to previous year
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View all your payouts and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="w-full pl-8 md:max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="payout">Payouts</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                          <TableCell>{transaction.method}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                transaction.status === 'completed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : transaction.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }
                            >
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            <span
                              className={
                                transaction.type === 'payout'
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-green-600 dark:text-green-400'
                              }
                            >
                              {transaction.type === 'payout' ? '-' : '+'}
                              {formatCurrency(transaction.amount)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Revenue</CardTitle>
              <CardDescription>Revenue breakdown by course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Revenue Share</TableHead>
                      <TableHead className="text-right">
                        Total Revenue
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {earningsData.courseRevenue.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <Link
                            to={`/dashboard/instructor/courses/${course.id}`}
                            className="font-medium hover:underline"
                          >
                            {course.title}
                          </Link>
                        </TableCell>
                        <TableCell>{course.students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={course.share}
                              className="h-2 w-[100px]"
                            />
                            <span className="text-muted-foreground text-xs">
                              {course.share}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(course.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payout methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earningsData.paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-2 ${
                          method.type === 'bank'
                            ? 'bg-blue-100 dark:bg-blue-900'
                            : 'bg-yellow-100 dark:bg-yellow-900'
                        }`}
                      >
                        <CreditCard
                          className={`h-5 w-5 ${
                            method.type === 'bank'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-yellow-600 dark:text-yellow-400'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {method.type === 'bank'
                            ? method.accountNumber
                            : method.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Default
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      {!method.isDefault && (
                        <Button variant="ghost" size="sm">
                          Set as Default
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Button className="w-full">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
              <CardDescription>
                Configure your payout preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="payout-threshold">Payout Threshold</Label>
                  <Select defaultValue="100">
                    <SelectTrigger id="payout-threshold">
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">$50.00</SelectItem>
                      <SelectItem value="100">$100.00</SelectItem>
                      <SelectItem value="250">$250.00</SelectItem>
                      <SelectItem value="500">$500.00</SelectItem>
                      <SelectItem value="1000">$1,000.00</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-xs">
                    Minimum amount required before automatic payout is processed
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="payout-frequency">Payout Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="payout-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-xs">
                    How often you want to receive your payouts
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button>Save Settings</Button>
                  <Button variant="outline" asChild>
                    <Link to="/dashboard/instructor/earnings/tax-info">
                      Tax Information
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Resources to help you understand your earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <HelpCircle className="text-primary h-5 w-5" />
                <h3 className="font-medium">Understanding Revenue Share</h3>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Learn how course revenue is calculated and distributed.
              </p>
              <Button variant="link" className="p-0" asChild>
                <Link to="/help/revenue-share">Read More</Link>
              </Button>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <FileText className="text-primary h-5 w-5" />
                <h3 className="font-medium">Tax Information</h3>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Important tax guidelines for instructors.
              </p>
              <Button variant="link" className="p-0" asChild>
                <Link to="/help/tax-info">Read More</Link>
              </Button>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <CreditCard className="text-primary h-5 w-5" />
                <h3 className="font-medium">Payment Methods</h3>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Available payout options and processing times.
              </p>
              <Button variant="link" className="p-0" asChild>
                <Link to="/help/payment-methods">Read More</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
