import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface LearningPathStep {
  id: string
  title: string
  description: string
  completed: boolean
  current?: boolean
}

interface LearningPathProgressProps {
  path: {
    title: string
    description: string
    steps: LearningPathStep[]
  }
}

export function LearningPathProgress({ path }: LearningPathProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{path.title}</CardTitle>
        <CardDescription>{path.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {path.steps.map((step, index) => (
            <div key={step.id} className="mb-8 flex last:mb-0">
              <div className="mr-4 flex flex-col items-center">
                <div>
                  {step.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  )

\
Let's create a component for displaying weekly activity:
