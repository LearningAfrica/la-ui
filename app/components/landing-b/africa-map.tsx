import { COUNTRIES, type CountryPath } from "./africa-map-data";

type Props = {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  /** Map of country id → fill color override */
  highlights?: Record<string, string>;
  className?: string;
  onCountryClick?: (country: CountryPath) => void;
  hoveredCountry?: string | null;
  onHover?: (id: string | null) => void;
};

export function AfricaMap({
  fill,
  stroke,
  strokeWidth = 1.5,
  highlights = {},
  className,
  onCountryClick,
  hoveredCountry,
  onHover,
}: Props) {
  const baseFill = fill ?? "var(--color-la-ink)";
  const baseStroke = stroke ?? "var(--color-la-cream)";

  return (
    <svg
      viewBox="0 0 800 900"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
      role="img"
      aria-label="Map of Africa"
    >
      <g>
        {COUNTRIES.map((c) => {
          const hl = highlights[c.id];
          const isHover = hoveredCountry === c.id;
          const f = hl ?? (isHover ? "var(--color-la-terracotta)" : baseFill);

          return (
            <path
              key={c.id}
              d={c.d}
              fill={f}
              stroke={baseStroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              style={{
                cursor: onCountryClick ? "pointer" : "default",
                transition: "fill .2s ease",
              }}
              onMouseEnter={() => onHover?.(c.id)}
              onMouseLeave={() => onHover?.(null)}
              onClick={() => onCountryClick?.(c)}
            />
          );
        })}
      </g>
    </svg>
  );
}
