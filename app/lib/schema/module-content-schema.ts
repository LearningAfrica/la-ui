import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const moduleContentSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  content_type: z.string().min(1, "Content type is required"),
  content_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  order: z.coerce.number().min(0, "Order must be 0 or greater").default(0),
});

export type ModuleContentFormData = z.infer<typeof moduleContentSchema>;

export const moduleContentResolver = zodResolver(moduleContentSchema);
