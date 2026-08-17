import { href, type LinksFunction } from "react-router";

import {
  FAQS,
  LandingCTA,
  LandingFAQ,
  LandingFeatures,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingImpact,
  LandingOnboarding,
  LandingSectors,
  LandingWhy,
} from "@/components/landing-b";
import { generateSEOTags } from "@/lib/utils/seo";
import {
  faqSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/utils/structured-data";
import { useAuthStore } from "@/stores/auth/auth-hooks";

export const links: LinksFunction = () => [
  {
    rel: "preload",
    href: "/illustrations/graduate-certificate.webp",
    as: "image",
    type: "image/webp",
  },
];

export function meta() {
  return [
    ...generateSEOTags({
      title: "Learning Africa — Education Rethought",
      description:
        "An enterprise-grade LMS by Chomoka Studios. Live training, self-paced courses, SCORM and xAPI, gamification, branded certificates, and custom e-learning content production.",
      url: href("/"),
      image: "/og.png",
      keywords:
        "learning africa,chomoka studios,learning management system,lms africa,scorm,xapi,e-learning content,corporate training,compliance training,branded certificates",
      jsonLd: [organizationSchema(), websiteSchema(), faqSchema(FAQS)],
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
        <LandingWhy />
        <LandingFeatures />
        <LandingSectors />
        <LandingImpact />
        <LandingOnboarding />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
