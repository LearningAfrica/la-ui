import { Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth/auth-store";

function getDashboardPath(role: string | undefined): string {
  switch (role) {
    case "super_admin":
      return "/super-admin";
    case "user":
      return "/dashboard";
    default:
      return "/";
  }
}

export default function HeroSection() {
  const { user, isAuthenticated } = useAuthStore();

  // Check if user can access a dashboard
  const isSuperAdmin = user?.role === "super_admin";
  const canCreateOrg = user?.canCreateOrg;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* African Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="african-pattern"
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
              <path
                d="M15 15L45 15L45 45L15 45Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#african-pattern)"
            className="text-amber-900"
          />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl" />
      <div className="absolute right-10 bottom-20 h-48 w-48 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 h-24 w-24 rounded-full bg-gradient-to-br from-red-400/20 to-red-500/20 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              Empowering Africa Through Learning
            </div>

            <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Transform Your
              <span className="block bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Organization&apos;s Learning
              </span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-gray-600 sm:text-xl">
              The complete learning management platform designed for African
              organizations. Create courses, track progress, and issue
              certificates - all in one place.
            </p>

            {/* Role-specific CTAs */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              {isSuperAdmin ? (
                // Super Admin sees dashboard and inquiries links
                <>
                  <Link to="/super-admin/inquiries">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:from-amber-600 hover:to-orange-700 hover:shadow-amber-500/50 sm:w-auto"
                    >
                      Manage Inquiries
                    </Button>
                  </Link>
                  <Link to="/super-admin">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-2 border-amber-600 text-amber-700 hover:bg-amber-50 sm:w-auto"
                    >
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : canCreateOrg ? (
                // User with canCreateOrg can access their organization dashboard
                <>
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:from-amber-600 hover:to-orange-700 hover:shadow-amber-500/50 sm:w-auto"
                    >
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : isAuthenticated ? (
                // Logged in user without canCreateOrg - can submit/check inquiry
                <>
                  <Link to="/inquiry">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:from-amber-600 hover:to-orange-700 hover:shadow-amber-500/50 sm:w-auto"
                    >
                      Onboard Your Organization
                    </Button>
                  </Link>
                  <Link to="/inquiry/status">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-2 border-amber-600 text-amber-700 hover:bg-amber-50 sm:w-auto"
                    >
                      Check Inquiry Status
                    </Button>
                  </Link>
                </>
              ) : (
                // Not logged in - show onboard and sign in
                <>
                  <Link to="/auth/register">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:from-amber-600 hover:to-orange-700 hover:shadow-amber-500/50 sm:w-auto"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-2 border-amber-600 text-amber-700 hover:bg-amber-50 sm:w-auto"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-medium text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-500">Organizations trust us</p>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto aspect-square w-full max-w-lg">
              {/* Main Circle */}
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 opacity-20" />

              {/* Content Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 left-10 rounded-2xl border border-amber-100 bg-white p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">150+ Courses</p>
                    <p className="text-sm text-gray-500">Active learning</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute right-0 bottom-20 rounded-2xl border border-amber-100 bg-white p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      10K+ Certificates
                    </p>
                    <p className="text-sm text-gray-500">Issued to date</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-1/3 right-10 rounded-2xl border border-amber-100 bg-white p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-violet-500">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">50K+ Learners</p>
                    <p className="text-sm text-gray-500">Across Africa</p>
                  </div>
                </div>
              </motion.div>

              {/* Center Logo */}
              <div className="absolute top-1/2 left-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/50">
                <span className="text-4xl font-bold text-white">LA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-amber-400 p-2"
        >
          <div className="h-2 w-1 rounded-full bg-amber-400" />
        </motion.div>
      </div>
    </section>
  );
}
