import { useEffect, useEffectEvent } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import type { Control, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ClipboardCheck, Loader2, Plus, Trash2 } from "lucide-react";
import {
  useCreateQuiz,
  useUpdateQuiz,
} from "@/features/quizzes/quiz-mutations";
import type { Quiz } from "@/features/quizzes/quiz-queries";
import { useAppModal } from "@/stores/filters/modal-hooks";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "create-or-update-quiz": Quiz | undefined;
  }
}

interface CreateOrUpdateQuizDialogProps {
  coursePk: string;
  modulePk: string;
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

interface ChoicesFieldArrayProps {
  control: Control<FieldValues>;
  questionIndex: number;
  disabled: boolean;
}

function ChoicesFieldArray({
  control,
  questionIndex,
  disabled,
}: ChoicesFieldArrayProps) {
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

interface ChoiceRowProps {
  control: Control<FieldValues>;
  questionIndex: number;
  choiceIndex: number;
  canRemove: boolean;
  onRemove: () => void;
  disabled: boolean;
}

function ChoiceRow({
  control,
  questionIndex,
  choiceIndex,
  canRemove,
  onRemove,
  disabled,
}: ChoiceRowProps) {
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

export function CreateOrUpdateQuizDialog({
  coursePk,
  modulePk,
}: CreateOrUpdateQuizDialogProps) {
  const modal = useAppModal("create-or-update-quiz");
  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();

  const isEditing = !!modal.data?.id;

  const form = useForm({
    resolver: quizResolver,
    defaultValues: defaultQuizValues,
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control: form.control, name: "questions" });

  const onDialogOpened = useEffectEvent((data: Quiz | undefined) => {
    if (data?.id) {
      form.reset(quizToFormValues(data));
    } else {
      form.reset(defaultQuizValues);
    }
  });

  useEffect(() => {
    if (modal.isOpen) {
      onDialogOpened(modal.data ?? undefined);
    }
  }, [modal.isOpen, modal.data]);

  const isLoading =
    createQuiz.isPending || updateQuiz.isPending || form.formState.isSubmitting;

  const handleSubmit = form.handleSubmit((data) => {
    // Normalise order field so backend receives sequential order
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

    if (isEditing && modal.data?.id) {
      updateQuiz.mutate(
        {
          ...payload,
          coursePk,
          modulePk,
          id: modal.data.id,
        },
        {
          onSuccess() {
            modal.close();
            form.reset(defaultQuizValues);
          },
        }
      );
    } else {
      createQuiz.mutate(
        { ...payload, coursePk, modulePk },
        {
          onSuccess() {
            modal.close();
            form.reset(defaultQuizValues);
          },
        }
      );
    }
  });

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(v) => {
        if (!v) modal.close();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            {isEditing ? "Edit Quiz" : "Create Quiz"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the quiz details and questions."
              : "Build a quiz to assess learner understanding of this module."}
          </DialogDescription>
        </DialogHeader>

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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Questions</h3>
                  <p className="text-muted-foreground text-xs">
                    Add at least one question. Each needs two or more answers
                    with at least one correct.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendQuestion({
                      question_text: "",
                      order: questionFields.length,
                      choices: [
                        { choice_text: "", is_correct: true },
                        { choice_text: "", is_correct: false },
                      ],
                    })
                  }
                  disabled={isLoading}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-4">
                {questionFields.map((q, qi) => (
                  <div key={q.id} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-muted-foreground text-xs font-medium">
                        Question {qi + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(qi)}
                        disabled={isLoading || questionFields.length <= 1}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <FormTextareaField
                      control={form.control}
                      name={`questions.${qi}.question_text`}
                      label="Question"
                      placeholder="Enter the question"
                      required
                      disabled={isLoading}
                      rows={2}
                    />

                    <ChoicesFieldArray
                      control={form.control as unknown as Control<FieldValues>}
                      questionIndex={qi}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => modal.close()}
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
      </DialogContent>
    </Dialog>
  );
}
