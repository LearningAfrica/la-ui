export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketCategory = 'technical' | 'billing' | 'general' | 'feature-request' | 'bug-report';

export interface TicketAttachment {
  id: string;
  name: string;
  filename: string;
  url: string;
  size: number;
  fileSize: number;
  type: string;
}

export interface TicketAuthor {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface TicketStudent {
  id: string;
  name: string;
  email: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  userId: string;
  assignedTo?: string;
  comments: TicketComment[];
  attachments: TicketAttachment[];
  student: TicketStudent;
  courseId?: string;
  courseName?: string;
  lessonName?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: string;
  isInternal?: boolean;
  author: TicketAuthor;
  attachments: TicketAttachment[];
}
