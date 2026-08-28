import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const contentTypes = ["text", "video", "file", "interactive"] as const;

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
    file: z.any().optional(),
    format: z
      .enum(["native", "html5", "scorm12", "scorm2004", "external"])
      .optional(),
    package_file: z.any().optional(),
    external_url: z.string().optional(),
    definition: z.any().optional(),
    xapi_enabled: z.boolean().default(true),
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

    if (data.content_type === "interactive") {
      if (!data.format) {
        ctx.addIssue({
          code: "custom",
          message: "Interactive format is required",
          path: ["format"],
        });
      } else if (data.format === "native" && !data.definition?.blocks?.length) {
        ctx.addIssue({
          code: "custom",
          message: "Add at least one interactive block",
          path: ["definition"],
        });
      } else if (data.format === "external" && !data.external_url) {
        ctx.addIssue({
          code: "custom",
          message: "Embed URL is required",
          path: ["external_url"],
        });
      } else if (
        !["native", "external"].includes(data.format) &&
        !data.package_file
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Package file is required",
          path: ["package_file"],
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
  { value: "interactive", label: "Interactive lesson" },
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
  format: "native",
  package_file: undefined,
  external_url: "",
  definition: {
    version: 2,
    learningObjective: "",
    completionMode: "all",
    passScore: 70,
    showCelebration: true,
    presentationMode: "journey",
    motionIntensity: "playful",
    showProgress: true,
    showPoints: true,
    showStreak: true,
    blocks: [
      {
        id: "starter-accordion",
        type: "accordion",
        title: "Explore this topic",
        instructions: "Open every section to explore the topic.",
        required: true,
        points: 10,
        items: [{ title: "Section 1", content: "" }],
      },
    ],
  },
  xapi_enabled: true,
};
