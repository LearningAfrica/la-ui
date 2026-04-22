import { Link, useParams } from "react-router";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QuizForm } from "@/components/dashboard/quiz-form";
import { useQuiz } from "@/features/quizzes/quiz-queries";

export default function EditQuizPage() {
  const { courseId, moduleId, quizId } = useParams<{
    courseId: string;
    moduleId: string;
    quizId: string;
  }>();
  const { data: quiz, isLoading } = useQuiz(courseId!, moduleId!, quizId!);
  const back = `/client/dashboard/courses/${courseId}/modules?moduleId=${moduleId}&tab=quizzes`;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <Button asChild variant="ghost" size="sm">
          <Link to={back}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Quizzes
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6" />
          <h1 className="text-2xl font-bold sm:text-3xl">Edit Quiz</h1>
        </div>
        <p className="text-muted-foreground">
          Update the quiz details and questions.
        </p>
      </div>

      {isLoading || !quiz ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <QuizForm
          coursePk={courseId!}
          modulePk={moduleId!}
          quiz={quiz}
          redirectTo={back}
        />
      )}
    </div>
  );
}
