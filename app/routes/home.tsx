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
import { organizationSchema, websiteSchema } from "@/lib/utils/structured-data";
import { useAuthStore } from "@/stores/auth/auth-hooks";

export function meta() {
  return [
    ...generateSEOTags({
      title:
        "Learning Africa | Make Learning Smarter with Data and AI Solutions in Africa",
      description:
        "Free, accredited education infrastructure built with educators, ministries, and universities across the continent.",
      url: href("/"),
      image: "/og.png",
      keywords:
        "learning,education,africa,edtech,curriculum,credentials,literacy,k-12,higher education,ministry of education",
      jsonLd: [organizationSchema(), websiteSchema()],
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
