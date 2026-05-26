import { useState } from "react";
import { Link } from "react-router";

import { OptimisticImage } from "@/components/ui/optimistic-image";
import { useAuthStore } from "@/stores/auth/auth-hooks";

import { AfricaMap } from "./africa-map";
import { BackgroundPattern } from "./background-pattern";

const HIGHLIGHTS = [
  { l: "Free to start" },
  { l: "Multi-tenant" },
  { l: "Verifiable certificates" },
  { l: "Self-serve setup" },
];

export function LandingHero() {
  const { isAuthenticated } = useAuthStore();
  const [hovered, setHovered] = useState<string | null>(null);

  const highlights: Record<string, string> = hovered
    ? { [hovered]: "var(--color-la-forest)" }
    : {
        NG: "var(--color-la-forest)",
        KE: "var(--color-la-forest)",
        ZA: "var(--color-la-forest)",
        EG: "var(--color-la-forest)",
        GH: "var(--color-la-forest-soft)",
        ET: "var(--color-la-forest-soft)",
        TZ: "var(--color-la-forest-soft)",
        SN: "var(--color-la-amber)",
        RW: "var(--color-la-amber)",
        UG: "var(--color-la-amber)",
        MA: "var(--color-la-amber)",
      };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-dots"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>
      <div className="pointer-events-none absolute -top-20 -right-32 hidden size-[420px] md:block">
        <BackgroundPattern kind="circles" tone="dark" opacityScale={0.8} />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 pt-12 pb-16 md:px-10 md:pt-16 md:pb-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-5">
          {/* Left: text */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <div className="mb-7 flex items-center gap-3">
              <span aria-hidden className="bg-la-ink h-px w-6 shrink-0" />
              <span className="font-display text-la-muted text-[10px] font-medium tracking-[0.2em] uppercase">
                Empowering Africa Through Learning
              </span>
            </div>
            <h1 className="font-display text-la-ink text-[44px] leading-[1.02] font-medium tracking-[-0.04em] sm:text-[56px] lg:text-[72px] lg:tracking-[-0.045em]">
              Transform Your
              <br />
              Organization&apos;s
              <br />
              <span className="text-la-forest">Learning.</span>
            </h1>
            <p className="text-la-ink-2 mt-7 max-w-[520px] text-[16px] leading-[1.55] sm:text-[17px]">
              The complete learning management platform for modern
              organizations. Create courses, track progress, and issue
              certificates — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  prefetch="intent"
                  className="font-display bg-la-forest text-la-paper inline-flex h-12 items-center rounded px-6 text-[14px] font-medium transition-colors hover:bg-(--color-la-forest-deep)"
                >
                  Go to dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    to="/sign-up"
                    prefetch="intent"
                    className="font-display bg-la-forest text-la-paper inline-flex h-12 items-center rounded px-6 text-[14px] font-medium transition-colors hover:bg-(--color-la-forest-deep)"
                  >
                    Sign up — it&apos;s free →
                  </Link>
                  <Link
                    to="/sign-in"
                    prefetch="intent"
                    className="font-display border-la-rule-strong text-la-ink hover:bg-la-cream inline-flex h-12 items-center rounded border px-6 text-[14px] font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </>
              )}
              <span className="text-la-muted text-[13px]">
                · No credit card
              </span>
            </div>
          </div>

          {/* Right: photo + map */}
          <div className="flex flex-col gap-3 lg:col-span-6">
            <div className="relative aspect-[5/4] overflow-hidden rounded">
              <OptimisticImage
                src="https://images.unsplash.com/photo-1620969910995-4bbe4eaa32c1?q=80&w=820&auto=format&fit=crop"
                alt="Learners in an African classroom using Learning Africa platform"
                wrapperClassName="absolute inset-0"
                fetchPriority="high"
                loading="eager"
                decoding="async"
              />
              <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3">
                <div className="bg-la-paper/95 font-display text-la-ink rounded px-3.5 py-2.5 text-[12px] backdrop-blur-sm">
                  <div className="font-semibold">Pan-African platform</div>
                  <div className="text-la-muted text-[11px]">
                    Hover the map below
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-stretch gap-3">
              <div className="bg-la-cream grid aspect-[8/9] w-[140px] shrink-0 place-items-center rounded p-3">
                <AfricaMap
                  fill="var(--color-la-ink)"
                  stroke="var(--color-la-cream)"
                  strokeWidth={2}
                  highlights={highlights}
                  hoveredCountry={hovered}
                  onHover={setHovered}
                />
              </div>
              <div className="bg-la-cream flex flex-1 flex-col justify-center rounded px-5 py-4">
                <div className="la-eyebrow mb-1.5">
                  {hovered ? hovered : "Across the continent"}
                </div>
                <div className="font-display text-la-ink mb-2 text-[18px] leading-snug font-medium tracking-tight">
                  {hovered
                    ? "Hover or click to explore"
                    : "Learners and instructors in every country."}
                </div>
                <div className="text-la-muted text-[12px]">
                  {hovered
                    ? "More detail coming soon"
                    : "Hover the map to see countries"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight strip on rule line */}
        <div className="border-la-rule mt-16 grid grid-cols-2 border-t md:mt-20 md:grid-cols-4">
          {HIGHLIGHTS.map((s, i) => (
            <div
              key={s.l}
              className="border-la-rule px-1 py-6 first:pl-0 md:border-l md:pl-6 md:first:border-l-0"
              style={{ borderLeftWidth: i === 0 ? 0 : undefined }}
            >
              <div className="bg-la-forest mb-3 h-1 w-8" aria-hidden />
              <div className="font-display text-la-ink text-[18px] leading-snug font-medium tracking-tight">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
