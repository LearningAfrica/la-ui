import { useEffect, useState } from "react";
import { useNavigation } from "react-router";

import { cn } from "@/lib/utils";

const SHOW_DELAY_MS = 100;

export function TopLoader() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => setShown(true), SHOW_DELAY_MS);

    return () => {
      clearTimeout(timer);
      setShown(false);
    };
  }, [isLoading]);

  const visible = isLoading && shown;

  return (
    <div
      aria-hidden
      role="progressbar"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="from-primary/0 via-primary to-primary/0 absolute inset-y-0 w-1/3 animate-[la-top-loader_1.1s_ease-in-out_infinite] bg-gradient-to-r" />
    </div>
  );
}
