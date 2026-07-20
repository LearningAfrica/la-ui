import { cn } from "@/lib/utils";
import type { InquiryStats } from "@/features/inquiries/inquiry-queries";
import { Skeleton } from "@/components/ui/skeleton";

interface InquiryStatsCardsProps {
  stats: InquiryStats | undefined;
  isLoading?: boolean;
}

export function InquiryStatsCards({
  stats,
  isLoading,
}: InquiryStatsCardsProps) {
  const statCards = [
    {
      key: "total",
      eyebrow: "All time",
      title: "Requests",
      value: stats?.total || 0,
      accent: "bg-la-ink",
    },
    {
      key: "pending",
      eyebrow: "Awaiting you",
      title: "Pending",
      value: stats?.pending || 0,
      accent: "bg-la-amber",
      highlight: (stats?.pending || 0) > 0,
    },
    {
      key: "approved",
      eyebrow: "Live",
      title: "Approved",
      value: stats?.approved || 0,
      accent: "bg-la-ok",
    },
    {
      key: "rejected",
      eyebrow: "Declined",
      title: "Rejected",
      value: stats?.rejected || 0,
      accent: "bg-la-bad",
    },
  ];

  return (
    <div className="border-la-rule-strong bg-la-rule-strong grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-4">
      {isLoading
        ? [...Array(4)].map((_, i) => (
            <div key={i} className="bg-la-paper p-5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-4 h-10 w-14" />
              <Skeleton className="mt-2 h-3 w-20" />
            </div>
          ))
        : statCards.map((stat) => (
            <div
              key={stat.key}
              className={cn(
                "bg-la-paper relative p-5",
                stat.highlight && "bg-la-forest-wash"
              )}
            >
              <span
                className={cn("absolute inset-x-0 top-0 h-1", stat.accent)}
                aria-hidden
              />
              <p className="text-la-muted text-[0.7rem] font-semibold tracking-[0.15em] uppercase">
                {stat.eyebrow}
              </p>
              <p className="font-display text-la-ink mt-3 text-4xl font-bold tabular-nums">
                {stat.value}
              </p>
              <p className="text-la-ink-2 mt-1 text-sm font-medium">
                {stat.title}
              </p>
            </div>
          ))}
    </div>
  );
}
