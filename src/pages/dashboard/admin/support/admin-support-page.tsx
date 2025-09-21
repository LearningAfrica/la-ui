import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  MessageSquare,
  RefreshCw,
  Settings,
  Download,
  FileText,
  Filter,
  HelpCircle,
  MoreHorizontal,
  Tag,
  LifeBuoy,
  Plus,
  Loader2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// Mock data for support tickets
const supportTickets = [
  {
    id: 'T-1001',
    subject: 'Cannot access course materials',
    status: 'open',
    priority: 'high',
    category: 'technical',
    createdAt: '2023-11-15T10:30:00',
    updatedAt: '2023-11-15T14:45:00',
    user: {
      id: 'U-501',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      role: 'student',
      avatar: '/abstract-aj.png',
    },
    course: {
      id: 'C-101',
      title: 'Introduction to JavaScript',
    },
    messages: [
      {
        id: 'M-1',
        content:
          "I'm unable to access the course materials for Introduction to JavaScript. When I click on the lessons, I get an error message saying 'Content not available'.",
        timestamp: '2023-11-15T10:30:00',
        sender: 'user',
      },
      {
        id: 'M-2',
        content:
          'Thank you for reporting this issue. Could you please provide more details about the error message? Also, which browser and device are you using?',
        timestamp: '2023-11-15T11:15:00',
        sender: 'support',
      },
      {
        id: 'M-3',
        content:
          "I'm using Chrome on Windows 10. The exact error message is: 'Error 404: Content not available. Please contact support.'",
        timestamp: '2023-11-15T11:45:00',
        sender: 'user',
      },
    ],
    assignedTo: {
      id: 'S-201',
      name: 'Sarah Miller',
      avatar: '/abstract-geometric-sm.png',
    },
  },
];

// Mock data for knowledge base articles
const knowledgeBaseArticles = [
  {
    id: 'KB-101',
    title: 'How to Reset Your Password',
    category: 'Account Management',
    views: 1245,
    lastUpdated: '2023-10-15',
    excerpt:
      'Step-by-step guide to resetting your password and recovering account access.',
  },
];

// Mock data for support metrics
const supportMetrics = {
  ticketsTotal: 127,
  ticketsOpen: 42,
  ticketsResolved: 85,
  averageResponseTime: '3.5 hours',
  averageResolutionTime: '1.2 days',
  satisfactionRate: 92,
  ticketsByCategory: {
    technical: 45,
    billing: 28,
    content: 15,
    administrative: 22,
    instructional: 17,
  },
  ticketsByPriority: {
    high: 31,
    medium: 56,
    low: 40,
  },
  ticketTrend: [
    { date: 'Nov 8', count: 12 },
    { date: 'Nov 9', count: 15 },
    { date: 'Nov 10', count: 10 },
    { date: 'Nov 11', count: 8 },
    { date: 'Nov 12', count: 14 },
    { date: 'Nov 13', count: 18 },
    { date: 'Nov 14', count: 22 },
    { date: 'Nov 15', count: 28 },
  ],
};

// Support staff
const supportStaff = [
  {
    id: 'S-201',
    name: 'Sarah Miller',
    avatar: '/abstract-geometric-sm.png',
    role: 'Senior Support Specialist',
    activeTickets: 8,
    availability: 'available',
  },
];

