import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordConfirmation } from "@/components/auth/reset-password-confirmation";
import { generateSEOTags } from "@/lib/utils/seo";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Reset Password | Learning Africa",
      description: "Reset your Learning Africa account password.",
      url: "/reset-password-confirmation",
    }),
  ];
}

export default function ResetPasswordConfirmationPage() {
  return (
    <AuthLayout className="py-12">
      <ResetPasswordConfirmation />
    </AuthLayout>
  );
}
