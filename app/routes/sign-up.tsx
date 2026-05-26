import { useSearchParams } from "react-router";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { generateSEOTags } from "@/lib/utils/seo";
import { webPageSchema } from "@/lib/utils/structured-data";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Sign Up | Learning Africa",
      description:
        "Create your Learning Africa account and start transforming your organization's learning experience",
      url: "/sign-up",
      jsonLd: webPageSchema({
        name: "Sign Up",
        description:
          "Create a free Learning Africa account to build courses, track progress, and issue certificates.",
        url: "/sign-up",
      }),
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
