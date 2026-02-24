import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const courseSchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  category: z.coerce.number().min(1, "Category is required"),
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
});

export type CourseFormData = z.infer<typeof courseSchema>;

export const courseResolver = zodResolver(courseSchema);
