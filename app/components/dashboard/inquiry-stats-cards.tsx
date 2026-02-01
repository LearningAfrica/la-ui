import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
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
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
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
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Inquiries",
      value: stats?.total || 0,
      description: "All time inquiries",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      title: "Pending",
      value: stats?.pending || 0,
      description: "Awaiting review",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-600/10",
    },
    {
      title: "Approved",
      value: stats?.approved || 0,
      description: "Organizations created",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      title: "Rejected",
      value: stats?.rejected || 0,
      description: "Declined requests",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-600/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <Card key={index}>
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
  );
}