// Add this utility function after the existing mock data and before the component
function exportToCSV(data: any[], filename: string) {
  // Convert data to CSV format
  const headers = [
    'Ticket ID',
    'Subject',
    'Status',
    'Priority',
    'Category',
    'Created',
    'Updated',
    'User',
    'Email',
  ];

  const csvRows = [
    headers.join(','),
    ...data.map((ticket: any) =>
      [
        ticket.id,
        `"${ticket.subject.replace(/"/g, '""')}"`, // Escape quotes in subject
        ticket.status,
        ticket.priority,
        ticket.category,
        new Date(ticket.createdAt).toLocaleString(),
        new Date(ticket.updatedAt).toLocaleString(),
        `"${ticket.user.name.replace(/"/g, '""')}"`, // Escape quotes in name
        ticket.user.email,
      ].join(','),
    ),
  ];

  const csvString = csvRows.join('\n'); // Use proper newline character

  // Create a blob and download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('to', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function AdminSupportPage() {
  // Mock data for quick stats
  // const _stats = {
  //   totalArticles: 52,
  //   totalCategories: 8,
  //   totalViews: 12450,
  //   searchesPerDay: 345,
  // };

  // Mock data for popular articles
  // const _popularArticles = [
  //   {
  //     id: 'kb-101',
  //     title: 'How to Reset Your Password',
  //     views: 1245,
  //     category: 'Account Management',
  //   },
  //   {
  //     id: 'kb-203',
  //     title: 'Understanding Course Completion Requirements',
  //     views: 987,
  //     category: 'Student Resources',
  //   },
  //   {
  //     id: 'kb-156',
  //     title: 'Setting Up Two-Factor Authentication',
  //     views: 876,
  //     category: 'Account Management',
  //   },
  //   {
  //     id: 'kb-302',
  //     title: 'How to Create a Quiz for Your Course',
  //     views: 754,
  //     category: 'Course Creation',
  //   },
  //   {
  //     id: 'kb-189',
  //     title: 'Troubleshooting Video Playback Issues',
  //     views: 632,
  //     category: 'Technical Support',
  //   },
  // ];

  // Mock data for recent searches
  // const _recentSearches = [
  //   { query: 'reset password', count: 45, trend: 'up' },
  //   { query: 'payment failed', count: 32, trend: 'down' },
  //   { query: 'certificate download', count: 28, trend: 'up' },
  //   { query: 'course refund', count: 24, trend: 'stable' },
  //   { query: 'video not playing', count: 19, trend: 'up' },
  // ];

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [, setIsAssigningAgent] = useState(false);
  // const [selectedAgent, _setSelectedAgent] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [, setActiveTab] = useState('tickets');

  // Filter tickets based on search query and filters
  const filteredTickets = supportTickets.filter((ticket) => {
    // Search query filter
    const matchesSearch =
      searchQuery === '' ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === 'all' || ticket.status === statusFilter;

    // Priority filter
    const matchesPriority =
      priorityFilter === 'all' || ticket.priority === priorityFilter;

    // Category filter
    const matchesCategory =
      categoryFilter === 'all' || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Handle ticket selection
  const handleTicketSelect = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  // Handle reply submission
  const handleReplySubmit = () => {
    if (replyContent.trim() === '') return;

    setIsReplying(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would update the ticket in the database
      //   toast({
      //     title: "Reply sent",
      //     description: `Reply sent to ticket ${selectedTicket.id}`,
      //   })
      toast.success(`Reply sent to ticket ${selectedTicket.id}`);

      setReplyContent('');
      setIsReplying(false);

      // Update the selected ticket with the new message
      const newMessage = {
        id: `M-${Date.now()}`,
        content: replyContent,
        timestamp: new Date().toISOString(),
        sender: 'support',
      };

      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessage],
        updatedAt: new Date().toISOString(),
      });
    }, 1000);
  };

  // Handle ticket status change
  const handleStatusChange = (status: string) => {
    // In a real app, you would update the ticket status in the database
    setSelectedTicket({
      ...selectedTicket,
      status,
      updatedAt: new Date().toISOString(),
    });

    // toast({
    //   title: "Status updated",
    //   description: `Ticket ${selectedTicket.id} status changed to ${status}`,
    // })
    toast.success(`Ticket ${selectedTicket.id} status changed to ${status}`);
  };

  // Handle ticket priority change
  const handlePriorityChange = (priority: string) => {
    // In a real app, you would update the ticket priority in the database
    setSelectedTicket({
      ...selectedTicket,
      priority,
      updatedAt: new Date().toISOString(),
    });

    // toast({
    //   title: "Priority updated",
    //   description: `Ticket ${selectedTicket.id} priority changed to ${priority}`,
    // })
    toast.success(
      `Ticket ${selectedTicket.id} priority changed to ${priority}`,
    );
  };

  // Handle agent assignment
  // const _handleAssignAgent = () => {
  //   if (!selectedAgent) return;

  //   const agent = supportStaff.find((staff) => staff.id === selectedAgent);

  //   if (!agent) return;

  //   // In a real app, you would update the ticket in the database
  //   setSelectedTicket({
  //     ...selectedTicket,
  //     assignedTo: agent,
  //     updatedAt: new Date().toISOString(),
  //   });

  //   // toast({
  //   //   title: "Agent assigned",
  //   //   description: `Ticket ${selectedTicket.id} assigned to ${agent.name}`,
  //   // })
  //   toast.success(`Ticket ${selectedTicket.id} assigned to ${agent.name}`);

  //   setIsAssigningAgent(false);
  // };

  const handleExport = (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    setExportFormat(format);

    setTimeout(() => {
      if (format === 'csv') {
        // Export to CSV
        const filename = `support-tickets-${new Date().toISOString().split('T')[0]}.csv`;
        exportToCSV(filteredTickets, filename);
        // toast({
        //   title: "Export successful",
        //   description: `Tickets exported to ${filename}`,
        // })
        toast.success(`Tickets exported to ${filename}`);
      } else if (format === 'pdf') {
        // In a real app, you would use a library like jsPDF or react-pdf
        // For this example, we'll just show a toast
        // toast({
        //   title: "PDF Export",
        //   description: "PDF export would be handled by a library like jsPDF in a real application",
        // })
        toast.success(
          'PDF export would be handled by a library like jsPDF in a real application',
        );
      }

      setIsExporting(false);
      setShowExportDialog(false);
    }, 1500);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-600"
          >
            Open
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge
            variant="outline"
            className="border-yellow-200 bg-yellow-50 text-yellow-600"
          >
            In Progress
          </Badge>
        );
      case 'resolved':
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-600"
          >
            Resolved
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <Badge
            variant="outline"
            className="border-red-200 bg-red-50 text-red-600"
          >
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge
            variant="outline"
            className="border-orange-200 bg-orange-50 text-orange-600"
          >
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-600"
          >
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Support Dashboard
          </h2>
          <p className="text-muted-foreground">
            Manage support tickets and help users with their inquiries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Export Tickets
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageSquare className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supportMetrics.ticketsTotal}
            </div>
            <p className="text-muted-foreground text-xs">
              +
              {
                supportMetrics.ticketTrend[
                  supportMetrics.ticketTrend.length - 1
                ].count
              }{' '}
              new today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supportMetrics.ticketsOpen}
            </div>
            <p className="text-muted-foreground text-xs">
              {Math.round(
                (supportMetrics.ticketsOpen / supportMetrics.ticketsTotal) *
                  100,
              )}
              % of total tickets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Response Time
            </CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supportMetrics.averageResponseTime}
            </div>
            <p className="text-muted-foreground text-xs">
              -0.5 hours from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Satisfaction Rate
            </CardTitle>
            <CheckCircle2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supportMetrics.satisfactionRate}%
            </div>
            <p className="text-muted-foreground text-xs">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="tickets"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="staff">Support Staff</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="space-y-4 md:w-2/3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('open')}>
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('in-progress')}
                    >
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('resolved')}
                    >
                      Resolved
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setPriorityFilter('all')}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter('high')}>
                      High
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPriorityFilter('medium')}
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter('low')}>
                      Low
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter('technical')}
                    >
                      Technical
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter('billing')}
                    >
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter('content')}
                    >
                      Content
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter('administrative')}
                    >
                      Administrative
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter('instructional')}
                    >
                      Instructional
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setCategoryFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportDialog(true)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>
                    {filteredTickets.length} tickets found
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-auto">
                    {filteredTickets.length > 0 ? (
                      <div className="divide-y">
                        {filteredTickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className={`hover:bg-muted/50 cursor-pointer p-4 ${
                              selectedTicket?.id === ticket.id ? 'bg-muted' : ''
                            }`}
                            onClick={() => handleTicketSelect(ticket)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      ticket.user.avatar || '/placeholder.svg'
                                    }
                                    alt={ticket.user.name}
                                  />
                                  <AvatarFallback>
                                    {ticket.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {ticket.subject}
                                  </p>
                                  <p className="text-muted-foreground text-sm">
                                    {ticket.user.name} • {ticket.id}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(ticket.status)}
                                {getPriorityBadge(ticket.priority)}
                              </div>
                            </div>
                            <div className="text-muted-foreground mt-2 text-sm">
                              <p className="line-clamp-1">
                                {
                                  ticket.messages[ticket.messages.length - 1]
                                    .content
                                }
                              </p>
                            </div>
                            <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
                              <p>Updated {formatDate(ticket.updatedAt)}</p>
                              <p>
                                {ticket.assignedTo ? (
                                  <span className="flex items-center gap-1">
                                    <Avatar className="h-4 w-4">
                                      <AvatarImage
                                        src={
                                          ticket.assignedTo.avatar ||
                                          '/placeholder.svg'
                                        }
                                        alt={ticket.assignedTo.name}
                                      />
                                      <AvatarFallback>
                                        {ticket.assignedTo.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    {ticket.assignedTo.name}
                                  </span>
                                ) : (
                                  <span className="text-yellow-500">
                                    Unassigned
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <HelpCircle className="text-muted-foreground/50 h-12 w-12" />
                        <h3 className="mt-4 text-lg font-medium">
                          No tickets found
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:w-1/3">
              {selectedTicket ? (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{selectedTicket.subject}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange('open')}
                          >
                            Mark as Open
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange('in-progress')}
                          >
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange('resolved')}
                          >
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handlePriorityChange('high')}
                          >
                            Set High Priority
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePriorityChange('medium')}
                          >
                            Set Medium Priority
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePriorityChange('low')}
                          >
                            Set Low Priority
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setIsAssigningAgent(true)}
                          >
                            Assign Agent
                          </DropdownMenuItem>
                          <DropdownMenuItem>Export Ticket</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>
                      Ticket {selectedTicket.id} •{' '}
                      {formatDate(selectedTicket.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={
                              selectedTicket.user.avatar || '/placeholder.svg'
                            }
                            alt={selectedTicket.user.name}
                          />
                          <AvatarFallback>
                            {selectedTicket.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {selectedTicket.user.name}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {selectedTicket.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getStatusBadge(selectedTicket.status)}
                        {getPriorityBadge(selectedTicket.priority)}
                      </div>
                    </div>

                    {selectedTicket.course && (
                      <div className="bg-muted mb-4 rounded-md p-3">
                        <p className="text-sm font-medium">Related Course</p>
                        <p className="text-sm">
                          <Link
                            to={`/dashboard/admin/courses/${selectedTicket.course.id}`}
                            className="text-primary hover:underline"
                          >
                            {selectedTicket.course.title}
                          </Link>
                        </p>
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="mb-1 text-sm font-medium">Category</p>
                      <Badge variant="outline" className="capitalize">
                        {selectedTicket.category}
                      </Badge>
                    </div>

                    <Separator className="my-4" />

                    <div className="max-h-[300px] space-y-4 overflow-auto">
                      {selectedTicket.messages.map((message: any) => (
                        <div
                          key={message.id}
                          className={`rounded-md p-3 ${message.sender === 'user' ? 'bg-muted' : 'bg-primary/10'}`}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {message.sender === 'user'
                                ? selectedTicket.user.name
                                : 'Support Agent'}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {formatDate(message.timestamp)}
                            </p>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <div className="w-full">
                      <Textarea
                        placeholder="Type your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <Button variant="outline" size="sm">
                        <Tag className="mr-2 h-4 w-4" />
                        Add Template
                      </Button>
                      <Button
                        onClick={handleReplySubmit}
                        disabled={replyContent.trim() === '' || isReplying}
                      >
                        {isReplying ? 'Sending...' : 'Send Reply'}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <LifeBuoy className="text-muted-foreground/50 h-12 w-12" />
                    <h3 className="mt-4 text-lg font-medium">
                      No ticket selected
                    </h3>
                    <p className="text-muted-foreground text-center text-sm">
                      Select a ticket from the list to view details and respond
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Knowledge Base Articles</h3>
            <Button asChild>
              <Link to="/dashboard/admin/support/articles">
                View All Articles
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {knowledgeBaseArticles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  <CardDescription>{article.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {article.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <p className="text-muted-foreground text-xs">
                    Last updated: {article.lastUpdated}
                  </p>
                  <Button variant="ghost" size="sm">
                    View Article
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Support Staff</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {supportStaff.map((staff) => (
              <Card key={staff.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={staff.avatar || '/placeholder.svg'}
                          alt={staff.name}
                        />
                        <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          {staff.name}
                        </CardTitle>
                        <CardDescription>{staff.role}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={` ${staff.availability === 'available' ? 'border-green-200 bg-green-50 text-green-600' : ''} ${staff.availability === 'busy' ? 'border-yellow-200 bg-yellow-50 text-yellow-600' : ''} ${staff.availability === 'away' ? 'border-gray-200 bg-gray-50 text-gray-600' : ''} `}
                    >
                      {staff.availability}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-sm">
                        Active Tickets
                      </p>
                      <p className="font-medium">{staff.activeTickets}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-sm">
                        Response Rate
                      </p>
                      <p className="font-medium">92%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-sm">
                        Avg. Response Time
                      </p>
                      <p className="font-medium">2.8 hours</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-medium">Analytics</h3>
          <p className="text-muted-foreground text-sm">
            Detailed analytics and reports coming soon.
          </p>
        </TabsContent>
      </Tabs>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Tickets</DialogTitle>
            <DialogDescription>
              Choose the format you want to export the tickets to.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport('csv')}
                disabled={isExporting}
              >
                {isExporting && exportFormat === 'csv' ? (
                  <>
                    Exporting...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Export to CSV
                    <FileText className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
              >
                {isExporting && exportFormat === 'pdf' ? (
                  <>
                    Exporting...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Export to PDF
                    <FileText className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowExportDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
