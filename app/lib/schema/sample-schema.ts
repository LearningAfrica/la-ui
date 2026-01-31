import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GENDER_OPTIONS } from "../constants/gender";

export const sampleSchema = z.object({
  firstName: z.string(),
  lastName: z.string().min(2).max(100),
  personalMessage: z.number().min(0).max(120).optional(),
  bio: z.string().min(10).max(300),
  gender: z.enum(GENDER_OPTIONS),
});

export type SampleSchema = z.infer<typeof sampleSchema>;

export const sampleSchemaResolver = zodResolver(sampleSchema);
