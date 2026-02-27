import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const categorySchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  category_name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be less than 100 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description must be less than 500 characters"),
  category_image: z
    .instanceof(File)
    .superRefine((file, ctx) => {
      if (file.size > 5000000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File size must be less than 5MB",
        });
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only JPEG and PNG images are allowed",
        });
      }
    })
    .optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const categoryResolver = zodResolver(categorySchema);
