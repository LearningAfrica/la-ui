import { useState } from "react";
import { Link, useParams } from "react-router";
import ArrowLeft from "~icons/lucide/arrow-left";
import CheckCircle2 from "~icons/lucide/check-circle-2";
import Loader2 from "~icons/lucide/loader-2";
import RotateCcw from "~icons/lucide/rotate-ccw";
import XCircle from "~icons/lucide/x-circle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useQuiz,
  type QuizAttemptResult,
} from "@/features/quizzes/quiz-queries";
import { useSubmitQuizAttempt } from "@/features/quizzes/quiz-mutations";
import { orgRoutes } from "@/lib/utils/org-routes";
import { cn } from "@/lib/utils";

export default function TakeQuizPage() {
  const {
    orgId = "",
    courseId = "",
    moduleId = "",
    quizId = "",
  } = useParams<{
    orgId: string;
    courseId: string;
    moduleId: string;
    quizId: string;
  }>();
  const { data: quiz, isLoading, error } = useQuiz(courseId, moduleId, quizId);
  const submit = useSubmitQuizAttempt();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizAttemptResult | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <p className="text-destructive">This quiz could not be loaded.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to={orgRoutes.coursePreview(orgId, courseId)}>
            Back to course
          </Link>
        </Button>
      </div>
    );
  }

  const allAnswered = quiz.questions.every((question) => answers[question.id]);

  const handleSubmit = () => {
    if (!allAnswered) return;

    submit.mutate(
      {
        coursePk: courseId,
        modulePk: moduleId,
        quizPk: quizId,
        answers: quiz.questions.map((question) => ({
          question: question.id,
          selected_choice: answers[question.id],
        })),
      },
      { onSuccess: setResult }
    );
  };

  if (result) {
    const ResultIcon = result.passed ? CheckCircle2 : XCircle;

    return (
      <main className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
        <ResultIcon
          className={cn(
            "mx-auto h-16 w-16",
            result.passed ? "text-la-ok" : "text-destructive"
          )}
        />
        <h1 className="font-display text-la-ink mt-5 text-3xl font-bold">
          {result.passed ? "Quiz passed" : "Keep going"}
        </h1>
        <p className="text-la-muted mt-2">
          You answered {result.correct_answers} of {result.total_questions}{" "}
          questions correctly and scored {result.score_percentage}%.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {!result.passed && (
            <Button
              variant="outline"
              onClick={() => {
                setAnswers({});
                setResult(null);
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          )}
          <Button asChild>
            <Link to={orgRoutes.coursePreview(orgId, courseId)}>
              Back to course
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        to={orgRoutes.coursePreview(orgId, courseId)}
        className="text-la-muted hover:text-la-ink mb-6 inline-flex items-center gap-1 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to course
      </Link>
      <header className="mb-8">
        <p className="text-la-forest text-xs font-semibold tracking-[0.2em] uppercase">
          Module quiz
        </p>
        <h1 className="font-display text-la-ink mt-2 text-3xl font-bold">
          {quiz.title}
        </h1>
        {quiz.description && (
          <p className="text-la-muted mt-2">{quiz.description}</p>
        )}
        <p className="text-la-muted mt-3 text-sm">
          Answer every question. A score of {quiz.passing_score}% is required to
          pass.
        </p>
      </header>

      <div className="space-y-6">
        {quiz.questions.map((question, questionIndex) => (
          <section
            key={question.id}
            className="border-la-rule-strong bg-la-paper rounded-xl border p-5 sm:p-6"
          >
            <h2 className="text-la-ink font-semibold">
              {questionIndex + 1}. {question.question_text}
            </h2>
            <div className="mt-4 space-y-2">
              {question.choices.map((choice) => (
                <label
                  key={choice.id}
                  className={cn(
                    "border-la-rule hover:bg-la-cream flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                    answers[question.id] === choice.id &&
                      "border-la-forest bg-la-forest-wash"
                  )}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={choice.id}
                    checked={answers[question.id] === choice.id}
                    disabled={submit.isPending}
                    onChange={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: choice.id,
                      }))
                    }
                    className="mt-0.5"
                  />
                  <span className="text-la-ink-2 text-sm">
                    {choice.choice_text}
                  </span>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="border-la-rule mt-8 flex items-center justify-between gap-4 border-t pt-6">
        <p className="text-la-muted text-sm">
          {Object.keys(answers).length} of {quiz.questions.length} answered
        </p>
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered || submit.isPending}
        >
          {submit.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit quiz
        </Button>
      </div>
    </main>
  );
}
