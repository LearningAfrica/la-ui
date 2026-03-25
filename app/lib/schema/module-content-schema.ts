import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const contentTypes = ["text", "video", "file"];

export type ContentType = (typeof contentTypes)[number];

export const moduleContentSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(200, "Title must be less than 200 characters"),
    content_type: z.enum(contentTypes, {
      error: "Content type is required",
    }),
    order: z.coerce
      .number()
      .int()
      .min(0, "Order must be 0 or greater")
      .default(0),
    // text fields
    body: z.string().optional(),
    // video fields
    video_url: z.string().optional(),
    duration_seconds: z.coerce.number().int().optional(),
    // file fields
    file_name: z.string().optional(),
    file: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.content_type === "text" && !data.body) {
      ctx.addIssue({
        code: "custom",
        message: "Body is required for text content",
        path: ["body"],
      });
    }

    if (data.content_type === "video") {
      if (!data.video_url) {
        ctx.addIssue({
          code: "custom",
          message: "Video URL is required",
          path: ["video_url"],
        });
      }

      if (!data.duration_seconds || data.duration_seconds < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Duration must be at least 1 second",
          path: ["duration_seconds"],
        });
      }
    }

    if (data.content_type === "file") {
      if (!data.file_name) {
        ctx.addIssue({
          code: "custom",
          message: "File name is required",
          path: ["file_name"],
        });
      }

      if (!data.file) {
        ctx.addIssue({
          code: "custom",
          message: "File is required",
          path: ["file"],
        });
      }
    }
  });

export type ModuleContentFormData = z.infer<typeof moduleContentSchema>;

export const moduleContentResolver = zodResolver(moduleContentSchema);

export const contentTypeOptions = [
  { value: "text", label: "Text" },
  { value: "video", label: "Video" },
  { value: "file", label: "File" },
] as const;

export const defaultContentValues: ModuleContentFormData = {
  content_type: "text",
  title: "",
  order: 0,
  body: "",
  video_url: "",
  duration_seconds: undefined,
  file_name: "",
  file: "",
};
