import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Shield,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import type { OrganizationMember } from "@/features/organizations/organization-queries";

interface MemberStatsCardsProps {
  members: OrganizationMember[];
  totalMembers: number;
}

export function MemberStatsCards({
  members,
  totalMembers,
}: MemberStatsCardsProps) {
  const activeMembers = members.filter((m) => m.is_active).length;
  const adminCount = members.filter((m) => m.role === "admin").length;
  const instructorCount = members.filter((m) => m.role === "instructor").length;
  const learnerCount = members.filter((m) => m.role === "learner").length;

  const stats = [
    {
      title: "Total Members",
      value: totalMembers,
      icon: Users,
      description: "All organization members",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "Active Members",
      value: activeMembers,
      icon: UserCheck,
      description: "Currently active users",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "Admins",
      value: adminCount,
      icon: Shield,
      description: "Organization administrators",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      title: "Instructors",
      value: instructorCount,
      icon: GraduationCap,
      description: "Course instructors",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
    {
      title: "Learners",
      value: learnerCount,
      icon: BookOpen,
      description: "Student members",
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-950",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} rounded-full p-2`}>
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
