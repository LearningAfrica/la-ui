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
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// Mock data for category performance
const categoryData = [
  { name: 'Programming', score: 85 },
  { name: 'Design', score: 72 },
  { name: 'Marketing', score: 90 },
  { name: 'Business', score: 78 },
  { name: 'Data Science', score: 82 },
];

export function CategoryPerformance() {
  const averageScore = Math.round(
    categoryData.reduce((sum, category) => sum + category.score, 0) /
      categoryData.length,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Performance</CardTitle>
        <CardDescription>
          Your performance across different subject areas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-muted-foreground text-sm font-medium">
            Average Score
          </p>
          <p className="text-2xl font-bold">{averageScore}%</p>
        </div>
        <div className="h-[200px]">
          <ChartContainer
            config={{
              score: {
                label: 'Score',
                color: 'hsl(var(--chart-1))',
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="score"
                  fill="var(--color-score)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
