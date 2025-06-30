import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Paperclip, Send } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Mock ticket data
const ticketData = {
  id: 'T-1001',
  subject: 'Cannot access course materials',
  status: 'in-progress',
  priority: 'high',
  createdAt: '2025-04-15T10:30:00Z',
  updatedAt: '2025-04-16T14:45:00Z',
  course: 'Advanced JavaScript Concepts',
  description:
    "I'm trying to access the Week 3 materials in the Advanced JavaScript Concepts course, but I keep getting an error message saying 'Content not available'. I've tried refreshing the page and using different browsers, but the issue persists.",
  messages: [
    {
      id: 'msg-1',
      sender: {
        name: 'John Smith',
        role: 'student',
        avatar: '/abstract-aj.png',
      },
      content:
        "I'm trying to access the Week 3 materials in the Advanced JavaScript Concepts course, but I keep getting an error message saying 'Content not available'. I've tried refreshing the page and using different browsers, but the issue persists.",
      timestamp: '2025-04-15T10:30:00Z',
      attachments: [],
    },
    {
      id: 'msg-2',
      sender: {
        name: 'Support Team',
        role: 'support',
        avatar: '/placeholder.svg',
      },
      content:
        "Thank you for reporting this issue. I'll check the course materials and permissions right away. Could you please let me know which specific lesson or resource you're trying to access in Week 3?",
      timestamp: '2025-04-15T11:45:00Z',
      attachments: [],
    },
    {
      id: 'msg-3',
      sender: {
        name: 'John Smith',
        role: 'student',
        avatar: '/abstract-aj.png',
      },
      content:
        "I'm trying to access the 'Advanced Promises and Async/Await' lesson. I've attached a screenshot of the error message I'm seeing.",
      timestamp: '2025-04-15T12:30:00Z',
      attachments: [
        {
          id: 'att-1',
          name: 'error-screenshot.png',
          size: '245 KB',
          url: '#',
        },
      ],
    },
    {
      id: 'msg-4',
      sender: {
        name: 'Support Team',
        role: 'support',
        avatar: '/placeholder.svg',
      },
      content:
        "Thanks for the screenshot. I've identified the issue with the course permissions. I've reset the access controls for Week 3 materials. Could you please try accessing the lesson again and let me know if you're still experiencing problems?",
      timestamp: '2025-04-16T09:15:00Z',
      attachments: [],
    },
  ],
};

export default function StudentSupportTicketDetailPage() {
  //   const router = useRouter()
  const params = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'default';
      case 'in-progress':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // Get priority badge variant
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      //   toast({
      //     title: "Message Sent",
      //     description: "Your message has been sent successfully.",
      //   })
      toast.success('Your message has been sent successfully.');

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      //   toast({
      //     title: "Error",
      //     description: "There was a problem sending your message. Please try again.",
      //     variant: "destructive",
      //   })
      toast.error(
        'There was a problem sending your message. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/student/support/tickets">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Tickets
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ticket {ticketData.id}
          </h1>
          <p className="text-muted-foreground">{ticketData.subject}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={getStatusBadge(ticketData.status) as any}>
            {ticketData.status.charAt(0).toUpperCase() +
              ticketData.status.slice(1)}
          </Badge>
          <Badge variant={getPriorityBadge(ticketData.priority) as any}>
            {ticketData.priority.charAt(0).toUpperCase() +
              ticketData.priority.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                Ticket opened on {formatDate(ticketData.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ticketData.messages.map((message) => (
                  <div key={message.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage
                        src={message.sender.avatar || '/placeholder.svg'}
                        alt={message.sender.name}
                      />
                      <AvatarFallback>
                        {message.sender.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">
                            {message.sender.name}
                          </span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            {message.sender.role === 'support'
                              ? 'Support Team'
                              : 'You'}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                      <div className="bg-muted rounded-md p-4 text-sm">
                        <p>{message.content}</p>
                      </div>
                      {message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {message.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
                            >
                              <Paperclip className="h-3 w-3" />
                              <span>{attachment.name}</span>
                              <span className="text-muted-foreground">
                                ({attachment.size})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full flex-col gap-4">
                <Textarea
                  placeholder="Type your reply here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-24"
                />
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" type="button">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Attach File
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSubmitting || !newMessage.trim()}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reply'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Status
                </p>
                <p>
                  <Badge variant={getStatusBadge(ticketData.status) as any}>
                    {ticketData.status.charAt(0).toUpperCase() +
                      ticketData.status.slice(1)}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Priority
                </p>
                <p>
                  <Badge variant={getPriorityBadge(ticketData.priority) as any}>
                    {ticketData.priority.charAt(0).toUpperCase() +
                      ticketData.priority.slice(1)}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Created
                </p>
                <p>{formatDate(ticketData.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Last Updated
                </p>
                <p>{formatDate(ticketData.updatedAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Related Course
                </p>
                <p>{ticketData.course}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {ticketData.status !== 'resolved' && (
                <Button variant="outline" className="w-full">
                  Mark as Resolved
                </Button>
              )}
              <Button variant="outline" className="w-full">
                View Course
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
