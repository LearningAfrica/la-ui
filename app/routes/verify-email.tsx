import { useSearchParams } from "react-router";
import { VerifyEmailComponent } from "@/components/auth/verify-email-component";
import { PatternLayout } from "@/components/pattern-layout";
import { generateSEOTags } from "@/lib/utils/seo";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Verify Email | Learning Africa",
      description:
        "Verify your email address to activate your Learning Africa account",
      url: "/verify-email",
    }),
  ];
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") || "";

  return (
    <PatternLayout patternId="verify-pattern">
      <VerifyEmailComponent token={token} email={email} />
    </PatternLayout>
  );
}
