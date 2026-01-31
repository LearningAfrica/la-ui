import { generateSEOTags } from "@/lib/utils/seo";
import { href } from "react-router";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useTheme } from "@/providers/theme-provider";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Dashboard | Learning Africa - Your Learning Analytics Hub",
      description:
        "View your learning analytics, statistics, and insights in real-time",
      url: href("/dashboard"),
      image: "/og.png",
    }),
  ];
}

export default function Dashboard() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="size-4" />;

    if (theme === "dark") return <Moon className="size-4" />;

    return <Monitor className="size-4" />;
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      description: "from last month",
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180",
      trend: "up",
      icon: Users,
      description: "from last month",
    },
    {
      title: "Farm Operations",
      value: "12,234",
      change: "+19%",
      trend: "up",
      icon: Activity,
      description: "from last month",
    },
    {
      title: "Growth Rate",
      value: "24.5%",
      change: "+4.3%",
      trend: "up",
      icon: TrendingUp,
      description: "from last month",
    },
  ];

  const chartData = [
    { month: "Jan", value: 4000 },
    { month: "Feb", value: 3000 },
    { month: "Mar", value: 5000 },
    { month: "Apr", value: 4500 },
    { month: "May", value: 6000 },
    { month: "Jun", value: 5500 },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New farm registered",
      time: "2 minutes ago",
      type: "success",
    },
    {
      id: 2,
      action: "Data sync completed",
      time: "15 minutes ago",
      type: "info",
    },
    { id: 3, action: "Report generated", time: "1 hour ago", type: "success" },
    { id: 4, action: "System update", time: "2 hours ago", type: "info" },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Current theme: ${theme}`}
          >
            {getThemeIcon()}
          </Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-8">
            {/* Header */}
            <div>
              <p className="text-muted-foreground mt-2">
                Welcome back! Here's what's happening with your farms today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <Card key={stat.title} className="p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                      <p className="text-muted-foreground text-sm font-medium">
                        {stat.title}
                      </p>
                      <Icon className="text-muted-foreground size-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <div
                          className={`flex items-center text-xs font-medium ${
                            stat.trend === "up"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="mr-1 size-3" />
                          ) : (
                            <ArrowDownRight className="mr-1 size-3" />
                          )}
                          {stat.change}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {stat.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Revenue Chart */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Revenue Overview</h3>
                    <p className="text-muted-foreground text-sm">
                      Last 6 months
                    </p>
                  </div>
                  <BarChart3 className="text-muted-foreground size-5" />
                </div>
                <div className="space-y-4">
                  <div className="flex h-48 items-end justify-between gap-2">
                    {chartData.map((item) => (
                      <div
                        key={item.month}
                        className="flex flex-1 flex-col items-center gap-2"
                      >
                        <div
                          className="bg-primary w-full rounded-t transition-all hover:opacity-80"
                          style={{
                            height: `${(item.value / 6000) * 100}%`,
                            minHeight: "8px",
                          }}
                          title={`${item.month}: $${item.value.toLocaleString()}`}
                        />
                        <span className="text-muted-foreground text-xs">
                          {item.month}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Distribution Chart */}
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Farm Distribution</h3>
                    <p className="text-muted-foreground text-sm">By category</p>
                  </div>
                  <PieChart className="text-muted-foreground size-5" />
                </div>
                <div className="space-y-4">
                  <div className="flex h-48 items-center justify-center">
                    <div className="relative size-40">
                      <svg viewBox="0 0 100 100" className="size-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          className="text-muted"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeDasharray={`${2 * Math.PI * 40 * 0.4} ${2 * Math.PI * 40}`}
                          strokeDashoffset={-2 * Math.PI * 40 * 0.1}
                          className="text-primary"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">40%</div>
                          <div className="text-muted-foreground text-xs">
                            Crops
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold">40%</div>
                      <div className="text-muted-foreground text-xs">Crops</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">35%</div>
                      <div className="text-muted-foreground text-xs">
                        Livestock
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">25%</div>
                      <div className="text-muted-foreground text-xs">Mixed</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-background hover:bg-accent/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-2 rounded-full ${
                          activity.type === "success"
                            ? "bg-green-500"
                            : activity.type === "info"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-muted-foreground text-xs">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
