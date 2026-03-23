import { useSearchParams } from "react-router";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();

  return (
    <AuthLayout className="py-12">
      <ForgotPasswordForm searchParams={searchParams} />
    </AuthLayout>
  );
}
