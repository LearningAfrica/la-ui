import { useState } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import type { Control, FieldValues } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextField, FormTextareaField } from "@/components/form-fields";
import {
  quizResolver,
  defaultQuizValues,
  type QuizFormData,
} from "@/lib/schema/quiz-schema";
import ChevronDown from "~icons/lucide/chevron-down";
import ChevronRight from "~icons/lucide/chevron-right";
import Loader2 from "~icons/lucide/loader-2";
import Plus from "~icons/lucide/plus";
import Trash2 from "~icons/lucide/trash-2";
import Check from "~icons/lucide/check";
import {
  useCreateQuiz,
  useUpdateQuiz,
} from "@/features/quizzes/quiz-mutations";
import type { Quiz } from "@/features/quizzes/quiz-queries";
import { cn } from "@/lib/utils";
import { orgRoutes } from "@/lib/utils/org-routes";

interface QuizFormProps {
  coursePk: string;
  modulePk: string;
  quiz?: Quiz;
  redirectTo?: string;
}

function quizToFormValues(quiz: Quiz): QuizFormData {
  return {
    title: quiz.title,
    description: quiz.description ?? "",
    passing_score: quiz.passing_score,
    questions: (quiz.questions ?? []).map((q, qi) => ({
      question_text: q.question_text,
      order: q.order ?? qi,
      choices: (q.choices ?? []).map((c) => ({
        choice_text: c.choice_text,
        is_correct: c.is_correct,
      })),
    })),
  };
}

