import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordConfirmation } from "@/components/auth/reset-password-confirmation";

export default function ResetPasswordConfirmationPage() {
  return (
    <AuthLayout className="py-12">
      <ResetPasswordConfirmation />
    </AuthLayout>
  );
}
