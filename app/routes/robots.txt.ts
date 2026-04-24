import type { Route } from "./+types/robots.txt";

export const loader = ({ request }: Route.LoaderArgs) => {
  const { origin } = new URL(request.url);
  const noIndex = Boolean(import.meta.env.VITE_NOINDEX);

  const body = noIndex
    ? `User-agent: *\nDisallow: /\n`
    : [
        "User-agent: *",
        "Allow: /",
        "",
        "# Block authenticated areas",
        "Disallow: /client/",
        "Disallow: /system/",
        "Disallow: /dashboard",
        "Disallow: /sign-in",
        "Disallow: /sign-up",
        "Disallow: /verify-email",
        "Disallow: /forgot-password",
        "Disallow: /reset-password-confirmation",
        "Disallow: /email-verification-pending",
        "Disallow: /inquiry",
        "Disallow: /.well-known/",
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
