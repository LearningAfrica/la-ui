import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { PatternLayout } from "@/components/pattern-layout";
import { generateSEOTags } from "@/lib/utils/seo";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Page Not Found | Learning Africa",
      description: "The page you are looking for does not exist.",
    }),
  ];
}

export default function CatchAllPage() {
  return (
    <PatternLayout className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-8xl font-bold text-amber-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-2 max-w-md text-gray-600 dark:text-gray-400">
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </PatternLayout>
  );
}
