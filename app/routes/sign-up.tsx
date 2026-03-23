import { useSearchParams } from "react-router";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { generateSEOTags } from "@/lib/utils/seo";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Sign Up | Learning Africa",
      description:
        "Create your Learning Africa account and start transforming your organization's learning experience",
      url: "/sign-up",
    }),
  ];
}

export default function SignUpPage() {
  const [searchParams] = useSearchParams();

  return (
    <AuthLayout className="py-12">
      <RegisterForm searchParams={searchParams} />
    </AuthLayout>
  );
}
