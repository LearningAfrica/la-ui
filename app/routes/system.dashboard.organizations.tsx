import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ChevronLeft from "~icons/lucide/chevron-left";
import ChevronRight from "~icons/lucide/chevron-right";
import RefreshCw from "~icons/lucide/refresh-cw";
import { useOrganizations } from "@/features/organizations/organization-queries";
import { AdminOrganizationsTable } from "@/components/dashboard/admin-organizations-table";

export default function SystemDashboardOrganizations() {
  const [page, setPage] = useState(1);
  const {
    data: organizationsData,
    isLoading,
    isFetching,
    refetch,
  } = useOrganizations(page);

  const organizations = useMemo(
    () => organizationsData?.data ?? [],
    [organizationsData]
  );

  const stats = useMemo(() => {
    if (!organizationsData?.meta) {
      return { total: 0, active: 0, deactivated: 0 };
    }

    const active = organizations.filter((org) => org.is_active).length;
    const deactivated = organizations.filter((org) => !org.is_active).length;

    return { total: organizationsData.meta.total_docs, active, deactivated };
  }, [organizations, organizationsData]);

  const totalPages = organizationsData?.meta?.total_pages || 1;
  const hasNext = organizationsData?.meta?.has_next_page || false;
  const hasPrev = organizationsData?.meta?.has_prev_page || false;

  const statCards = [
    {
      key: "total",
      eyebrow: "All",
      title: "Organizations",
      value: stats.total,
      accent: "bg-la-ink",
    },
    {
      key: "active",
      eyebrow: "Live",
      title: "Active",
      value: stats.active,
      accent: "bg-la-ok",
    },
    {
      key: "pending",
      eyebrow: "Setting up",
      title: "Pending setup",
      value: "—",
      accent: "bg-la-amber",
    },
    {
      key: "deactivated",
      eyebrow: "Disabled",
      title: "Deactivated",
      value: stats.deactivated,
      accent: "bg-la-bad",
    },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-la-forest mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
            Tenants
          </p>
          <h1 className="font-display text-la-ink text-4xl font-bold tracking-tight lg:text-5xl">
            Organizations
          </h1>
          <p className="text-la-muted mt-2 max-w-prose">
            Every organization on the platform, with status and creation date.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={`mr-1 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </header>

      {/* Stat strip */}
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
              <div key={stat.key} className="bg-la-paper relative p-5">
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

      {/* Organizations Table */}
      <div className="border-la-rule-strong bg-la-paper rounded-lg border">
        <div className="border-la-rule border-b px-5 py-4">
          <h2 className="font-display text-la-ink text-lg font-bold">
            All organizations
          </h2>
          <p className="text-la-muted text-sm">
            Search, filter, and open any tenant.
          </p>
        </div>
        <div className="p-5">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <AdminOrganizationsTable organizations={organizations} />

              {/* Pagination */}
              {organizations.length > 0 && (
                <div className="border-la-rule mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <div className="text-la-muted text-sm">
                    Page {page} of {totalPages} •{" "}
                    {organizationsData?.meta?.total_docs} total organizations
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!hasPrev}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!hasNext}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
