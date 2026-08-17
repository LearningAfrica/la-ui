import { BackgroundPattern } from "./background-pattern";

const PILLARS = [
  {
    label: "Engagement",
    body: "Who started, who stalled, and which lessons lose people — per learner and per cohort.",
  },
  {
    label: "Completion",
    body: "Lesson, module, and course completion rates, tracked against your deadlines.",
  },
  {
    label: "Assessment",
    body: "Quiz and exam results, with certificates issued automatically on a pass.",
  },
  {
    label: "Audit trail",
    body: "SCORM and xAPI records that stand up as evidence of structured training.",
  },
];

export function LandingImpact() {
  return (
    <section
      id="impact"
      className="bg-la-ink text-la-paper relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <BackgroundPattern kind="diamonds" tone="light" opacityScale={1.2} />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-5">
          <div className="md:col-span-5">
            <div className="font-display text-[10px] font-medium tracking-[0.25em] text-(--color-la-amber) uppercase">
              ¶ 04 Analytics
            </div>
            <h2 className="font-display text-la-paper mt-4 text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px] md:text-[56px]">
              Deep insight, not just a completion tick.
            </h2>
            <p className="text-la-paper/70 mt-6 max-w-[440px] text-[16px] leading-[1.6]">
              Every interaction is tracked to standard, so you can prove what
              was learned — to your board, or to your regulator.
            </p>
          </div>

          <div className="bg-la-paper/15 grid gap-px overflow-hidden rounded md:col-span-6 md:col-start-7 md:grid-cols-2">
            {PILLARS.map((p) => (
              <div
                key={p.label}
                className="bg-la-ink px-7 py-8 sm:px-7 sm:py-9"
              >
                <span
                  aria-hidden
                  className="block h-1 w-7 bg-(--color-la-amber)"
                />
                <div className="font-display text-la-paper mt-6 text-[16px] leading-snug font-medium tracking-tight">
                  {p.label}
                </div>
                <div className="text-la-paper/65 mt-2 text-[12px] leading-[1.55]">
                  {p.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
