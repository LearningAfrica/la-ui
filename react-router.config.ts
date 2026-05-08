import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // Only static pages with no auth/runtime context are safe to prerender on
  // Netlify; auth flows render via SSR.
  prerender: ["/", "/robots.txt", "/sitemap.xml"],
} satisfies Config;
