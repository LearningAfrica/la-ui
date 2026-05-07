/**
 * Subtle geometric background patterns inspired by African textiles.
 * Always rendered at low opacity so they tint the surface without competing
 * with the editorial type. Use `tone="light"` over dark surfaces and
 * `tone="dark"` over paper/cream surfaces.
 */
import { cn } from "@/lib/utils";

export type PatternKind = "diamonds" | "weave" | "circles" | "rays";

type Props = {
  kind?: PatternKind;
  /** Visual scale of one tile in px */
  size?: number;
  /** Stroke color (CSS value). Defaults: light → paper@45%; dark → ink@45%. */
  tone?: "light" | "dark";
  /** Multiplier on the default opacity (0.04 light / 0.06 dark) */
  opacityScale?: number;
  className?: string;
};

export function BackgroundPattern({
  kind = "diamonds",
  size = 56,
  tone = "dark",
  opacityScale = 1,
  className,
}: Props) {
  const id = `bg-pattern-${kind}-${tone}`;
  const baseOpacity = (tone === "light" ? 0.07 : 0.05) * opacityScale;
  const stroke =
    tone === "light" ? "rgba(250,248,242,0.85)" : "rgba(20,41,34,0.85)";

  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none", className)}
      style={{ opacity: baseOpacity }}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id={id}
          x="0"
          y="0"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          {kind === "diamonds" && (
            <>
              <path
                d={`M${size / 2} 0L${size} ${size / 2}L${size / 2} ${size}L0 ${size / 2}Z`}
                fill="none"
                stroke={stroke}
                strokeWidth="1"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={Math.max(2, size / 14)}
                fill={stroke}
              />
            </>
          )}
          {kind === "weave" && (
            <>
              <path
                d={`M0 ${size / 2}H${size}M${size / 2} 0V${size}`}
                stroke={stroke}
                strokeWidth="0.75"
              />
              <circle cx={size / 2} cy={size / 2} r="1.5" fill={stroke} />
              <circle cx={0} cy={0} r="1" fill={stroke} />
              <circle cx={size} cy={0} r="1" fill={stroke} />
              <circle cx={0} cy={size} r="1" fill={stroke} />
              <circle cx={size} cy={size} r="1" fill={stroke} />
            </>
          )}
          {kind === "circles" && (
            <>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={size / 3}
                fill="none"
                stroke={stroke}
                strokeWidth="1"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={size / 6}
                fill="none"
                stroke={stroke}
                strokeWidth="1"
              />
            </>
          )}
          {kind === "rays" && (
            <>
              <path
                d={`M${size / 2} 0V${size}M0 ${size / 2}H${size}M0 0L${size} ${size}M${size} 0L0 ${size}`}
                stroke={stroke}
                strokeWidth="0.5"
              />
              <circle cx={size / 2} cy={size / 2} r="2" fill={stroke} />
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
