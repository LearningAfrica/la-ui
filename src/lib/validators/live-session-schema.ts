import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const createSessionSchema = z.object({
  topic: z.string().min(1, 'Session title is required').max(100, 'Title must be less than 100 characters'),
  course: z.string().optional(), // Made optional since it's not in the API and commented out in the dialog
  start_time: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  duration: z.coerce.number().min(5, 'Duration is required'),
  max_participants: z.number().optional(), // Made optional since API doesn't provide this field
  description: z.string().optional(),
  // meetingLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export type CreateSessionFormData = z.infer<typeof createSessionSchema>;
export type CreateSessionData = CreateSessionFormData & {
  id?: string; // Optional for edit scenarios
};

export const createSessionSchemaResolver = zodResolver(createSessionSchema);