/** Flat, hairline-separated group — matches the course form. */
function Section({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-la-rule border-t pt-6 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-la-ink text-sm font-bold">
            {title}
          </h3>
          {hint && <p className="text-la-muted mt-0.5 text-xs">{hint}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function ChoicesFieldArray({
  control,
  questionIndex,
  disabled,
}: {
  control: Control<FieldValues>;
  questionIndex: number;
  disabled: boolean;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.choices`,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-la-muted text-xs font-medium">
          Answers — tap the circle to mark the correct one
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ choice_text: "", is_correct: false })}
          disabled={disabled}
        >
          <Plus className="mr-1 size-3" />
          Add answer
        </Button>
      </div>
      <div className="space-y-2">
        {fields.map((field, ci) => (
          <ChoiceRow
            key={field.id}
            control={control}
            questionIndex={questionIndex}
            choiceIndex={ci}
            canRemove={fields.length > 2}
            onRemove={() => remove(ci)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

function ChoiceRow({
  control,
  questionIndex,
  choiceIndex,
  canRemove,
  onRemove,
  disabled,
}: {
  control: Control<FieldValues>;
  questionIndex: number;
  choiceIndex: number;
  canRemove: boolean;
  onRemove: () => void;
  disabled: boolean;
}) {
  const base = `questions.${questionIndex}.choices.${choiceIndex}`;

  return (
    <Controller
      control={control}
      name={`${base}.is_correct`}
      render={({ field: correct }) => {
        const isCorrect = !!correct.value;

        return (
          <div
            className={cn(
              "focus-within:border-la-forest focus-within:ring-la-forest/30 flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors focus-within:ring-2",
              isCorrect ? "border-la-ok/40 bg-la-ok/5" : "border-la-rule-strong"
            )}
          >
            <button
              type="button"
              onClick={() => correct.onChange(!isCorrect)}
              disabled={disabled}
              aria-pressed={isCorrect}
              aria-label={isCorrect ? "Correct answer" : "Mark as correct"}
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                isCorrect
                  ? "border-la-ok bg-la-ok text-white"
                  : "border-la-rule-strong hover:border-la-ok text-transparent"
              )}
            >
              <Check className="size-3.5" />
            </button>
            <Controller
              control={control}
              name={`${base}.choice_text`}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value ?? ""}
                  placeholder={`Answer ${choiceIndex + 1}`}
                  disabled={disabled}
                  className="text-la-ink placeholder:text-la-muted flex-1 bg-transparent text-sm outline-none"
                />
              )}
            />
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled || !canRemove}
              aria-label="Remove answer"
              className="text-la-muted hover:text-la-bad shrink-0 transition-colors disabled:opacity-30"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        );
      }}
    />
  );
}

function QuestionCard({
  qi,
  totalQuestions,
  control,
  expanded,
  onToggle,
  onRemove,
  disabled,
}: {
  qi: number;
  totalQuestions: number;
  control: Control<FieldValues>;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  disabled: boolean;
}) {
  const questionText = useWatch({
    control,
    name: `questions.${qi}.question_text`,
  }) as string | undefined;

  const choices = useWatch({
    control,
    name: `questions.${qi}.choices`,
  }) as { choice_text?: string; is_correct?: boolean }[] | undefined;

  const correctCount = (choices ?? []).filter((c) => c?.is_correct).length;
  const preview = (questionText || "").trim() || "Untitled question";

  return (
    <div className="border-la-rule-strong bg-la-paper overflow-hidden rounded-lg border">
      <div
        className={cn(
          "flex w-full items-center gap-3 p-3",
          expanded && "border-la-rule border-b"
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          {expanded ? (
            <ChevronDown className="text-la-muted size-4 shrink-0" />
          ) : (
            <ChevronRight className="text-la-muted size-4 shrink-0" />
          )}
          <div className="bg-la-forest-wash text-la-forest font-display flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {qi + 1}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-la-ink truncate text-sm font-medium">
              {preview}
            </p>
            <p className="text-la-muted text-xs">
              {choices?.length ?? 0} answers ·{" "}
              <span
                className={cn(
                  correctCount === 0 ? "text-la-bad" : "text-la-ok"
                )}
              >
                {correctCount} correct
              </span>
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled || totalQuestions <= 1}
          aria-label="Remove question"
          className="text-la-muted hover:text-la-bad shrink-0 transition-colors disabled:opacity-30"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      {expanded && (
        <div className="space-y-4 p-4">
          <FormTextareaField
            control={control}
            name={`questions.${qi}.question_text`}
            label="Question"
            placeholder="Enter the question"
            required
            disabled={disabled}
            rows={2}
          />
          <ChoicesFieldArray
            control={control}
            questionIndex={qi}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}

export function QuizForm({
  coursePk,
  modulePk,
  quiz,
  redirectTo,
}: QuizFormProps) {
  const navigate = useNavigate();
  const { orgId = "" } = useParams<{ orgId: string }>();
  const isEditing = !!quiz;

  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();

  const form = useForm({
    resolver: quizResolver,
    defaultValues: quiz ? quizToFormValues(quiz) : defaultQuizValues,
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control: form.control, name: "questions" });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleAddQuestion = () => {
    appendQuestion({
      question_text: "",
      order: questionFields.length,
      choices: [
        { choice_text: "", is_correct: true },
        { choice_text: "", is_correct: false },
      ],
    });
    setExpandedIndex(questionFields.length);
  };

  const handleRemoveQuestion = (qi: number) => {
    removeQuestion(qi);
    setExpandedIndex((prev) => {
      if (prev === qi) return null;

      if (prev !== null && prev > qi) return prev - 1;

      return prev;
    });
  };

  const toggleExpanded = (qi: number) => {
    setExpandedIndex((prev) => (prev === qi ? null : qi));
  };

  const back = redirectTo ?? orgRoutes.courseModules(orgId, coursePk);

  const isLoading =
    createQuiz.isPending || updateQuiz.isPending || form.formState.isSubmitting;

  const handleSubmit = form.handleSubmit((data) => {
    const normalisedQuestions = data.questions.map((q, idx) => ({
      ...q,
      order: idx,
    }));

    const payload = {
      title: data.title,
      description: data.description,
      passing_score: data.passing_score,
      questions: normalisedQuestions,
    };

    const done = () => navigate(back);

    if (isEditing && quiz) {
      return updateQuiz.mutateAsync(
        { ...payload, coursePk, modulePk, id: quiz.id },
        { onSuccess: done }
      );
    }

    return createQuiz.mutateAsync(
      { ...payload, coursePk, modulePk },
      { onSuccess: done }
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Details" hint="Name the quiz and set the pass mark.">
          <FormTextField
            control={form.control}
            name="title"
            label="Quiz title"
            placeholder="e.g. Module 1 knowledge check"
            required
            disabled={isLoading}
          />
          <FormTextareaField
            control={form.control}
            name="description"
            label="Description"
            placeholder="Optional short description"
            disabled={isLoading}
            rows={2}
          />
          <Controller
            control={form.control}
            name="passing_score"
            render={({ field, fieldState }) => {
              // Schema stores an integer percent (0–100).
              const pct = Math.round(Number(field.value) || 0);

              return (
                <div className="space-y-2">
                  <label
                    htmlFor="passing-score"
                    className="text-la-ink text-sm font-medium"
                  >
                    Passing score{" "}
                    <span className="text-la-muted font-normal">— {pct}%</span>
                  </label>
                  <input
                    id="passing-score"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={pct}
                    disabled={isLoading}
                    aria-label="Passing score percentage"
                    aria-valuetext={`${pct} percent`}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="accent-la-forest focus-visible:ring-la-forest w-full rounded focus-visible:ring-2 focus-visible:outline-none"
                  />
                  <p className="text-la-muted text-xs">
                    Learners must score at least {pct}% to pass.
                  </p>
                  {fieldState.error && (
                    <p className="text-la-bad text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              );
            }}
          />
        </Section>

        <Section
          title="Questions"
          hint="Each question needs 2+ answers and at least one correct."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddQuestion}
              disabled={isLoading}
            >
              <Plus className="mr-1 size-3" />
              Add question
            </Button>
          }
        >
          <div className="space-y-2">
            {questionFields.map((q, qi) => (
              <QuestionCard
                key={q.id}
                qi={qi}
                totalQuestions={questionFields.length}
                control={form.control as unknown as Control<FieldValues>}
                expanded={expandedIndex === qi}
                onToggle={() => toggleExpanded(qi)}
                onRemove={() => handleRemoveQuestion(qi)}
                disabled={isLoading}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddQuestion}
            disabled={isLoading}
            className="w-full border-dashed"
          >
            <Plus className="mr-1 size-4" />
            Add question
          </Button>
        </Section>

        {/* Sticky action bar */}
        <div className="border-la-rule bg-la-paper sticky bottom-0 z-10 -mx-4 flex justify-end gap-3 border-t px-4 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(back)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEditing ? "Save changes" : "Create quiz"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
