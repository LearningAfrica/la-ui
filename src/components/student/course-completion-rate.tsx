import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

// Mock data for course completion
const completionData = [
  { name: 'Completed', value: 12 },
  { name: 'In Progress', value: 5 },
  { name: 'Not Started', value: 3 },
];

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
];

export function CourseCompletionRate() {
  const totalCourses = completionData.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const completedPercentage = Math.round(
    (completionData[0].value / totalCourses) * 100,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Completion</CardTitle>
        <CardDescription>Your overall course completion rate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Completion Rate
            </p>
            <p className="text-2xl font-bold">{completedPercentage}%</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Total Courses
            </p>
            <p className="text-2xl font-bold">{totalCourses}</p>
          </div>
        </div>
        <div className="h-[200px]">
          <ChartContainer
            config={{
              Completed: {
                label: 'Completed',
                color: COLORS[0],
              },
              'In Progress': {
                label: 'In Progress',
                color: COLORS[1],
              },
              'Not Started': {
                label: 'Not Started',
                color: COLORS[2],
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {completionData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          {completionData.map((entry, index) => (
            <div key={entry.name} className="flex flex-col items-center">
              <div className="flex items-center">
                <div
                  className="mr-1 h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.name}</span>
              </div>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
