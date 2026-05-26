import { Link } from "react-router";

import { generateSEOTags } from "@/lib/utils/seo";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Page Not Found | Learning Africa",
      description: "The page you are looking for does not exist.",
      noIndex: true,
    }),
  ];
}

export default function CatchAllPage() {
  return (
    <div className="bg-la-paper text-la-ink flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-la-ink text-8xl font-bold">404</h1>
        <h2 className="text-la-ink mt-4 text-2xl font-semibold">
          Page not found
        </h2>
        <p className="text-la-ink-2 mt-2 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            to="/"
            className="bg-la-forest text-la-paper inline-flex h-10 items-center rounded px-5 text-sm font-medium transition-colors hover:bg-(--color-la-forest-deep)"
          >
            Go home
          </Link>
          <Link
            to="/sign-in"
            className="text-la-forest border-la-rule-strong hover:bg-la-cream inline-flex h-10 items-center rounded border px-5 text-sm font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
