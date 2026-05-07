import { BackgroundPattern } from "./background-pattern";

const SECTORS = [
  {
    title: "K–12",
    body: "Schools across primary and secondary, with curriculum mapped to national standards.",
    accent: "var(--color-la-forest)",
  },
  {
    title: "Higher Ed",
    body: "Universities offering credit-bearing pathways from foundation through doctoral level.",
    accent: "var(--color-la-forest-soft)",
  },
  {
    title: "Government",
    body: "National rollouts with ministries of education. Population-scale assessment and dashboards.",
    accent: "var(--color-la-amber)",
  },
];

export function LandingSectors() {
  return (
    <section id="sectors" className="bg-la-paper relative overflow-hidden">
      <div className="pointer-events-none absolute -top-16 -right-24 hidden size-[320px] md:block">
        <BackgroundPattern kind="rays" tone="dark" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
        <div className="mb-12 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
              ¶ 03 Sectors
            </div>
          </div>
          <h2 className="font-display text-la-ink text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px] md:col-span-9 md:text-[56px]">
            Three sectors. <span className="text-la-forest">One system.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {SECTORS.map((s) => (
            <article
              key={s.title}
              className="bg-la-cream relative flex flex-col rounded p-7 sm:p-8"
            >
              <span
                aria-hidden
                className="block h-1 w-8"
                style={{ background: s.accent }}
              />
              <div className="font-display text-la-muted mt-7 text-[10px] font-medium tracking-[0.18em] uppercase">
                Sector
              </div>
              <div className="font-display text-la-ink mt-2 text-[36px] leading-tight font-medium tracking-[-0.03em] sm:text-[40px]">
                {s.title}
              </div>
              <p className="text-la-ink-2 mt-4 text-[14px] leading-[1.55]">
                {s.body}
              </p>
              <div className="border-la-rule font-display text-la-ink mt-6 flex items-center justify-between border-t pt-4 text-[12px] font-medium">
                <span>Learn more</span>
                <span aria-hidden>→</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
