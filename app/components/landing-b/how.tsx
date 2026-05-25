import { BackgroundPattern } from "./background-pattern";

const STEPS = [
  {
    title: "Set up your organization",
    body: "Create your workspace and invite your team.",
  },
  {
    title: "Build your courses",
    body: "Author modules, lessons, and quizzes — your way.",
  },
  {
    title: "Track learner progress",
    body: "Enroll your team and see how they're doing.",
  },
  {
    title: "Issue certificates",
    body: "Recognize completion with verifiable credentials.",
  },
];

export function LandingHow() {
  return (
    <section id="how" className="bg-la-paper relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -bottom-20 hidden size-[300px] md:block">
        <BackgroundPattern kind="weave" tone="dark" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
        <div className="mb-12 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
              ¶ 05 How it works
            </div>
          </div>
          <h2 className="font-display text-la-ink text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px] md:col-span-9 md:text-[56px]">
            Four steps to launch.
          </h2>
        </div>

        <ol className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-5">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-display text-la-forest text-[32px] leading-none font-medium tracking-[-0.04em] sm:text-[40px]">
                  0{i + 1}
                </span>
                <span
                  aria-hidden
                  className="bg-la-rule-strong h-px flex-1 self-center"
                />
              </div>
              <h3 className="font-display text-la-ink text-[18px] leading-snug font-medium tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="text-la-muted mt-2 text-[14px] leading-[1.55]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
