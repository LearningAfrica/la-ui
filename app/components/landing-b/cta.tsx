import { Link } from "react-router";

import { useAuthStore } from "@/stores/auth/auth-hooks";

import { BackgroundPattern } from "./background-pattern";

export function LandingCTA() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="bg-la-paper">
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
        <div className="bg-la-forest text-la-paper relative flex flex-col gap-8 overflow-hidden rounded p-10 sm:p-12 md:flex-row md:items-center md:justify-between md:p-16">
          <div className="pointer-events-none absolute inset-0">
            <BackgroundPattern kind="rays" tone="light" opacityScale={1.4} />
          </div>
          <div className="relative">
            <div className="font-display text-la-paper/70 text-[10px] font-medium tracking-[0.25em] uppercase">
              Free · Always
            </div>
            <h2 className="font-display mt-4 text-[36px] leading-[1.02] font-medium tracking-[-0.04em] sm:text-[48px] md:text-[56px]">
              Start learning, free.
            </h2>
          </div>
          <div className="relative flex shrink-0 flex-wrap gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                prefetch="intent"
                className="font-display bg-la-paper text-la-ink hover:bg-la-cream inline-flex h-12 items-center rounded px-6 text-[14px] font-medium transition-colors"
              >
                Go to dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/sign-up"
                  prefetch="intent"
                  className="font-display bg-la-paper text-la-ink hover:bg-la-cream inline-flex h-12 items-center rounded px-6 text-[14px] font-medium transition-colors"
                >
                  Sign up →
                </Link>
                <Link
                  to="/sign-in"
                  prefetch="intent"
                  className="font-display border-la-paper text-la-paper hover:bg-la-paper/10 inline-flex h-12 items-center rounded border px-6 text-[14px] font-medium transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
