import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const zoomCallSchema = z.object({
  topic: z
    .string()
    .min(3, "Topic must be at least 3 characters")
    .max(200, "Topic must be less than 200 characters"),
  description: z.string().max(1000).optional(),
  start_time: z.string().min(1, "Start time is required"),
  duration: z.coerce
    .number()
    .int()
    .min(5, "Duration must be at least 5 minutes")
    .max(480, "Duration must be less than 8 hours (480 minutes)")
    .default(60),
});

export type ZoomCallFormData = z.infer<typeof zoomCallSchema>;

export const zoomCallResolver = zodResolver(zoomCallSchema);

export const defaultZoomCallValues: ZoomCallFormData = {
  topic: "",
  description: "",
  start_time: "",
  duration: 60,
};
