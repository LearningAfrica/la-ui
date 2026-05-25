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
        "bg-la-paper text-la-ink relative min-h-screen overflow-hidden",
        className
      )}
    >
      {/* Editorial diamond/circle pattern */}
      <div className="absolute inset-0 opacity-[0.06]">
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
            className="text-la-ink"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
