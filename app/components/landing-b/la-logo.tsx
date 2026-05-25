import { cn } from "@/lib/utils";

type Props = {
  size?: number;
  className?: string;
};

export function LALogo({ size = 22, className }: Props) {
  return (
    <img
      src="/logo.png"
      alt="Learning Africa"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      loading="lazy"
      decoding="async"
    />
  );
}
