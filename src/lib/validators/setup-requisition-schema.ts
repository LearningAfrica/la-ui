import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define the schema for the inquiry form
export const setupInquirySchema = z.object({
  // first_name: z.string().min(1, { message: 'First name is required' }),
  // last_name: z.string().min(1, { message: 'Last name is required' }),
  // contact_email: z
  //   .string()
  //   .email({ message: 'Please enter a valid email address' }),
  company_name: z.string().min(1, { message: 'Company name is required' }),
  company_description: z
    .string()
    .min(10, { message: 'Please provide a description (min. 10 characters)' }),
  company_category: z.string().min(1, { message: 'Please select a category' }),
  company_size: z.string().min(1, { message: 'Please select a company size' }),
  reason: z.string().min(10, { message: 'Please provide a reason (min. 10 characters)' }),
});

export const setupRequisitionSchemaResolver = zodResolver(setupInquirySchema);

export type SetupInquiryPayload = z.infer<typeof setupInquirySchema>;
