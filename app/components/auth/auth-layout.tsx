import ArrowLeft from "~icons/lucide/arrow-left";
import { Link } from "react-router";

import { BackgroundPattern } from "@/components/landing-b/background-pattern";
import { LALogo } from "@/components/landing-b/la-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
  /** Override the left-rail eyebrow + headline */
  eyebrow?: string;
  headline?: React.ReactNode;
  description?: string;
}

const FEATURES = [
  {
    title: "Dedicated workspaces",
    description:
      "Each organization gets its own isolated workspace, members and content.",
  },
  {
    title: "Powerful course builder",
    description:
      "Modules, content blocks, quizzes, AI-assisted authoring — built in.",
  },
  {
    title: "Digital certificates",
    description: "Verifiable credentials issued automatically on completion.",
  },
];

export function AuthLayout({
  children,
  className,
  eyebrow = "Learning Africa",
  headline = (
    <>
      Education infrastructure
      <br />
      <span className="text-la-forest">for the continent.</span>
    </>
  ),
  description = "Free, accredited learning built with educators, ministries, and universities across Africa.",
}: AuthLayoutProps) {
  return (
    <div
      className={cn("bg-la-paper text-la-ink relative min-h-screen", className)}
    >
      {/* Decorative patterns — fixed to viewport, only in true corners so
          they never overlap the form card or copy. Opacity is dialled to
          stay visible as texture without competing with content. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 size-[360px] sm:size-[460px]">
          <BackgroundPattern kind="circles" tone="dark" opacityScale={2.6} />
        </div>
        <div className="absolute -right-28 -bottom-36 hidden size-[360px] md:block lg:size-[460px]">
          <BackgroundPattern kind="rays" tone="dark" opacityScale={2.4} />
        </div>
        <div className="absolute -bottom-24 -left-32 hidden size-[280px] xl:block">
          <BackgroundPattern kind="weave" tone="dark" opacityScale={2.2} />
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col px-5 py-6 md:min-h-screen md:px-10 md:py-10">
        {/* Top utility bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            prefetch="intent"
            className="font-display text-la-ink hover:bg-la-cream inline-flex items-center gap-2 rounded px-2 py-1.5 text-[13px] font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back home
          </Link>
          <ThemeToggle />
        </div>

        {/* Split */}
        <main className="grid flex-1 items-start gap-12 py-10 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-12">
          {/* Left rail — editorial value prop */}
          <aside className="hidden flex-col gap-10 lg:col-span-6 lg:flex xl:col-span-7">
            <div className="flex items-center gap-3">
              <LALogo size={32} />
              <span className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
                {eyebrow}
              </span>
            </div>

            <h1 className="font-display text-la-ink text-[44px] leading-[1.04] font-medium tracking-[-0.04em] xl:text-[56px]">
              {headline}
            </h1>

            <p className="text-la-ink-2 max-w-[480px] text-[15px] leading-[1.6] xl:text-[16px]">
              {description}
            </p>

            <ul className="flex flex-col gap-5">
              {FEATURES.map((f, i) => (
                <li
                  key={f.title}
                  className="border-la-rule flex items-start gap-4 border-t pt-5"
                >
                  <span className="font-display text-la-forest text-[14px] font-medium tabular-nums">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="font-display text-la-ink text-[15px] font-medium tracking-tight">
                      {f.title}
                    </div>
                    <p className="text-la-muted mt-1 text-[13px] leading-[1.55]">
                      {f.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-la-rule bg-la-cream rounded border p-4">
              <p className="font-display text-la-ink text-[13px] leading-[1.55]">
                Built with educators across Africa — schools, universities, and
                ministries.
              </p>
            </div>
          </aside>

          {/* Right — form card */}
          <div className="flex w-full justify-center lg:col-span-6 lg:justify-end xl:col-span-5">
            <div className="border-la-rule-strong bg-la-paper w-full max-w-md rounded-md border p-6 shadow-[0_8px_32px_-16px_rgba(20,41,34,0.22)] sm:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
