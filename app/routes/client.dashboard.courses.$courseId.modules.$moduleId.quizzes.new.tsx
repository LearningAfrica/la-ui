import { Link, useParams } from "react-router";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizForm } from "@/components/dashboard/quiz-form";

export default function NewQuizPage() {
  const { courseId, moduleId } = useParams<{
    courseId: string;
    moduleId: string;
  }>();
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
          <h1 className="text-2xl font-bold sm:text-3xl">Create Quiz</h1>
        </div>
        <p className="text-muted-foreground">
          Build a quiz to assess learner understanding of this module.
        </p>
      </div>
      <QuizForm coursePk={courseId!} modulePk={moduleId!} redirectTo={back} />
    </div>
  );
}
