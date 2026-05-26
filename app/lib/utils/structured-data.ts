/**
 * Schema.org JSON-LD builders for Learning Africa.
 */

export const SITE_NAME = "Learning Africa";

export const SITE_URL = "https://learningafrica.com";

const LOGO_URL = `${SITE_URL}/og.png`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    sameAs: ["https://www.linkedin.com/company/learning-africa"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
    publisher: { "@type": "EducationalOrganization", name: SITE_NAME },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

export interface CourseLike {
  id: string;
  title: string;
  description: string;
  slug?: string;
  image?: string;
  provider?: string;
}

export function courseSchema(course: CourseLike) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: `${SITE_URL}/client/dashboard/courses/${course.slug ?? course.id}`,
    ...(course.image ? { image: course.image } : {}),
    provider: {
      "@type": "EducationalOrganization",
      name: course.provider ?? SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function webPageSchema(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Onboard Your Organization",
    description:
      "Submit an inquiry to onboard your organization to Learning Africa.",
    url: `${SITE_URL}/inquiry`,
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        availableLanguage: "English",
        url: `${SITE_URL}/inquiry`,
      },
    },
  };
}

export function navigationSchema() {
  const items = [
    { name: "Home", url: "/" },
    { name: "Inquiry", url: "/inquiry" },
    { name: "Sign Up", url: "/sign-up" },
    { name: "Sign In", url: "/sign-in" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Main Navigation",
    hasPart: items.map((item, i) => ({
      "@type": "WebPage",
      name: item.name,
      url: `${SITE_URL}${item.url}`,
      position: i + 1,
    })),
  };
}
