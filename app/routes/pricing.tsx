import { href } from "react-router";
import { Link } from "react-router";

import {
  BackgroundPattern,
  LandingFooter,
  LandingHeader,
} from "@/components/landing-b";
import { generateSEOTags } from "@/lib/utils/seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/utils/structured-data";
import { useAuthStore } from "@/stores/auth/auth-hooks";

const PACKAGES = [
  {
    name: "Content production",
    lead: "We design and build the course.",
    body: "Per topic or unit, priced by the length of the finished learning hour — one hour being the progress an average learner makes.",
    items: [
      "Course topic/unit design & development",
      "Output packaged as SCORM / xAPI (Tin Can)",
      "Hosted on your own e-learning portal",
      "Animated video produced and quoted separately",
    ],
    accent: "var(--color-la-forest)",
  },
  {
    name: "Platform deployment",
    lead: "We host, deliver, and track it.",
    body: "Priced per learner and per course, billed quarterly, with volume tiers that drop sharply as your cohort grows.",
    items: [
      "SCORM / xAPI + video content hosting",
      "Zoom meeting integration for live sessions",
      "12-month completion window per course",
      "Volume pricing across learners and course counts",
    ],
    accent: "var(--color-la-terracotta)",
    featured: true,
  },
  {
    name: "Custom & co-creation",
    lead: "Something the shelf doesn't hold.",
    body: "Bespoke learning environments, animation-led programmes, and content built to your technical requirements by our production team.",
    items: [
      "Custom animation and motion graphics",
      "Interactive infographics and learning nuggets",
      "Gamified programme design",
      "Video editing on recorded live classes",
    ],
    accent: "var(--color-la-amber)",
  },
];

const NOTES = [
  "Content design is priced per finished learning hour, calculated as the progress made by an average learner.",
  "Animated video development is charged separately, based on the number of videos and scope complexity.",
  "Costs are exclusive of VAT at 16%, and net of any applicable taxes for work outside Kenya.",
  "Learners are expected to complete their courses within the indicated period.",
  "Zoom integration excludes Zoom subscription fees.",
];

export function meta() {
  return [
    ...generateSEOTags({
      title: "Pricing — Learning Africa",
      description:
        "Content production, platform deployment, and custom e-learning packages from Learning Africa and Chomoka Studios. Request a quote for your organization.",
      url: href("/pricing"),
      image: "/og.png",
      keywords:
        "learning africa pricing,lms pricing kenya,e-learning content development cost,scorm course development,corporate training pricing",
      jsonLd: [
        webPageSchema({
          name: "Pricing",
          description:
            "Content production, platform deployment, and custom e-learning packages from Learning Africa.",
          url: "/pricing",
        }),
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" },
        ]),
      ],
    }),
  ];
}

export default function Pricing() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="bg-la-paper text-la-ink min-h-screen">
      <LandingHeader isAuthenticated={isAuthenticated} />
      <main>
        <section className="bg-la-cream relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-24 hidden size-[320px] md:block">
            <BackgroundPattern kind="diamonds" tone="dark" />
          </div>
          <div className="relative mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20">
            <div className="grid gap-10 md:grid-cols-12 md:gap-5">
              <div className="md:col-span-7">
                <div className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
                  Pricing
                </div>
                <h1 className="font-display text-la-ink mt-4 text-[36px] leading-[1.05] font-medium tracking-[-0.035em] sm:text-[44px] md:text-[56px]">
                  Priced around{" "}
                  <span className="text-la-forest">your programme.</span>
                </h1>
                <p className="text-la-ink-2 mt-6 max-w-[520px] text-[16px] leading-[1.6]">
                  Training programmes differ too much for a single price tag —
                  course length, learner numbers, and how much content we build
                  for you all move the figure. Tell us the shape of yours and
                  we&apos;ll quote it.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/inquiry"
                    prefetch="intent"
                    className="font-display bg-la-forest text-la-paper inline-flex h-12 items-center rounded px-6 text-[14px] font-medium transition-colors hover:bg-(--color-la-forest-deep)"
                  >
                    Request a quote →
                  </Link>
                  <Link
                    to="/sign-up"
                    prefetch="intent"
                    className="font-display border-la-rule-strong text-la-ink hover:bg-la-paper inline-flex h-12 items-center rounded border px-6 text-[14px] font-medium transition-colors"
                  >
                    Explore the platform
                  </Link>
                </div>
              </div>
              <div className="md:col-span-5">
                <img
                  src="/illustrations/scorm-content.webp"
                  alt="Course content lifting off a tablet screen"
                  width={1400}
                  height={730}
                  className="w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-la-paper">
          <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24">
            <div className="grid gap-5 lg:grid-cols-3">
              {PACKAGES.map((p) => (
                <article
                  key={p.name}
                  className="border-la-rule flex flex-col rounded border p-7 sm:p-8"
                >
                  <span
                    aria-hidden
                    className="block h-1 w-8"
                    style={{ background: p.accent }}
                  />
                  <h2 className="font-display text-la-ink mt-7 text-[24px] leading-tight font-medium tracking-[-0.025em] sm:text-[28px]">
                    {p.name}
                  </h2>
                  <p className="font-display text-la-forest mt-3 text-[14px] font-medium">
                    {p.lead}
                  </p>
                  <p className="text-la-ink-2 mt-3 text-[14px] leading-[1.6]">
                    {p.body}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {p.items.map((item) => (
                      <li
                        key={item}
                        className="text-la-ink-2 flex gap-3 text-[13px] leading-[1.5]"
                      >
                        <span
                          aria-hidden
                          className="bg-la-forest mt-1.5 size-1.5 shrink-0 rounded-full"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/inquiry"
                    prefetch="intent"
                    className="border-la-rule font-display text-la-ink hover:text-la-forest mt-auto flex items-center justify-between border-t pt-5 text-[12px] font-medium transition-colors"
                  >
                    <span>Request a quote</span>
                    <span aria-hidden>→</span>
                  </Link>
                </article>
              ))}
            </div>

            <div className="bg-la-cream mt-5 rounded p-7 sm:p-8">
              <h2 className="font-display text-la-ink text-[18px] leading-snug font-medium tracking-[-0.02em]">
                Kindly note
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {NOTES.map((n) => (
                  <li
                    key={n}
                    className="text-la-ink-2 border-la-forest border-l-2 pl-4 text-[13px] leading-[1.6]"
                  >
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
