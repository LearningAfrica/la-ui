import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const courseSchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  category: z
    .string("Please select a valid category")
    .min(1, "Category is required"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  overview: z
    .string()
    .min(10, "Overview must be at least 10 characters")
    .max(2000, "Overview must be less than 2000 characters"),
  is_premium: z.boolean().default(false),
  price: z.coerce.number().min(0, "Price must be 0 or greater").default(0),
  is_private: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  course_image: z
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

export type CourseFormData = z.infer<typeof courseSchema>;

export const courseResolver = zodResolver(courseSchema);
