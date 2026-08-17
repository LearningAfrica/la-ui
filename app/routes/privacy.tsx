import { href } from "react-router";

import { LegalSection, LegalShell } from "@/components/landing-b";
import { generateSEOTags } from "@/lib/utils/seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/utils/structured-data";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Data Privacy Policy — Learning Africa",
      description:
        "How Chomoka Studios collects, uses, shares, and protects personal information across the Learning Africa platform.",
      url: href("/privacy"),
      image: "/og.png",
      jsonLd: [
        webPageSchema({
          name: "Data Privacy Policy",
          description:
            "How Chomoka Studios collects, uses, shares, and protects personal information across the Learning Africa platform.",
          url: "/privacy",
        }),
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Data Privacy Policy", url: "/privacy" },
        ]),
      ],
    }),
  ];
}

export default function Privacy() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Data Privacy Policy"
      intro="Chomoka Studios recognizes that protection of its users' privacy is a matter of critical importance in its operations."
    >
      <LegalSection heading="Our commitment">
        <p>
          Chomoka Studios is bound by the Data Protection Act (Act No. 24 of
          2019) — Kenya, and the General Data Protection Regulation (GDPR), with
          regards to collection of data, use, sharing and breach procedures for
          this purpose, and is committed to treating its users&apos; personal
          information in a careful and secure manner so that it will be
          appropriately protected.
        </p>
      </LegalSection>

      <LegalSection heading="Your acceptance">
        <p>
          By agreeing to our{" "}
          <a href="/terms" className="text-la-forest hover:underline">
            Terms of Use
          </a>
          , you acknowledge that Chomoka Studios may collect, use, and disclose
          your information as described in this policy.
        </p>
      </LegalSection>

      <LegalSection heading="Contacting us about your data">
        <p>
          For any question about this policy, or to exercise a right you hold
          over your personal data under the Data Protection Act or the GDPR,
          contact Chomoka Studios at{" "}
          <a
            href="mailto:info@chomoka.com"
            className="text-la-forest hover:underline"
          >
            info@chomoka.com
          </a>{" "}
          or{" "}
          <a
            href="mailto:eric@chomoka.com"
            className="text-la-forest hover:underline"
          >
            eric@chomoka.com
          </a>
          , or write to Avenue Park 1, Outer Ring Road, Nairobi, Kenya.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
