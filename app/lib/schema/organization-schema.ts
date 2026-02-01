import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const organizationSchema = z.object({
  name: z
    .string()
    .min(3, "Organization name must be at least 3 characters")
    .max(100, "Organization name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  logo: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Max file size is 5MB"
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

export const organizationResolver = zodResolver(organizationSchema);
