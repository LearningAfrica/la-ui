import { useSearchParams } from "react-router";
import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { generateSEOTags } from "@/lib/utils/seo";
import { webPageSchema } from "@/lib/utils/structured-data";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Sign In | Learning Africa",
      description:
        "Sign in to your Learning Africa account and access your organization's learning management system",
      url: "/sign-in",
      noIndex: true,
      jsonLd: webPageSchema({
        name: "Sign In",
        description:
          "Sign in to your Learning Africa account and access your dashboard.",
        url: "/sign-in",
      }),
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
