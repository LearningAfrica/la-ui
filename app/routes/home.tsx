import { generateSEOTags } from "@/lib/utils/seo";
// import type { Route } from "./+types/home";
import { href } from "react-router";
import { LandingHeader } from "@/components/landing/landing-header";
import HeroSection from "@/components/landing/landing-hero-section";
import LandingStatsSection from "@/components/landing/landing-stats-section";
import FeaturesSection from "@/components/landing/features-section";
import LandingHowItWorks from "@/components/landing/landing-how-it-works";
import LandingTestimonials from "@/components/landing/landing-testimonials";
import LandingCTASection from "@/components/landing/landing-cta-section";
import LandingFooter from "@/components/landing/landing-footer";

export function meta() {
  return [
    ...generateSEOTags({
      title:
        "Learning Africa | Make Learning Smarter with Data and AI Solutions in Africa",
      description:
        "Learning Africa is a revolutionary platform dedicated to transforming education in Africa ",
      url: href("/"),
      image: "/og.png",
      keywords:
        "learning,education,data science,tech innovation,smart learning,edtech,precision education,learning management,data analytics,machine learning,deep learning,computer vision,remote sensing,satellite imagery,IoT in education,digital learning",
    }),
  ];
}

export default function Home() {
  return (
    <>
      <LandingHeader />
      <main>
        <HeroSection />
        <LandingStatsSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="how-it-works">
          <LandingHowItWorks />
        </section>
        <section id="testimonials">
          <LandingTestimonials />
        </section>
        <LandingCTASection />
        <section id="contact">
          <LandingFooter />
        </section>
      </main>
    </>
  );
}
