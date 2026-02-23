import { useMemo } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  FileText,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
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

  const recentInquiries = useMemo(
    () => (inquiriesData?.data || []).slice(0, 5),
    [inquiriesData]
  );

  const statCards = [
    {
      title: "Total Inquiries",
      value: stats.total,
      description: "All onboarding requests",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      title: "Pending Review",
      value: stats.pending,
      description: "Awaiting your action",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-600/10",
    },
    {
      title: "Approved",
      value: stats.approved,
      description: "Active organizations",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      description: "Declined requests",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-600/10",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">System Overview</h1>
        <p className="text-muted-foreground mt-1">
          Platform administration and governance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-1 h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-muted-foreground text-xs">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Quick Actions + Recent Inquiries */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              variant="outline"
              className="w-full justify-between"
            >
              <Link to="/system/inquiries">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Review Inquiries
                  {stats.pending > 0 && (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                      {stats.pending}
                    </span>
                  )}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-between"
            >
              <Link to="/system/users">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Manage Users
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-between"
            >
              <Link to="/system/organizations">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  View Organizations
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Inquiries</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/system/inquiries">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentInquiries.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                No inquiries yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {inquiry.company_name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {inquiry.user.email}
                      </p>
                    </div>
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                        inquiry.status.toLowerCase() === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          : inquiry.status.toLowerCase() === "approved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
