import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // Pre-render static public pages for fast TTFB + better SEO.
  prerender: ["/", "/robots.txt", "/sitemap.xml"],
} satisfies Config;
