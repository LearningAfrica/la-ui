import { useMemo } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Building2 from "~icons/lucide/building-2";
import FileText from "~icons/lucide/file-text";
import Users from "~icons/lucide/users";
import ArrowRight from "~icons/lucide/arrow-right";
import { useAllInquiries } from "@/features/inquiries/inquiry-queries";

export default function SystemDashboard() {
  const { data: inquiriesData, isLoading } = useAllInquiries(1);

  const stats = useMemo(() => {
    if (!inquiriesData?.data) {
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }

    const all = inquiriesData.data;

    return {
      total: inquiriesData.meta.total_docs,
      pending: all.filter((i) => i.status.toLowerCase() === "pending").length,
      approved: all.filter((i) => i.status.toLowerCase() === "approved").length,
      rejected: all.filter((i) => i.status.toLowerCase() === "rejected").length,
    };
  }, [inquiriesData]);

  const pending = useMemo(
    () =>
      (inquiriesData?.data || []).filter(
        (i) => i.status.toLowerCase() === "pending"
      ),
    [inquiriesData]
  );

  const recentInquiries = useMemo(
    () => (inquiriesData?.data || []).slice(0, 6),
    [inquiriesData]
  );

  // Semantic accents pull from the brand token set, not raw palette colors,
  // so the whole surface stays on-brand with the orange identity.
  const statCards = [
    {
      key: "total",
      eyebrow: "Onboarding",
      title: "Requests",
      value: stats.total,
      accent: "bg-la-ink",
    },
    {
      key: "pending",
      eyebrow: "Awaiting you",
      title: "Pending",
      value: stats.pending,
      accent: "bg-la-forest",
      highlight: stats.pending > 0,
    },
    {
      key: "approved",
      eyebrow: "Live",
      title: "Approved",
      value: stats.approved,
      accent: "bg-la-ok",
    },
    {
      key: "rejected",
      eyebrow: "Declined",
      title: "Rejected",
      value: stats.rejected,
      accent: "bg-la-bad",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header — eyebrow + display heading, echoing the landing identity */}
      <header className="mb-8">
        <p className="text-la-forest mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
          Platform governance
        </p>
        <h1 className="font-display text-la-ink text-4xl font-bold tracking-tight lg:text-5xl">
          System overview
        </h1>
        <p className="text-la-muted mt-2 max-w-prose">
          Approve onboarding requests, manage people, and oversee every
          organization on the platform.
        </p>
      </header>

      {/* Stat strip */}
      <div className="border-la-rule-strong bg-la-rule-strong mb-8 grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Pending approvals — the admin's primary job */}
        <section className="border-la-rule-strong bg-la-paper rounded-lg border">
          <div className="border-la-rule flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-display text-la-ink text-lg font-bold">
                Pending approvals
              </h2>
              <p className="text-la-muted text-sm">
                Organizations waiting to be onboarded
              </p>
            </div>
            {stats.pending > 0 && (
              <span className="bg-la-forest text-la-paper inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-sm font-semibold tabular-nums">
                {stats.pending}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3 p-5">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : pending.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <p className="font-display text-la-ink text-lg font-semibold">
                You&apos;re all caught up
              </p>
              <p className="text-la-muted mt-1 text-sm">
                New onboarding requests will appear here for review.
              </p>
            </div>
          ) : (
            <ul className="divide-la-rule divide-y">
              {pending.map((inquiry) => (
                <li
                  key={inquiry.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div
                    className="bg-la-forest-wash text-la-forest font-display flex size-10 shrink-0 items-center justify-center rounded-md text-sm font-bold uppercase"
                    aria-hidden
                  >
                    {inquiry.company_name?.charAt(0) || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-la-ink truncate font-medium">
                      {inquiry.company_name}
                    </p>
                    <p className="text-la-muted truncate text-sm">
                      {inquiry.user.email}
                    </p>
                  </div>
                  <Button asChild size="sm" className="shrink-0">
                    <Link to="/system/inquiries">Review</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Quick actions rail */}
        <aside className="border-la-rule-strong bg-la-paper rounded-lg border">
          <div className="border-la-rule border-b px-5 py-4">
            <h2 className="font-display text-la-ink text-lg font-bold">
              Manage
            </h2>
          </div>
          <nav className="p-2">
            {[
              {
                to: "/system/inquiries",
                icon: FileText,
                label: "Review inquiries",
                badge: stats.pending || undefined,
              },
              { to: "/system/users", icon: Users, label: "Platform users" },
              {
                to: "/system/organizations",
                icon: Building2,
                label: "Organizations",
              },
            ].map(({ to, icon: Icon, label, badge }) => (
              <Link
                key={to}
                to={to}
                className="group hover:bg-la-cream flex items-center gap-3 rounded-md px-3 py-3 transition-colors"
              >
                <span className="bg-la-cream text-la-ink-2 group-hover:bg-la-forest group-hover:text-la-paper flex size-9 items-center justify-center rounded-md transition-colors">
                  <Icon className="size-4" />
                </span>
                <span className="text-la-ink flex-1 font-medium">{label}</span>
                {badge ? (
                  <span className="bg-la-forest text-la-paper rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
                    {badge}
                  </span>
                ) : null}
                <ArrowRight className="text-la-muted size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </nav>

          {/* Recent activity — quiet, secondary */}
          {!isLoading && recentInquiries.length > 0 && (
            <div className="border-la-rule border-t px-5 py-4">
              <p className="text-la-muted mb-3 text-xs font-semibold tracking-[0.15em] uppercase">
                Recent activity
              </p>
              <ul className="space-y-2.5">
                {recentInquiries.slice(0, 4).map((inquiry) => (
                  <li
                    key={inquiry.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-la-ink-2 truncate text-sm">
                      {inquiry.company_name}
                    </span>
                    <StatusPill status={inquiry.status} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase();

  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        s === "pending" && "bg-la-amber/15 text-la-amber-deep",
        s === "approved" && "bg-la-ok/15 text-la-ok",
        s === "rejected" && "bg-la-bad/10 text-la-bad"
      )}
    >
      {status}
    </span>
  );
}
