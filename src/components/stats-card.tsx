import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  stat: {
    id: string
    value: string
    label: string
    description?: string
  }
}

export function StatsCard({ stat }: StatsCardProps) {
  const { value, label, description } = stat

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="text-3xl font-bold">{value}</div>
        <div className="font-medium mt-1">{label}</div>
        {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
      </CardContent>
    </Card>
  )
}
