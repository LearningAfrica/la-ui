import { BackgroundPattern } from "./background-pattern";

const FEATURES = [
  {
    title: "Live training integration",
    body: "Host real-time virtual classrooms, webinars, and workshops. Sessions are recorded automatically for on-demand access later.",
  },
  {
    title: "Self-paced, 24/7/365 learning",
    body: "Learners work anytime, anywhere, at a pace that suits their own schedule.",
  },
  {
    title: "Device-neutral experience",
    body: "Fully responsive. Smartphones, tablets, laptops, desktops — same course, same quality.",
  },
  {
    title: "Gamification, SCORM & xAPI",
    body: "Drive completion with leaderboards, badges, and points, and track deep interaction data against the standards.",
  },
  {
    title: "Custom evaluations & identity",
    body: "Deploy tailored quizzes and exams, and issue branded certificates automatically to successful learners.",
  },
  {
    title: "Advanced analytics dashboard",
    body: "See learner progress, engagement, and completion rates at the individual or cohort level.",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="bg-la-paper relative overflow-hidden">
      <div className="pointer-events-none absolute -bottom-24 -left-24 hidden size-[420px] md:block">
        <BackgroundPattern kind="weave" tone="dark" opacityScale={2.5} />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
        <div className="mb-12 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
              ¶ 02 Features
            </div>
          </div>
          <h2 className="font-display text-la-ink text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px] md:col-span-9 md:text-[56px]">
            Everything you need to{" "}
            <span className="text-la-forest">run training.</span>
          </h2>
        </div>

        <div className="mb-5">
          <img
            src="/illustrations/live-session.webp"
            alt="A learner joining a live session from a tablet"
            width={1400}
            height={745}
            className="mx-auto w-full max-w-[720px] object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="bg-la-rule grid gap-px overflow-hidden rounded sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="bg-la-paper p-7 sm:p-8">
              <span aria-hidden className="bg-la-forest block h-1 w-8" />
              <h3 className="font-display text-la-ink mt-6 text-[18px] leading-snug font-medium tracking-[-0.02em]">
                {f.title}
              </h3>
              <p className="text-la-ink-2 mt-3 text-[14px] leading-[1.55]">
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
