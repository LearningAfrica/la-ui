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
    a: "Schools, universities, ministries, and individual learners across Africa. Educators teach, learners enroll, ministries roll out at scale.",
  },
  {
    q: "How much does it cost?",
    a: "Free for eligible educators, schools, ministries, and learners. We onboard organizations after a short inquiry.",
  },
  {
    q: "Can my organization onboard?",
    a: "Yes. Submit an inquiry from the homepage. We review every request and reply with next steps within a few business days.",
  },
  {
    q: "Do learners get verifiable credentials?",
    a: "Yes. Course completions issue digital credentials that are verifiable and portable across institutions.",
  },
];

export function meta() {
  return [
    ...generateSEOTags({
      title: "Learning Africa — Free education for the continent",
      description:
        "Free, accredited learning for African schools, universities, ministries, and learners. Submit an inquiry to onboard your organization.",
      url: href("/"),
      image: "/og.png",
      keywords:
        "learning africa,free education africa,african edtech,k-12 africa,higher education africa,ministry of education,verifiable credentials,school management africa",
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
