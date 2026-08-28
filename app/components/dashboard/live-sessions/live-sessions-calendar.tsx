import { useMemo, useState } from "react";
import moment from "moment";
import ChevronLeft from "~icons/lucide/chevron-left";
import ChevronRight from "~icons/lucide/chevron-right";
import Video from "~icons/lucide/video";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ZoomCall } from "@/features/zoom-calls/zoom-call-queries";

export function LiveSessionsCalendar({
  calls,
  onOpen,
}: {
  calls: ZoomCall[];
  onOpen: (call: ZoomCall) => void;
}) {
  const [month, setMonth] = useState(() => moment().startOf("month"));
  const days = useMemo(() => {
    const start = month.clone().startOf("month").startOf("week");

    return Array.from({ length: 42 }, (_, index) =>
      start.clone().add(index, "day")
    );
  }, [month]);
  const byDay = useMemo(() => {
    const grouped = new Map<string, ZoomCall[]>();

    calls.forEach((call) => {
      const key = moment(call.start_time).format("YYYY-MM-DD");

      grouped.set(key, [...(grouped.get(key) ?? []), call]);
    });

    return grouped;
  }, [calls]);

  return (
    <section className="overflow-hidden rounded-lg border">
      <header className="flex items-center justify-between border-b p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setMonth((value) => value.clone().subtract(1, "month"))
          }
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <h2 className="font-display text-lg font-bold">
          {month.format("MMMM YYYY")}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMonth((value) => value.clone().add(1, "month"))}
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </Button>
      </header>
      <div className="bg-muted/40 grid grid-cols-7 border-b text-center text-xs font-semibold">
        {moment.weekdaysShort().map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const sessions = byDay.get(day.format("YYYY-MM-DD")) ?? [];

          return (
            <div
              key={day.format("YYYY-MM-DD")}
              className={cn(
                "min-h-24 border-r border-b p-1.5 sm:min-h-32",
                !day.isSame(month, "month") &&
                  "bg-muted/30 text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full text-xs",
                  day.isSame(moment(), "day") &&
                    "bg-primary text-primary-foreground"
                )}
              >
                {day.date()}
              </span>
              <div className="mt-1 space-y-1">
                {sessions.slice(0, 3).map((call) => (
                  <button
                    key={call.id}
                    type="button"
                    onClick={() => onOpen(call)}
                    className="bg-primary/10 text-primary hover:bg-primary/15 flex w-full items-center gap-1 rounded px-1.5 py-1 text-left text-[10px] sm:text-xs"
                  >
                    <Video className="hidden size-3 shrink-0 sm:block" />
                    <span className="truncate">
                      {moment(call.start_time).format("HH:mm")} {call.topic}
                    </span>
                  </button>
                ))}
                {sessions.length > 3 && (
                  <p className="text-muted-foreground text-[10px]">
                    +{sessions.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
