import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const moduleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional()
    .default(""),
});

export type ModuleFormData = z.infer<typeof moduleSchema>;

export const moduleResolver = zodResolver(moduleSchema);
