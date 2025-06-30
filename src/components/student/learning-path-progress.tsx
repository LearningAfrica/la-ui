import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearningPathStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current?: boolean;
  locked?: boolean;
  estimatedTime?: string;
  type: 'course' | 'quiz' | 'project' | 'reading';
}

interface LearningPathProgressProps {
  path: {
    id: string;
    title: string;
    description: string;
    totalSteps: number;
    completedSteps: number;
    estimatedDuration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    steps: LearningPathStep[];
  };
}

const stepTypeColors = {
  course: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  quiz: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  project:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  reading:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function LearningPathProgress({ path }: LearningPathProgressProps) {
  const progressPercentage = (path.completedSteps / path.totalSteps) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{path.title}</CardTitle>
            <CardDescription>{path.description}</CardDescription>
          </div>
          <Badge className={difficultyColors[path.difficulty]}>
            {path.difficulty}
          </Badge>
        </div>

        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <span>
            {path.completedSteps} of {path.totalSteps} steps completed
          </span>
          <span>•</span>
          <span>{path.estimatedDuration}</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative">
          {path.steps.map((step, index) => (
            <div key={step.id} className="mb-8 flex last:mb-0">
              <div className="mr-4 flex flex-col items-center">
                <div className="relative">
                  {step.completed ? (
                    <CheckCircle2 className="text-primary h-6 w-6" />
                  ) : step.current ? (
                    <div className="border-primary bg-primary/20 flex h-6 w-6 items-center justify-center rounded-full border-2">
                      <div className="bg-primary h-2 w-2 rounded-full" />
                    </div>
                  ) : step.locked ? (
                    <Lock className="text-muted-foreground h-6 w-6" />
                  ) : (
                    <Circle className="text-muted-foreground h-6 w-6" />
                  )}
                </div>
                {index < path.steps.length - 1 && (
                  <div
                    className={cn(
                      'mt-2 h-12 w-px',
                      step.completed ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3
                    className={cn(
                      'font-medium',
                      step.current && 'text-primary',
                      step.locked && 'text-muted-foreground',
                    )}
                  >
                    {step.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={cn('text-xs', stepTypeColors[step.type])}
                  >
                    {step.type}
                  </Badge>
                  {step.estimatedTime && (
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {step.estimatedTime}
                    </div>
                  )}
                </div>

                <p
                  className={cn(
                    'text-muted-foreground text-sm',
                    step.locked && 'opacity-50',
                  )}
                >
                  {step.description}
                </p>

                {step.current && (
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="text-primary border-primary"
                    >
                      Current Step
                    </Badge>
                  </div>
                )}

                {step.completed && (
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="border-green-600 text-green-600"
                    >
                      Completed
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 border-t pt-6">
          <div className="flex gap-2">
            {path.steps.some((step) => step.current) && (
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors">
                Continue Learning
              </button>
            )}
            <button className="border-border hover:bg-accent rounded-md border px-4 py-2 transition-colors">
              View Full Path
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
