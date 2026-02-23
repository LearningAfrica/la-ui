import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Update Profile Schema
export const updateProfileSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const updateProfileResolver = zodResolver(updateProfileSchema);

// Change Password Schema
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirm_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const changePasswordResolver = zodResolver(changePasswordSchema);
