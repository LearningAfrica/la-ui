import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { COMPANY_CATEGORIES, COMPANY_SIZES } from "../constants/company";

// Inquiry Schema
export const inquirySchema = z.object({
  company_name: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name is too long"),
  company_description: z
    .string()
    .min(2, "Company description must be at least 2 characters")
    .max(100, "Company description is too long"),
  company_category: z.enum(
    COMPANY_CATEGORIES.map((category) => category.value),
    { error: "Please select organization type" }
  ),

  company_size: z.enum(
    COMPANY_SIZES.map((size) => size.value),
    {
      error: "Please select expected number of users",
    }
  ),
  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters")
    .max(1000, "Reason is too long")
    .optional(),
  accept_terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

export const inquiryResolver = zodResolver(inquirySchema);
