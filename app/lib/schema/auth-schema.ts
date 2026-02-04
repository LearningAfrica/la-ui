import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const loginResolver = zodResolver(loginSchema);

// Register Schema
export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name is too long"),
    last_name: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirm_password: z.string(),
    username: z
      .string()
      .min(2, "Username must be at least 2 characters")
      .max(100, "Username is too long")
      .optional(),
    accept_terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const registerResolver = zodResolver(registerSchema);

// Password Reset Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordResolver = zodResolver(forgotPasswordSchema);

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    otp_code: z
      .string()
      .length(6, "OTP code must be 6 digits")
      .regex(/^\d+$/, "OTP code must contain only numbers"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const resetPasswordResolver = zodResolver(resetPasswordSchema);
