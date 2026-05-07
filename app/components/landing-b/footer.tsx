import { Link } from "react-router";

import { BackgroundPattern } from "./background-pattern";
import { LALogo } from "./la-logo";

const COLUMNS = [
  {
    label: "Platform",
    links: [
      { label: "For students", to: "#platform" },
      { label: "For teachers", to: "#platform" },
      { label: "For leaders", to: "#platform" },
      { label: "Enterprise", to: "#platform" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", to: "#" },
      { label: "Impact", to: "#impact" },
      { label: "Press", to: "#" },
      { label: "Careers", to: "#" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Help centre", to: "#" },
      { label: "Sign in", to: "/sign-in" },
      { label: "Sign up", to: "/sign-up" },
      { label: "Contact", to: "/inquiry" },
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
            <div className="font-display text-la-ink flex items-center gap-2 text-[14px] font-semibold">
              <LALogo />
              Learning Africa
            </div>
            <p className="text-la-muted mt-4 max-w-[280px] text-[13px] leading-[1.55]">
              Education infrastructure built for the continent.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.label} className="md:col-span-2 md:col-start-auto">
              <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.18em] uppercase">
                {col.label}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to.startsWith("/") ? (
                      <Link
                        to={l.to}
                        prefetch="intent"
                        className="text-la-ink-2 hover:text-la-ink text-[13px]"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.to}
                        className="text-la-ink-2 hover:text-la-ink text-[13px]"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-la-rule font-display text-la-muted mt-12 flex flex-col gap-2 border-t pt-6 text-[11px] tracking-wide sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Learning Africa</span>
          <span>Made for Africa</span>
        </div>
      </div>
    </footer>
  );
}
