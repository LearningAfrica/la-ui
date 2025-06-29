"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Mock data for weekly activity
const weeklyActivityData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 1.8 },
  { day: "Thu", hours: 4.0 },
  { day: "Fri", hours: 2.7 },
  { day: "Sat", hours: 1.5 },
  { day: "Sun", hours: 0.8 },
]

export function WeeklyActivity() {
  const totalHours = weeklyActivityData.reduce((sum, day) => sum + day.hours, 0).toFixed(1)
  const mostActiveDay = [...weeklyActivityData].sort((a, b) => b.hours - a.hours)[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Learning Activity</CardTitle>
        <CardDescription>Your learning hours for the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Total Hours</span>
            <span className="text-2xl font-bold">{totalHours}h</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Most Active Day</span>
            <span className="text-2xl font-bold">
              {mostActiveDay.day} ({mostActiveDay.hours}h)
            </span>
          </div>
        </div>
        <div className="h-[200px]">
          <ChartContainer
            config={{
              hours: {
                label: "Hours",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData}>
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="hours" fill="var(--color-hours)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
