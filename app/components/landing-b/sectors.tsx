import { Link } from "react-router";

import { BackgroundPattern } from "./background-pattern";

const SECTORS = [
  {
    title: "Businesses & corporates",
    body: "Train global or decentralized teams without disrupting daily operations — onboarding for new hires, upskilling for remote teams and mobile sales forces.",
    cta: "Drive growth",
    accent: "var(--color-la-forest)",
  },
  {
    title: "Regulated institutions",
    body: "Take the headache out of compliance. Give your regulator verifiable evidence of structured learning, audit trails, and annual completions.",
    cta: "Ensure compliance",
    accent: "var(--color-la-terracotta)",
  },
  {
    title: "Member-based organizations",
    body: "Deliver professional development, CPD credits, or exclusive member training through a dedicated, branded portal.",
    cta: "Engage your members",
    accent: "var(--color-la-forest-soft)",
  },
  {
    title: "Academic institutions",
    body: "Bring curriculum to life. Move into hybrid learning with rich multimedia content, interactive assignments, and student tracking.",
    cta: "Modernize your classroom",
    accent: "var(--color-la-amber)",
  },
  {
    title: "Instructors & consultants",
    body: "Scale your expertise beyond the physical classroom. Convert offline programs into polished, repeatable digital courses.",
    cta: "Digitize your expertise",
    accent: "var(--color-la-forest)",
  },
  {
    title: "Custom solutions",
    body: "Have a unique training challenge or an ambitious project? Our production team co-creates learning environments built to your requirements.",
    cta: "Partner with us",
    accent: "var(--color-la-terracotta)",
  },
];

export function LandingSectors() {
  return (
    <section id="sectors" className="bg-la-cream relative overflow-hidden">
      <div className="pointer-events-none absolute -top-16 -right-24 hidden size-[320px] md:block">
        <BackgroundPattern kind="rays" tone="dark" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
        <div className="mb-12 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
              ¶ 03 Solutions by industry
            </div>
          </div>
          <h2 className="font-display text-la-ink text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px] md:col-span-9 md:text-[56px]">
            Built for every kind of{" "}
            <span className="text-la-forest">organization.</span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((s) => (
            <article
              key={s.title}
              className="bg-la-paper relative flex flex-col rounded p-7 sm:p-8"
            >
              <span
                aria-hidden
                className="block h-1 w-8"
                style={{ background: s.accent }}
              />
              <h3 className="font-display text-la-ink mt-7 text-[24px] leading-tight font-medium tracking-[-0.025em] sm:text-[28px]">
                {s.title}
              </h3>
              <p className="text-la-ink-2 mt-4 text-[14px] leading-[1.55]">
                {s.body}
              </p>
              <Link
                to="/inquiry"
                prefetch="intent"
                className="border-la-rule font-display text-la-ink hover:text-la-forest mt-auto flex items-center justify-between border-t pt-4 text-[12px] font-medium transition-colors"
              >
                <span>{s.cta}</span>
                <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
