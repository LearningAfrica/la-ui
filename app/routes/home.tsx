import { href } from "react-router";

import {
  LandingCTA,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingHow,
  LandingImpact,
  LandingOnboarding,
  LandingPlatform,
  LandingSectors,
  LandingVoices,
} from "@/components/landing-b";
import { generateSEOTags } from "@/lib/utils/seo";
import {
  faqSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/utils/structured-data";
import { useAuthStore } from "@/stores/auth/auth-hooks";

const HOME_FAQS = [
  {
    q: "Who is Learning Africa for?",
    a: "Any organization that wants to train its people — companies, NGOs, training providers, and institutions. Admins set up the workspace, instructors build courses, and learners enroll and earn certificates.",
  },
  {
    q: "How much does it cost?",
    a: "Signing up is free. Organizations can request a custom plan with additional features through our inquiry form.",
  },
  {
    q: "Can my organization onboard?",
    a: "Yes. Submit an inquiry from the homepage. We review every request and reply with next steps within a few business days.",
  },
  {
    q: "Do learners get verifiable credentials?",
    a: "Yes. Course completions issue digital certificates that are verifiable and portable, so learners can share them anywhere.",
  },
];

export function meta() {
  return [
    ...generateSEOTags({
      title: "Learning Africa — The complete learning management platform",
      description:
        "Create courses, track learner progress, and issue verifiable certificates with Learning Africa — the complete learning management platform for organizations, training providers, and teams everywhere.",
      url: href("/"),
      image: "/og.png",
      keywords:
        "learning africa,learning management platform,course management,organizational learning,certificates,team training,online courses,instructor platform",
      jsonLd: [organizationSchema(), websiteSchema(), faqSchema(HOME_FAQS)],
    }),
  ];
}

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="bg-la-paper text-la-ink min-h-screen">
      <LandingHeader isAuthenticated={isAuthenticated} />
      <main>
        <LandingHero />
        <LandingOnboarding />
        <LandingPlatform />
        <LandingSectors />
        <LandingImpact />
        <LandingHow />
        <LandingVoices />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
