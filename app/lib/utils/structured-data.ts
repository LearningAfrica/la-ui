/**
 * Schema.org JSON-LD builders for Learning Africa.
 */

const SITE_NAME = "Learning Africa";
const SITE_URL = "https://learningafrica.com";
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
