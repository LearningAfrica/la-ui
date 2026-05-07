import { useState } from "react";

import { cn } from "@/lib/utils";

import { BackgroundPattern } from "./background-pattern";

type AudienceKey = "students" | "teachers" | "leaders";

const TABS: Record<
  AudienceKey,
  { title: string; body: string; items: string[] }
> = {
  students: {
    title: "For students",
    body: "Free, lifelong learning from primary school through professional credentials. In your language.",
    items: [
      "Adaptive pathways",
      "Peer study circles",
      "Offline mode",
      "Recognised credentials",
    ],
  },
  teachers: {
    title: "For teachers",
    body: "Lesson plans aligned to your national curriculum. Co-authored by teachers, for teachers.",
    items: [
      "1,200+ lesson plans",
      "Class analytics",
      "Parent communication",
      "PD library",
    ],
  },
  leaders: {
    title: "For leaders",
    body: "Whether you run a school or a ministry, oversight tools that scale from 30 to 30 million students.",
    items: [
      "Real-time dashboards",
      "Cohort comparisons",
      "Procurement-ready",
      "API & data export",
    ],
  },
};

const TAB_ORDER: AudienceKey[] = ["students", "teachers", "leaders"];

export function LandingPlatform() {
  const [active, setActive] = useState<AudienceKey>("students");
  const tab = TABS[active];

  return (
    <section id="platform" className="bg-la-cream relative overflow-hidden">
      <div className="pointer-events-none absolute -bottom-24 -left-24 hidden size-[360px] md:block">
        <BackgroundPattern kind="weave" tone="dark" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
        <div className="mb-12 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
              ¶ 02 The Platform
            </div>
          </div>
          <h2 className="font-display text-la-ink text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px] md:col-span-9 md:text-[56px]">
            A platform that adapts to every{" "}
            <span className="text-la-forest">role in education.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-12">
          {/* Tab list */}
          <div className="flex flex-row gap-1 md:col-span-3 md:flex-col">
            {TAB_ORDER.map((key) => {
              const isActive = active === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActive(key)}
                  className={cn(
                    "font-display text-la-ink flex flex-1 items-center justify-between rounded px-3 py-3 text-left text-[14px] font-medium transition-colors md:px-4 md:py-4",
                    isActive
                      ? "bg-la-paper border-la-rule border"
                      : "hover:bg-la-paper/60 border border-transparent"
                  )}
                >
                  <span>{TABS[key].title}</span>
                  {isActive && (
                    <span
                      aria-hidden
                      className="bg-la-forest size-1.5 shrink-0 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab body */}
          <div className="bg-la-paper rounded p-7 md:col-span-9 md:p-10">
            <h3 className="font-display text-la-ink text-[28px] leading-tight font-medium tracking-[-0.025em] sm:text-[36px]">
              {tab.title}
            </h3>
            <p className="text-la-ink-2 mt-4 max-w-[560px] text-[16px] leading-[1.55] sm:text-[17px]">
              {tab.body}
            </p>
            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {tab.items.map((item) => (
                <div
                  key={item}
                  className="bg-la-cream font-display text-la-ink flex items-center gap-3 rounded px-4 py-3.5 text-[14px] font-medium"
                >
                  <span
                    aria-hidden
                    className="bg-la-forest size-1.5 shrink-0 rounded-full"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
