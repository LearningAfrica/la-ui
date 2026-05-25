import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { BackgroundPattern } from "./background-pattern";

const STEPS = [
  {
    n: "01",
    title: "Tell us about your organization",
    body: "Share who you are — company, NGO, training provider, or institution — plus the size and what you want to teach.",
  },
  {
    n: "02",
    title: "We review and reach out",
    body: "Our team reviews each request and gets back within a few business days.",
  },
  {
    n: "03",
    title: "Set up your workspace",
    body: "Once approved, you create your account, invite your team, and start building.",
  },
];

export function LandingOnboarding() {
  return (
    <section id="onboarding" className="bg-la-cream relative overflow-hidden">
      <div className="pointer-events-none absolute -top-16 -right-24 hidden size-[320px] md:block">
        <BackgroundPattern kind="diamonds" tone="dark" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
        <div className="mb-12 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
              ¶ 01 Onboarding
            </div>
          </div>
          <h2 className="font-display text-la-ink text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px] md:col-span-9 md:text-[56px]">
            Onboard your organization{" "}
            <span className="text-la-forest">in three steps.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-12">
          <ol className="flex flex-col gap-5 md:col-span-7">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="bg-la-paper border-la-rule flex gap-5 rounded border p-5 sm:p-6"
              >
                <span className="font-display text-la-forest text-[28px] leading-none font-medium tracking-[-0.04em] sm:text-[32px]">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display text-la-ink text-[18px] leading-tight font-medium tracking-tight sm:text-[20px]">
                    {step.title}
                  </h3>
                  <p className="text-la-ink-2 mt-2 text-[14px] leading-[1.6]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <aside className="bg-la-forest text-la-paper flex flex-col rounded p-7 sm:p-8 md:col-span-5">
            <p className="font-display text-la-paper/70 text-[10px] font-medium tracking-[0.25em] uppercase">
              Ready when you are
            </p>
            <h3 className="font-display mt-3 text-[28px] leading-tight font-medium tracking-[-0.025em] sm:text-[32px]">
              Submit an inquiry. Free, no commitment.
            </h3>
            <p className="text-la-paper/80 mt-4 text-[14px] leading-[1.6]">
              We review every request and reply personally. Tell us what you
              want to teach, who&apos;ll learn, and we&apos;ll take it from
              there.
            </p>
            <div className="mt-auto flex flex-col gap-2 pt-8 sm:flex-row">
              <Link
                to="/inquiry"
                prefetch="intent"
                className="font-display bg-la-paper text-la-ink hover:bg-la-cream inline-flex h-12 flex-1 items-center justify-center gap-2 rounded px-5 text-[14px] font-medium transition-colors"
              >
                Start your inquiry
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/sign-up"
                prefetch="intent"
                className="font-display border-la-paper hover:bg-la-paper/10 inline-flex h-12 flex-1 items-center justify-center rounded border px-5 text-[14px] font-medium"
              >
                Or sign up
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
