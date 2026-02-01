import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const emailSchema = z.string().email("Invalid email address");

export const inviteMemberSchema = z.object({
  organization_id: z.string({ error: "Organization ID is required" }),
  receiver_emails: z
    .array(z.email("Invalid email address"))
    .min(1, "At least one email is required"),
  role: z
    .enum(["admin", "instructor", "learner"], {
      error: "Role is required",
    })
    .default("learner"),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

export const inviteMemberResolver = zodResolver(inviteMemberSchema);

export { emailSchema };
