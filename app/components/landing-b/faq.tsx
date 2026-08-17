import { BackgroundPattern } from "./background-pattern";

export const FAQS = [
  {
    q: "What is an LMS (Learning Management System)?",
    a: "An LMS is a secure software application that centralizes everything related to your training. It lets you manage users, deploy multimedia learning content, track individual progress, administer exams, and generate comprehensive compliance reports.",
  },
  {
    q: "What content formats can be loaded into Learning Africa?",
    a: "High-definition video: upload your existing lectures, Zoom recordings, or raw footage — or let Chomoka Studios slice, brand, and add professional graphics to maximize engagement. SCORM / Tin-Can (xAPI): we fully support interactive, trackable industry-standard packages, whether we author the content, train your internal staff to author it, or deploy third-party courses.",
  },
  {
    q: "How do we get started?",
    a: "Explore the platform as a learner, schedule a discovery call for a free demonstration customized to your organization, then begin your transition to modern training.",
  },
  {
    q: "Who builds the courses — us or you?",
    a: "Either. Your instructors can author courses directly in the platform, or Chomoka Studios can produce them for you: animation, interactive infographics, gamified modules, and bite-sized learning nuggets tailored to your audience.",
  },
];

export function LandingFAQ() {
  return (
    <section id="faq" className="bg-la-cream relative overflow-hidden">
      <div className="pointer-events-none absolute -top-12 -left-20 hidden size-[280px] md:block">
        <BackgroundPattern kind="circles" tone="dark" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
        <div className="mb-12 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
              ¶ 06 Questions
            </div>
          </div>
          <h2 className="font-display text-la-ink text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px] md:col-span-9 md:text-[56px]">
            Frequently asked <span className="text-la-forest">questions.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-12">
          <div className="hidden md:col-span-4 md:block">
            <img
              src="/illustrations/self-paced.webp"
              alt="A learner reading on a couch inside a laptop screen surrounded by bookshelves"
              width={1400}
              height={889}
              className="w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="flex flex-col gap-3 md:col-span-8">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="bg-la-paper group border-la-rule rounded border p-5 sm:p-6"
              >
                <summary className="font-display text-la-ink flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] leading-snug font-medium tracking-[-0.02em] sm:text-[18px]">
                  {f.q}
                  <span
                    aria-hidden
                    className="text-la-forest shrink-0 text-[20px] leading-none transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="text-la-ink-2 mt-4 text-[14px] leading-[1.6]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
