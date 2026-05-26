import { env } from "@/lib/env";
import type { Route } from "./+types/robots.txt";

export const loader = ({ request }: Route.LoaderArgs) => {
  const { origin } = new URL(request.url);
  const noIndex = Boolean(env.VITE_NOINDEX);

  const body = noIndex
    ? `User-agent: *\nDisallow: /\n`
    : [
        "User-agent: *",
        "Allow: /",
        "",
        "# Block authenticated/utility areas",
        "Disallow: /client/",
        "Disallow: /system/",
        "Disallow: /dashboard",
        "Disallow: /sign-in",
        "Disallow: /verify-email",
        "Disallow: /forgot-password",
        "Disallow: /reset-password-confirmation",
        "Disallow: /email-verification-pending",
        "Disallow: /.well-known/",
        "",
        "# Allow AI crawlers",
        "User-agent: GPTBot",
        "Allow: /",
        "",
        "User-agent: OAI-SearchBot",
        "Allow: /",
        "",
        "User-agent: ChatGPT-User",
        "Allow: /",
        "",
        "User-agent: ClaudeBot",
        "Allow: /",
        "",
        "User-agent: anthropic-ai",
        "Allow: /",
        "",
        "User-agent: PerplexityBot",
        "Allow: /",
        "",
        "User-agent: Google-Extended",
        "Allow: /",
        "",
        "User-agent: CCBot",
        "Allow: /",
        "",
        `Sitemap: ${origin}/sitemap.xml`,
        "",
      ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
