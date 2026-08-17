import { useAuthStore } from "@/stores/auth/auth-hooks";

import { LandingFooter } from "./footer";
import { LandingHeader } from "./header";

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
};

/**
 * Page frame for long-form static pages (terms, privacy) — landing header and
 * footer around a single readable column.
 */
export function LegalShell({ eyebrow, title, intro, children }: Props) {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="bg-la-paper text-la-ink min-h-screen">
      <LandingHeader isAuthenticated={isAuthenticated} />
      <main className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20">
        <div className="max-w-[760px]">
          <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
            {eyebrow}
          </div>
          <h1 className="font-display text-la-ink mt-4 text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px]">
            {title}
          </h1>
          {intro && (
            <p className="text-la-ink-2 mt-6 text-[16px] leading-[1.6]">
              {intro}
            </p>
          )}
          <div className="border-la-rule mt-10 space-y-8 border-t pt-10">
            {children}
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

/** One numbered/titled clause inside a LegalShell. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-la-ink text-[18px] leading-snug font-medium tracking-[-0.02em] sm:text-[20px]">
        {heading}
      </h2>
      <div className="text-la-ink-2 mt-3 space-y-3 text-[14px] leading-[1.7]">
        {children}
      </div>
    </section>
  );
}
