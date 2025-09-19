import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const systermUserRoleSchema = z.enum(['super_admin', 'user']);
export const organizationUserRoleSchema = z.enum(['admin', 'instructor', 'learner']);

export type UserRole = z.infer<typeof systermUserRoleSchema>;
export type OrgUserRole = z.infer<typeof organizationUserRoleSchema>;
// const usernameOrEmailSchema = z.union([
//   z.string().email({ message: 'Invalid email address' }),
//   z.string().min(1, { message: 'Username is required' }),
// ]);

export const authSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

const registerSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  invitation_token: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

const loginUserOrganizationSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().min(1, { message: 'Organization name is required' }),
  position: z.string().optional().nullable(),
  is_active: z.boolean().default(false),
  role: organizationUserRoleSchema,
});

export const loginUserResponseSchema = z.object({
  id: z.string(),
  user_role: systermUserRoleSchema.optional(),
  email: z.string().email().min(1).max(255),
  refresh_token: z.string(),
  access_token: z.string(),
  can_create_organization: z.boolean().default(false),
  organizations: z.array(loginUserOrganizationSchema).default([]),
});

export const registerUserResponseSchema = z
  .object({
    // id: z.string().uuid(),
    // username: z.string().min(1).max(255),
    // email: z.string().email().min(1).max(255),
    // first_name: z.string().min(1).max(255).optional(),
    // last_name: z.string().min(1).max(255).optional(),
    // password: z.string().min(6).max(68),
    // is_super_admin: z.boolean().optional(),
    // is_admin: z.boolean().optional(),
    // is_instructor: z.boolean().optional(),
    // is_student: z.boolean().optional(),
    // invitation_token: z.string().min(1).optional(),
  })
  .merge(loginUserResponseSchema);
// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    otp_code: z
      .string()
      .length(6, { message: 'OTP must be exactly 6 characters long' })
      .regex(/^\d+$/, { message: 'OTP must contain only numbers' }),
    email: z.string().email({ message: 'Invalid email address' }),
    new_password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords must match',
    path: ['confirm_password'],
  });

export const loginUserSchemaResolver = zodResolver(authSchema);
export const registerUserSchemaResolver = zodResolver(registerSchema);
export const forgotPasswordSchemaResolver = zodResolver(forgotPasswordSchema);
export const resetPasswordSchemaResolver = zodResolver(resetPasswordSchema);

export type ILoginUserResponse = z.infer<typeof loginUserResponseSchema>;
export type IRegisterUserResponse = z.infer<typeof registerUserResponseSchema>;
export type ILoginUser = z.infer<typeof authSchema>;
export type IRegisterUser = z.infer<typeof registerSchema>;
export type IForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type IResetPassword = z.infer<typeof resetPasswordSchema>;
