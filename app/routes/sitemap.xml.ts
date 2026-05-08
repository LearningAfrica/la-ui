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

const PUBLIC_ENTRIES: Entry[] = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/inquiry", priority: 0.9, changefreq: "monthly" },
  { path: "/sign-up", priority: 0.7, changefreq: "monthly" },
  { path: "/sign-in", priority: 0.5, changefreq: "monthly" },
  { path: "/forgot-password", priority: 0.3, changefreq: "yearly" },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { origin } = new URL(request.url);
  const lastmod = new Date().toISOString();

  const urls = PUBLIC_ENTRIES.map(
    (entry) =>
      `  <url>\n` +
      `    <loc>${origin}${entry.path === "/" ? "" : entry.path}</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <changefreq>${entry.changefreq ?? "monthly"}</changefreq>\n` +
      `    <priority>${(entry.priority ?? 0.5).toFixed(1)}</priority>\n` +
      `  </url>`
  ).join("\n");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
