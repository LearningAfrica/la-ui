import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createOrganizationSchema = z.object({
  name: z.string().min(1, { message: 'Organization name is required' }),
  description: z.string().optional(),
  //   File
  logo: z.instanceof(File).optional(),
});

export const createOrganizationResolver = zodResolver(createOrganizationSchema);
export type ICreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
