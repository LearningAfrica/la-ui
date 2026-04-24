import { generateRemixSitemap } from "@forge42/seo-tools/remix/sitemap";
import type { Route } from "./+types/sitemap.xml";

function sitemapEntry(url: string, origin: string) {
  const path = url.replace(origin, "") || "/";

  if (path === "/") {
    return { priority: 1, changefreq: "daily" as const };
  }

  return { priority: 0.5, changefreq: "weekly" as const };
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { routes } = await import("virtual:react-router/server-build");
  const { origin } = new URL(request.url);

  const sitemap = await generateRemixSitemap({
    domain: origin,
    ignore: [
      "/client",
      "/client/*",
      "/system",
      "/system/*",
      "/dashboard",
      "/sign-in",
      "/sign-up",
      "/verify-email",
      "/forgot-password",
      "/reset-password-confirmation",
      "/email-verification-pending",
      "/inquiry",
      "/.well-known/appspecific/com.chrome.devtools.json",
      "/*",
    ],
    routes,
    sitemapData: async ({ url }: { url: string }) => {
      const { priority, changefreq } = sitemapEntry(url, origin);

      return {
        changefreq,
        priority,
        lastUpdated: new Date(),
      };
    },
  });

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
