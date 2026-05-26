import { env } from "@/lib/env";
import type { Route } from "./+types/sitemap.xml";

type Entry = {
  path: string;
  priority?: number;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
};

const routes: Entry[] = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/inquiry", priority: 0.9, changefreq: "monthly" },
  { path: "/sign-up", priority: 0.7, changefreq: "monthly" },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const loader = ({ request }: Route.LoaderArgs) => {
  const origin = env.VITE_SITE_URL || new URL(request.url).origin;
  const lastmod = new Date().toISOString();

  const urls = routes
    .map((r) => {
      const loc = escapeXml(`${origin}${r.path}`);

      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>
  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
