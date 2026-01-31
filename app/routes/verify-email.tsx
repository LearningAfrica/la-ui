import { useSearchParams } from "react-router";
import { VerifyEmailComponent } from "@/components/auth/verify-email-component";
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* African Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="verify-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0L60 30L30 60L0 30Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle
                cx="30"
                cy="30"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#verify-pattern)" />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-orange-400/20 to-amber-400/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10">
        <VerifyEmailComponent token={token} />
      </div>
    </div>
  );
}
