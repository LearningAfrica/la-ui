import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PatternLayoutProps {
  children: ReactNode;
  className?: string;
  patternId?: string;
  /**
   * Optional: Add additional paths to the SVG pattern for more complex designs
   */
  additionalPatternPaths?: ReactNode;
}

export function PatternLayout({
  children,
  className,
  patternId = "african-pattern",
  additionalPatternPaths,
}: PatternLayoutProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
        className
      )}
    >
      {/* African Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id={patternId}
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0L60 30L30 60L0 30Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle
                cx="30"
                cy="30"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              {additionalPatternPaths}
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#${patternId})`}
            className="text-amber-900 dark:text-gray-700"
          />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-orange-400/20 to-amber-400/20 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-linear-to-br from-yellow-400/20 to-orange-400/20 blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
