import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const createSessionSchema = z.object({
  title: z.string().min(1, 'Session title is required').max(100, 'Title must be less than 100 characters'),
  course: z.string().min(1, 'Course is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  duration: z.string().min(1, 'Duration is required'),
  maxParticipants: z.number().min(1, 'Maximum participants must be at least 1').max(100, 'Maximum participants cannot exceed 100'),
  description: z.string().optional(),
  meetingLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export type CreateSessionFormData = z.infer<typeof createSessionSchema>;

export const createSessionSchemaResolver = zodResolver(createSessionSchema);
