import { Link } from "react-router";

import { BackgroundPattern } from "./background-pattern";

const COLUMNS = [
  {
    label: "Platform",
    links: [
      { label: "Why Learning Africa", to: "/#why" },
      { label: "Features", to: "/#features" },
      { label: "Solutions", to: "/#sectors" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "Chomoka Studios", to: "https://www.chomoka.com" },
      { label: "Getting started", to: "/#onboarding" },
      { label: "FAQ", to: "/#faq" },
      { label: "Contact", to: "/inquiry" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Terms of Use", to: "/terms" },
      { label: "Data Privacy Policy", to: "/privacy" },
      { label: "Sign in", to: "/sign-in" },
      { label: "Sign up", to: "/sign-up" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-la-rule bg-la-paper relative overflow-hidden border-t">
      <div className="bg-la-cream pointer-events-none relative h-12">
        <BackgroundPattern kind="weave" tone="dark" opacityScale={1.4} />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 pt-12 pb-8 md:px-10 md:pt-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-5">
          <div className="md:col-span-4">
            <img
              src="/brand/logo-full.webp"
              alt="Learning Africa — Education Rethought"
              width={600}
              height={257}
              className="h-12 w-auto object-contain"
              loading="lazy"
              decoding="async"
            />
            <p className="text-la-muted mt-4 max-w-[280px] text-[13px] leading-[1.55]">
              An enterprise-grade learning management system by Chomoka Studios
              Limited — animation, e-learning content, and the platform to
              deliver it.
            </p>
            <address className="text-la-muted mt-4 max-w-[280px] text-[13px] leading-[1.55] not-italic">
              186 Safaripark Ave
              <br />
              Nairobi, Kenya
              <br />
              <a
                href="mailto:info@chomoka.com"
                className="text-la-ink-2 hover:text-la-ink"
              >
                info@chomoka.com
              </a>
            </address>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.label} className="md:col-span-2 md:col-start-auto">
              <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.18em] uppercase">
                {col.label}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to.startsWith("http") ? (
                      <a
                        href={l.to}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-la-ink-2 hover:text-la-ink text-[13px]"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        to={l.to}
                        prefetch="intent"
                        className="text-la-ink-2 hover:text-la-ink text-[13px]"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-la-rule font-display text-la-muted mt-12 flex flex-col gap-2 border-t pt-6 text-[11px] tracking-wide sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Chomoka Studios Limited</span>
          <span>Education Rethought. Do more with Learning Africa.</span>
        </div>
      </div>
    </footer>
  );
}
