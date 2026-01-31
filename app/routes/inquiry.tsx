import { generateSEOTags } from "@/lib/utils/seo";
import { href } from "react-router";
import { PatternLayout } from "@/components/pattern-layout";
import { InquiryForm } from "@/components/inquiries/inquiry-form";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Organization Onboarding | Learning Africa",
      description:
        "Submit an inquiry to onboard your organization to Learning Africa. Get started with our data science and AI-powered learning solutions.",
      url: href("/inquiries"),
      image: "/og.png",
      keywords:
        "inquiries,organization onboarding,setup,learning africa,artificial intelligence,AI solutions,Africa,education,edtech",
    }),
  ];
}

export default function Inquiries() {
  return (
    <PatternLayout
      patternId="inquiries-pattern"
      className="flex items-center justify-center py-12"
    >
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Onboard Your Organization
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Join hundreds of African organizations transforming their learning
            experience. Fill out the form below and our team will reach out to
            you.
          </p>
        </div>
        <InquiryForm />
      </div>
    </PatternLayout>
  );
}
