import { href } from "react-router";

import { LegalSection, LegalShell } from "@/components/landing-b";
import { generateSEOTags } from "@/lib/utils/seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/utils/structured-data";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Terms of Use — Learning Africa",
      description:
        "The terms governing use of the Chomoka Studios family of websites, including Learning Africa.",
      url: href("/terms"),
      image: "/og.png",
      jsonLd: [
        webPageSchema({
          name: "Terms of Use",
          description:
            "The terms governing use of the Chomoka Studios family of websites, including Learning Africa.",
          url: "/terms",
        }),
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Terms of Use", url: "/terms" },
        ]),
      ],
    }),
  ];
}

export default function Terms() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Terms of Use"
      intro="Chomoka Studios may revise this Agreement at any time by posting the revised Terms of Use on the Website, and you agree that your use of the Website after such changes will constitute your acceptance of such changes. Changes to this Agreement will not be applied retroactively."
    >
      <LegalSection heading="Who we are">
        <p>
          Chomoka Studio Limited is an animation studio, initially focused on
          animation since 2010 — and eventually venturing into e-learning
          content from 2017. The Chomoka Studios family of websites including
          but not limited to www.chomoka.com, www.learningafrica.com,
          www.chomoka.africa among others (each and collectively, the
          &ldquo;Website&rdquo;) and is based in Nairobi — Kenya; Avenue Park 1,
          Outer Ring Road.
        </p>
      </LegalSection>

      <LegalSection heading="1. Changes">
        <p>
          Chomoka Studios may make changes to the Website and the Content and/or
          the services described on the Website at any time.
        </p>
      </LegalSection>

      <LegalSection heading="2. Proprietary rights">
        <p>
          The Website and the Content are the sole and exclusive property of
          Chomoka Studios and/or its licensors. You agree not to reproduce,
          duplicate, copy, sell, resell or exploit for any commercial purpose,
          any portion of the Website or the Content other than as expressly
          authorized by Chomoka Studios in writing. You hereby acknowledge and
          agree that, as between Chomoka Studios and you, all right, title, and
          interest in and to the Website and the Content shall be owned
          exclusively by Chomoka Studios. Use of the Website or the Content in
          any way not expressly permitted by this Agreement is prohibited.
        </p>
      </LegalSection>

      <LegalSection heading="3. Permitted uses">
        <p>
          So long as you agree and comply with the terms of this Agreement, and
          unless this Agreement is otherwise terminated by Chomoka Studios,
          Chomoka Studios invites you to view and/or print a single copy of the
          Website and the Content. You agree that you will not remove or modify
          any acknowledgements, credits or legal notices contained on the
          Website or in the Content. Special terms may apply to some services
          offered on the Website and may be posted in connection with the
          applicable service, feature or activity. Any such terms are in
          addition to this Agreement and, in the event of a conflict, any such
          terms shall prevail.
        </p>
      </LegalSection>

      <LegalSection heading="4. Additional restrictions">
        <p>
          You agree not to access the Website by any means other than through a
          standard web browser on a computer or mobile device. You further agree
          that you will not damage, disable, overburden, or impair the Website
          or interfere with any other party&apos;s use and enjoyment of it.
        </p>
      </LegalSection>

      <LegalSection heading="5. Information on this site">
        <p>
          The Content available on the Website is intended to be a general
          information resource and is provided solely on an &ldquo;AS IS&rdquo;
          and &ldquo;AS AVAILABLE&rdquo; basis. You are encouraged to confirm
          the information contained herein. You should not construe Chomoka
          Studios&apos; publication of the Website as a warranty or guarantee of
          the quality or availability of any services.
        </p>
      </LegalSection>

      <LegalSection heading="6. Links to other sites">
        <p>
          The Website may contain links to websites operated by other parties.
          Chomoka Studios provides these links to other websites as a
          convenience, and use of these sites is at your own risk. The linked
          sites are not under the control of Chomoka Studios, and Chomoka
          Studios is not responsible for the content available on the other
          sites. Such links do not imply Chomoka Studios&apos; endorsement of
          information or material on any other site and Chomoka Studios
          disclaims all liability with regard to your access to and use of such
          linked Websites.
        </p>
      </LegalSection>

      <LegalSection heading="7. Trademarks">
        <p>
          Unauthorized use of any Chomoka Studios trademark, service mark or
          logo are prohibited, and may be a violation of applicable trademark
          laws.
        </p>
      </LegalSection>

      <LegalSection heading="8. Links to our website">
        <p>
          You must not link to Chomoka Studios&apos; website without a written
          agreement between you and Chomoka Studios authorizing you to do so.
        </p>
      </LegalSection>

      <LegalSection heading="9. Disclaimers and limitation of liability">
        <p>
          a. The website and all content on the website are provided to you on
          an &ldquo;As Is&rdquo; &ldquo;As Available&rdquo; basis without
          warranty of any kind either express or implied, including but not
          limited to the implied warranties of merchantability, fitness for a
          particular purpose, and non-infringement. Chomoka Studios makes no
          warranty as to the accuracy, completeness or reliability of any
          content available through the website. You are responsible for
          verifying any information before relying on it. Use of the website and
          the content available on the website is at your sole risk.
        </p>
        <p>
          b. Chomoka Studios makes no representations or warranties that use of
          the website will be uninterrupted or error-free. You are responsible
          for taking all necessary precautions to ensure that any content you
          may obtain from the website is free of viruses or other harmful code.
        </p>
        <p>
          c. To the maximum extent permitted by applicable law, Chomoka Studios
          disclaims all liability, whether based in contract, tort (including
          negligence), strict liability or otherwise, and further disclaims all
          losses, including without limitation indirect, incidental,
          consequential, or special damages arising out of or in any way
          connected with access to or use of the website, the content, or the
          goods offered or sold through the website, even if Chomoka Studios has
          been advised of the possibility of such damages.
        </p>
      </LegalSection>

      <LegalSection heading="10. Indemnity">
        <p>
          You agree to indemnify, defend and hold Chomoka Studios, its
          subsidiaries, and affiliates, and their respective officers, agents,
          members, partners and employees, harmless from any loss, liability,
          claim, or demand, including reasonable legal fees, due to or arising
          out of your use of the Website and/or breach of this Agreement.
        </p>
      </LegalSection>

      <LegalSection heading="11. Copyright">
        <p>
          Except for your use as authorized above, you may not modify, reproduce
          or distribute the content, design or layout of the website, or
          individual sections of the content, design or layout of the website,
          without Chomoka Studios&apos; express prior written permission.
        </p>
      </LegalSection>

      <LegalSection heading="12. Notice and procedures for claims of infringement">
        <p>
          If you believe that your work has been copied in a way that
          constitutes copyright infringement, or your intellectual property
          rights have been otherwise violated, please describe and provide the
          information to Chomoka Studios and provide your name, address,
          telephone number and e-mail address.
        </p>
        <p>
          Chomoka Studios can be reached on:{" "}
          <a
            href="mailto:eric@chomoka.com"
            className="text-la-forest hover:underline"
          >
            eric@chomoka.com
          </a>{" "}
          and{" "}
          <a
            href="mailto:info@chomoka.com"
            className="text-la-forest hover:underline"
          >
            info@chomoka.com
          </a>
          .
        </p>
        <p>
          Chomoka Studios may, in its sole discretion, disable and/or terminate
          use of a Site or Sites by users who infringe the intellectual property
          of others.
        </p>
      </LegalSection>

      <LegalSection heading="13. Data privacy">
        <p>
          By agreeing to these terms, you acknowledge that Chomoka Studios may
          collect, use, and disclose your information as described in our{" "}
          <a href="/privacy" className="text-la-forest hover:underline">
            Data Privacy Policy
          </a>
          , also available on the Website.
        </p>
      </LegalSection>

      <LegalSection heading="15. Miscellaneous">
        <p>
          a. If any provision of this Agreement is held to be illegal, invalid,
          or unenforceable, such provision shall be struck, and the remaining
          provisions shall remain in full force.
        </p>
        <p>
          b. Chomoka Studios&apos; failure to act with respect to any failure by
          you or others to comply with these Terms of Use does not waive Chomoka
          Studios&apos; right to act with respect to subsequent or similar
          failures.
        </p>
        <p>
          c. These Terms of Use set forth the entire understanding and agreement
          between you and Chomoka Studios with respect to the subject matter
          hereof.
        </p>
        <p>
          d. Any cause of action or claim you may have with respect to this
          Agreement or the Website must be commenced within six (6) months after
          the claim or cause of action arises or such claim or cause of action
          shall be barred.
        </p>
        <p>
          e. You may not assign or transfer your rights or obligations under
          this Agreement without the prior written consent of Chomoka Studios,
          and any assignment or transfer in violation of this provision shall be
          null and void.
        </p>
        <p>
          f. Chomoka Studios reserves the right to seek all remedies available
          at law and in equity for violations of this Agreement and/or the rules
          and regulations set forth on the Website, including without limitation
          the right to block access from a particular internet address.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
