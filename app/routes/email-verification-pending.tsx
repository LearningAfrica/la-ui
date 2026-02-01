import { useSearchParams } from "react-router";
import { EmailVerificationPending } from "@/components/auth/email-verification-pending";
import { PatternLayout } from "@/components/pattern-layout";
import { generateSEOTags } from "@/lib/utils/seo";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Email Verification Pending | Learning Africa",
      description:
        "Please check your email to verify your Learning Africa account",
      url: "/email-verification-pending",
    }),
  ];
}

export default function EmailVerificationPendingPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  return (
    <PatternLayout patternId="pending-pattern">
      <EmailVerificationPending email={email || undefined} />
    </PatternLayout>
  );
}
