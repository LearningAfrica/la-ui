import { useState } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import type { Control, FieldValues } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";
import {
  FormTextField,
  FormTextareaField,
  FormNumberField,
} from "@/components/form-fields";
import {
  quizResolver,
  defaultQuizValues,
  type QuizFormData,
} from "@/lib/schema/quiz-schema";
import { ChevronDown, ChevronRight, Loader2, Plus, Trash2 } from "lucide-react";
import {
  useCreateQuiz,
  useUpdateQuiz,
} from "@/features/quizzes/quiz-mutations";
import type { Quiz } from "@/features/quizzes/quiz-queries";
import { cn } from "@/lib/utils";

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
        <label className="text-muted-foreground text-xs font-medium">
          Answers (mark the correct ones)
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ choice_text: "", is_correct: false })}
          disabled={disabled}
        >
          <Plus className="mr-1 h-3 w-3" />
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
  const correctId = `choice-correct-${questionIndex}-${choiceIndex}`;

  return (
    <div className="flex items-start gap-2">
      <Controller
        control={control}
        name={`questions.${questionIndex}.choices.${choiceIndex}.is_correct`}
        render={({ field }) => (
          <div className="flex items-center gap-1 pt-2">
            <Checkbox
              id={correctId}
              checked={!!field.value}
              onCheckedChange={(checked) => field.onChange(!!checked)}
              disabled={disabled}
            />
            <Label
              htmlFor={correctId}
              className="text-muted-foreground cursor-pointer text-xs"
            >
              Correct
            </Label>
          </div>
        )}
      />
      <div className="flex-1">
        <FormTextField
          control={control}
          name={`questions.${questionIndex}.choices.${choiceIndex}.choice_text`}
          label=""
          placeholder={`Answer ${choiceIndex + 1}`}
          disabled={disabled}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={disabled || !canRemove}
        className="mt-1 text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
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
    <div className="overflow-hidden rounded-lg border">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "hover:bg-muted/40 flex w-full items-center gap-3 p-3 text-left transition-colors",
          expanded && "bg-muted/30"
        )}
      >
        {expanded ? (
          <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
        ) : (
          <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0" />
        )}
        <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
          {qi + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{preview}</p>
          <p className="text-muted-foreground text-xs">
            {choices?.length ?? 0} answers · {correctCount} correct
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          disabled={disabled || totalQuestions <= 1}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </button>

      {expanded && (
        <div className="space-y-3 border-t p-4">
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

  const back = redirectTo ?? `/client/dashboard/courses/${coursePk}/modules`;

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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormTextField
            control={form.control}
            name="title"
            label="Quiz Title"
            placeholder="e.g. Module 1 Knowledge Check"
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
          <FormNumberField
            control={form.control}
            name="passing_score"
            label="Passing Score (%)"
            placeholder="70"
            required
            disabled={isLoading}
            inputProps={{ min: 0, max: 100 }}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">Questions</h3>
              <p className="text-muted-foreground text-xs">
                Add at least one question. Each needs two or more answers with
                at least one correct.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddQuestion}
              disabled={isLoading}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add Question
            </Button>
          </div>

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
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Question
          </Button>
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(back)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Quiz"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
