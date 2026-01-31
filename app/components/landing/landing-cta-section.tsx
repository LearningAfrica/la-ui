import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function LandingCTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-500 to-red-500" />

      {/* African Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="cta-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="30"
                cy="30"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <circle
                cx="30"
                cy="30"
                r="10"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path d="M30 10v40M10 30h40" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-pattern)" />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute right-10 bottom-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Ready to Transform Your Organization&apos;s Learning?
            </h2>
            <p className="mb-8 text-lg text-amber-100">
              Join hundreds of African organizations that trust Learning Africa
              to deliver impactful learning experiences. Get started today.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/inquiry">
                <Button
                  size="lg"
                  className="w-full bg-white text-amber-600 shadow-lg hover:bg-amber-50 sm:w-auto"
                >
                  Onboard Your Organization
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-white text-white hover:bg-white/10 sm:w-auto"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
              <h3 className="mb-6 text-xl font-bold text-white">
                What You Get:
              </h3>
              <ul className="space-y-4">
                {[
                  "Dedicated workspace for your organization",
                  "Unlimited courses and learners",
                  "Quiz and assessment tools",
                  "Digital certificate issuance",
                  "Progress tracking and analytics",
                  "Priority support from our team",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-white"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
