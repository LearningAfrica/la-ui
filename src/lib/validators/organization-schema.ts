import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { organizationUserRoleSchema } from './auth-schema';

/**
 * ========= Schemas =========
 */

export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  //   File
  logo: z.instanceof(File).optional(),
});

export const inviteUsersToOrganizationSchema = z.object({
  organization_id: z.string(),
  role: organizationUserRoleSchema.default('learner'),
  receiver_email: z.array(z.string().email()),
});

/**
 * ======== Types =========
 */
export type ICreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type IInviteUsersToOrganizationInput = z.infer<
  typeof inviteUsersToOrganizationSchema
>;

/**
 * ======== Resolvers =========
 */
export const createOrganizationResolver = zodResolver(createOrganizationSchema);
export const inviteUsersToOrganizationResolver = zodResolver(
  inviteUsersToOrganizationSchema,
);
