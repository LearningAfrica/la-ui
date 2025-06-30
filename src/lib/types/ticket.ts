export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketCategory =
  | 'technical'
  | 'content'
  | 'billing'
  | 'account'
  | 'certificate'
  | 'other';

export interface TicketAttachment {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
  fileSize: number;
  fileType: string;
}

export interface TicketComment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: 'student' | 'support' | 'instructor' | 'admin';
    avatar?: string;
  };
  attachments: TicketAttachment[];
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
  courseId?: string;
  courseName?: string;
  lessonId?: string;
  lessonName?: string;
  student: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    role: 'support' | 'instructor' | 'admin';
    avatar?: string;
  };
  comments: TicketComment[];
  attachments: TicketAttachment[];
}
