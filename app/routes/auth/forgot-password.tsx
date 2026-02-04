import { PatternLayout } from "@/components/pattern-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { generateSEOTags } from "@/lib/utils/seo";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Forgot Password | Learning Africa",
      description: "Reset your Learning Africa account password",
      url: "/auth/forgot-password",
    }),
  ];
}

export default function ForgotPasswordPage() {
  return (
    <PatternLayout className="flex items-center justify-center">
      {/* Auth Container */}
      <div className="w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Side - Branding */}
          <div className="hidden items-center lg:flex">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg">
                  <span className="text-2xl font-bold text-white">LA</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Learning Africa
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Transform Learning in Africa
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <svg
                      className="h-5 w-5 text-amber-600 dark:text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Secure Access
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your account security is our priority with encrypted
                      password reset
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <svg
                      className="h-5 w-5 text-orange-600 dark:text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Easy Recovery
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive password reset link instantly in your email
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <svg
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Password Protection
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create a strong password to protect your account
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-amber-400 to-orange-500 text-xs font-medium text-white dark:border-gray-800"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    500+ Organizations
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join hundreds of African organizations already transforming
                  their learning experience
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-amber-100 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </PatternLayout>
  );
}
