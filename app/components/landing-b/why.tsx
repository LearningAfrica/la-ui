import { BackgroundPattern } from "./background-pattern";

const REASONS = [
  {
    title: "Built for Africa, scaled for the world",
    body: "Seamless digital delivery optimized for learners wherever they are — on the bandwidth and devices they actually have.",
    accent: "var(--color-la-forest)",
  },
  {
    title: "Hybrid and future-ready",
    body: "Bridge live, instructor-led training and flexible self-paced learning without running two systems.",
    accent: "var(--color-la-forest-soft)",
  },
  {
    title: "The content + platform advantage",
    body: "Unlike standard LMS providers, we also produce the courses — animation, interactive infographics, and learning nuggets tailored to your audience.",
    accent: "var(--color-la-amber)",
  },
  {
    title: "Unmatched cost efficiencies",
    body: "Move training to a secure cloud-hosted environment and cut the logistics, travel, and venue bill that comes with classroom delivery.",
    accent: "var(--color-la-terracotta)",
  },
];

export function LandingWhy() {
  return (
    <section id="why" className="bg-la-cream relative overflow-hidden">
      <div className="pointer-events-none absolute -top-16 -right-24 hidden size-[320px] md:block">
        <BackgroundPattern kind="diamonds" tone="dark" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
        <div className="mb-12 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
              ¶ 01 Why Learning Africa
            </div>
          </div>
          <h2 className="font-display text-la-ink text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px] md:col-span-9 md:text-[56px]">
            Static PDFs and classrooms are{" "}
            <span className="text-la-forest">no longer enough.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-12">
          <div className="grid gap-5 sm:grid-cols-2 md:col-span-7">
            {REASONS.map((r) => (
              <article
                key={r.title}
                className="bg-la-paper flex flex-col rounded p-6 sm:p-7"
              >
                <span
                  aria-hidden
                  className="block h-1 w-8"
                  style={{ background: r.accent }}
                />
                <h3 className="font-display text-la-ink mt-6 text-[18px] leading-snug font-medium tracking-[-0.02em] sm:text-[20px]">
                  {r.title}
                </h3>
                <p className="text-la-ink-2 mt-3 text-[14px] leading-[1.55]">
                  {r.body}
                </p>
              </article>
            ))}
          </div>

          <div className="relative md:col-span-5">
            <img
              src="/illustrations/virtual-classroom.webp"
              alt="An instructor presenting from a phone screen to a learner at a desk"
              width={1400}
              height={1472}
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
