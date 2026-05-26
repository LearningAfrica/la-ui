import { cn } from "@/lib/utils";

type Props = {
  size?: number;
  className?: string;
};

export function LALogo({ size = 22, className }: Props) {
  const src = size <= 44 ? "/logo-sm.png" : "/logo.png";

  return (
    <img
      src={src}
      alt="Learning Africa"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      loading="lazy"
      decoding="async"
    />
  );
}
