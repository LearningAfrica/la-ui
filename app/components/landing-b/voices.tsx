import { BackgroundPattern } from "./background-pattern";

const ROLES = [
  {
    role: "Headteachers",
    body: "Run a school or a network. Curriculum, assessment, and oversight in one place.",
    accent: "var(--color-la-forest)",
  },
  {
    role: "Curriculum directors",
    body: "Co-author lesson plans, share across districts, and keep them in lockstep with national standards.",
    accent: "var(--color-la-forest-soft)",
  },
  {
    role: "Learners",
    body: "Free, lifelong learning from primary school through professional credentials. In your language.",
    accent: "var(--color-la-amber)",
  },
];

export function LandingVoices() {
  return (
    <section id="voices" className="bg-la-cream relative overflow-hidden">
      <div className="pointer-events-none absolute -top-12 -left-20 hidden size-[280px] md:block">
        <BackgroundPattern kind="circles" tone="dark" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
        <div className="mb-12 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
              ¶ 06 Built with educators
            </div>
          </div>
          <h2 className="font-display text-la-ink text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px] md:col-span-9 md:text-[56px]">
            <span className="text-la-forest">Designed for</span> the classroom.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {ROLES.map((r) => (
            <article
              key={r.role}
              className="bg-la-paper relative flex flex-col rounded p-7"
            >
              <span
                aria-hidden
                className="block h-1 w-8"
                style={{ background: r.accent }}
              />
              <div className="font-display text-la-muted mt-7 text-[10px] font-medium tracking-[0.18em] uppercase">
                For
              </div>
              <div className="font-display text-la-ink mt-2 text-[24px] leading-tight font-medium tracking-[-0.02em]">
                {r.role}
              </div>
              <p className="text-la-ink-2 mt-4 text-[14px] leading-[1.55]">
                {r.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
