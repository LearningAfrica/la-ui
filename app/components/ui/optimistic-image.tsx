import { useState } from "react";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  iconSize?: string;
  wrapperClassName?: string;
};

export function OptimisticImage({
  src,
  alt = "",
  className,
  wrapperClassName,
  iconSize = "size-8",
  ...props
}: Props) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error"
  );

  return (
    <div className={cn("bg-muted relative overflow-hidden", wrapperClassName)}>
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/10 to-transparent" />
      )}

      {status === "error" && (
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
          <ImageIcon className={iconSize} />
        </div>
      )}

      {src && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            status === "loaded" ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          {...props}
        />
      )}
    </div>
  );
}
