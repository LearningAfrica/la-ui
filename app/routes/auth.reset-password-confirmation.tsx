import { PatternLayout } from "@/components/pattern-layout";
import { ResetPasswordConfirmation } from "@/components/auth/reset-password-confirmation";

export default function ResetPasswordConfirmationPage() {
  return (
    <PatternLayout className="flex items-center justify-center py-12">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
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
              <div className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-md"
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

          {/* Right Side - Confirmation Screen */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-amber-100 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
              <ResetPasswordConfirmation />
            </div>
          </div>
        </div>
      </div>
    </PatternLayout>
  );
}
