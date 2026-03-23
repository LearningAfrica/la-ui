import { useSearchParams } from "react-router";
import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { generateSEOTags } from "@/lib/utils/seo";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Sign In | Learning Africa",
      description:
        "Sign in to your Learning Africa account and access your organization's learning management system",
      url: "/sign-in",
    }),
  ];
}

export default function SignInPage() {
  const [searchParams] = useSearchParams();

  return (
    <AuthLayout>
      <LoginForm searchParams={searchParams} />
    </AuthLayout>
  );
}
