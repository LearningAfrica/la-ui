import ArrowLeft from "~icons/lucide/arrow-left";
import CheckCircle2 from "~icons/lucide/check-circle-2";
import MessageSquare from "~icons/lucide/message-square";
import Sparkles from "~icons/lucide/sparkles";
import { Link, href } from "react-router";

import { AuthModal } from "@/components/auth/auth-modal";
import { BackgroundPattern } from "@/components/landing-b/background-pattern";
import { LALogo } from "@/components/landing-b/la-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { InquiryForm } from "@/components/inquiries/inquiry-form";
import { generateSEOTags } from "@/lib/utils/seo";
import {
  breadcrumbSchema,
  contactPageSchema,
} from "@/lib/utils/structured-data";
import { useAuthStore } from "@/stores/auth/auth-hooks";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Onboard your organization | Learning Africa",
      description:
        "Submit an inquiry to onboard your organization to Learning Africa. We review every request and reach out personally.",
      url: href("/inquiry"),
      image: "/og.png",
      keywords:
        "inquiry,organization onboarding,setup,learning africa,Africa,education,edtech",
      jsonLd: [
        contactPageSchema(),
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Inquiry", url: "/inquiry" },
        ]),
      ],
    }),
  ];
}

const STEPS = [
  {
    icon: MessageSquare,
    title: "Share a few details",
    body: "Tell us about your organization, who'll learn, and what you'd like to teach.",
  },
  {
    icon: Sparkles,
    title: "We review personally",
    body: "Our team reads every inquiry and replies within a few business days.",
  },
  {
    icon: CheckCircle2,
    title: "Set up your workspace",
    body: "Once approved, you create your account and start building immediately.",
  },
];

export default function InquiryPage() {
  const { user } = useAuthStore();
  const isSignedIn = !!user;
  const backTarget = isSignedIn ? href("/dashboard") : href("/");
  const backLabel = isSignedIn ? "Back to dashboard" : "Back home";

  return (
    <div className="bg-la-paper text-la-ink relative min-h-screen">
      {/* Decorative patterns clipped to corners */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 size-[360px] sm:size-[460px]">
          <BackgroundPattern kind="circles" tone="dark" opacityScale={2.4} />
        </div>
        <div className="absolute -right-28 -bottom-36 hidden size-[360px] md:block lg:size-[460px]">
          <BackgroundPattern kind="rays" tone="dark" opacityScale={2.2} />
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col px-5 py-6 md:min-h-screen md:px-10 md:py-10">
        <div className="flex items-center justify-between">
          <Link
            to={backTarget}
            prefetch="intent"
            className="font-display text-la-ink hover:bg-la-cream inline-flex items-center gap-2 rounded px-2 py-1.5 text-[13px] font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Link>
          <ThemeToggle />
        </div>

        <main className="grid flex-1 items-start gap-12 py-10 lg:grid-cols-12 lg:gap-10 lg:py-12">
          {/* Left rail — onboarding intro */}
          <aside className="hidden flex-col gap-10 lg:col-span-5 lg:flex">
            <div className="flex items-center gap-3">
              <LALogo size={32} />
              <span className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
                Onboarding
              </span>
            </div>

            <h1 className="font-display text-la-ink text-[40px] leading-[1.04] font-medium tracking-[-0.04em] xl:text-[48px]">
              Onboard your organization{" "}
              <span className="text-la-forest">in three steps.</span>
            </h1>

            <p className="text-la-ink-2 max-w-[440px] text-[15px] leading-[1.6]">
              Tell us about your organization. We review every inquiry by hand
              and reply with next steps within a few business days. Free for
              eligible educators, ministries, and schools.
            </p>

            <ol className="flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="border-la-rule flex items-start gap-4 border-t pt-4"
                >
                  <span className="font-display text-la-forest text-[14px] font-medium tabular-nums">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <step.icon className="text-la-forest size-4" />
                      <span className="font-display text-la-ink text-[15px] font-medium tracking-tight">
                        {step.title}
                      </span>
                    </div>
                    <p className="text-la-muted mt-1 text-[13px] leading-[1.55]">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="border-la-rule bg-la-cream rounded border p-4">
              <p className="font-display text-la-ink text-[13px] leading-[1.55]">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  prefetch="intent"
                  className="text-la-forest hover:text-la-forest-deep font-medium underline-offset-4 hover:underline"
                >
                  Sign in instead
                </Link>
                .
              </p>
            </div>
          </aside>

          {/* Right — form */}
          <div className="w-full lg:col-span-7">
            {/* Mobile-only intro */}
            <div className="mb-6 lg:hidden">
              <div className="flex items-center gap-2">
                <LALogo size={26} />
                <span className="font-display text-la-muted text-[10px] font-medium tracking-[0.25em] uppercase">
                  Onboarding
                </span>
              </div>
              <h1 className="font-display text-la-ink mt-3 text-[28px] leading-tight font-medium tracking-[-0.025em]">
                Onboard your organization
              </h1>
              <p className="text-la-muted mt-2 text-[14px]">
                Tell us a few things and we&apos;ll be in touch.
              </p>
            </div>

            <InquiryForm />
          </div>
        </main>
      </div>

      <AuthModal />
    </div>
  );
}
