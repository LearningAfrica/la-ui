import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ChevronLeft from "~icons/lucide/chevron-left";
import ChevronRight from "~icons/lucide/chevron-right";
import RefreshCw from "~icons/lucide/refresh-cw";
import { useUsers } from "@/features/users/user-queries";
import { AdminUsersTable } from "@/components/dashboard/admin-users-table";

export default function SystemDashboardUsers() {
  const [page, setPage] = useState(1);
  const { data: usersData, isLoading, isFetching, refetch } = useUsers(page);

  const users = useMemo(() => usersData?.data ?? [], [usersData?.data]);

  const stats = useMemo(() => {
    if (!usersData?.meta) {
      return { total: 0, verified: 0, unverified: 0 };
    }

    const verified = users.filter((u) => u.is_verified).length;
    const unverified = users.filter((u) => !u.is_verified).length;

    return { total: usersData.meta.total_docs, verified, unverified };
  }, [users, usersData]);

  const totalPages = usersData?.meta?.total_pages || 1;
  const hasNext = usersData?.meta?.has_next_page || false;
  const hasPrev = usersData?.meta?.has_prev_page || false;

  const statCards = [
    {
      key: "total",
      eyebrow: "All",
      title: "Users",
      value: stats.total,
      accent: "bg-la-ink",
    },
    {
      key: "admins",
      eyebrow: "Elevated",
      title: "Admins",
      value: "—",
      accent: "bg-la-forest",
    },
    {
      key: "verified",
      eyebrow: "Confirmed",
      title: "Verified",
      value: stats.verified,
      accent: "bg-la-ok",
    },
    {
      key: "unverified",
      eyebrow: "Awaiting",
      title: "Unverified",
      value: stats.unverified,
      accent: "bg-la-amber",
    },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-la-forest mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
            People
          </p>
          <h1 className="font-display text-la-ink text-4xl font-bold tracking-tight lg:text-5xl">
            User management
          </h1>
          <p className="text-la-muted mt-2 max-w-prose">
            Everyone with an account across the platform.
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

      {/* Users Table */}
      <div className="border-la-rule-strong bg-la-paper rounded-lg border">
        <div className="border-la-rule border-b px-5 py-4">
          <h2 className="font-display text-la-ink text-lg font-bold">
            All users
          </h2>
          <p className="text-la-muted text-sm">
            Search and filter people by verification status.
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
              <AdminUsersTable users={users} />

              {/* Pagination */}
              {users.length > 0 && (
                <div className="border-la-rule mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <div className="text-la-muted text-sm">
                    Page {page} of {totalPages} • {usersData?.meta?.total_docs}{" "}
                    total users
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
