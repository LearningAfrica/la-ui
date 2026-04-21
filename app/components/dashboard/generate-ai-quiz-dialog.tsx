import { useEffect, useEffectEvent } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
  FormNumberField,
  FormSelectField,
} from "@/components/form-fields";
import {
  aiQuizResolver,
  defaultAiQuizValues,
  difficultyOptions,
} from "@/lib/schema/quiz-schema";
import { Sparkles, Loader2 } from "lucide-react";
import { useGenerateAiQuiz } from "@/features/quizzes/quiz-mutations";
import { useAppModal } from "@/stores/filters/modal-hooks";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "generate-ai-quiz": undefined;
  }
}

interface GenerateAiQuizDialogProps {
  coursePk: string;
  modulePk: string;
}

export function GenerateAiQuizDialog({
  coursePk,
  modulePk,
}: GenerateAiQuizDialogProps) {
  const modal = useAppModal("generate-ai-quiz");
  const generateAi = useGenerateAiQuiz();

  const form = useForm({
    resolver: aiQuizResolver,
    defaultValues: defaultAiQuizValues,
  });

  const onDialogOpened = useEffectEvent(() => {
    form.reset(defaultAiQuizValues);
  });

  useEffect(() => {
    if (modal.isOpen) {
      onDialogOpened();
    }
  }, [modal.isOpen]);

  const isLoading = generateAi.isPending || form.formState.isSubmitting;

  const handleSubmit = form.handleSubmit((data) => {
    generateAi.mutate(
      { coursePk, modulePk, ...data },
      {
        onSuccess() {
          modal.close();
          form.reset(defaultAiQuizValues);
        },
      }
    );
  });

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(v) => {
        if (!v) modal.close();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Generate Quiz with AI
          </DialogTitle>
          <DialogDescription>
            Describe the topic and the AI will draft a quiz for you to review.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormTextField
              control={form.control}
              name="topic"
              label="Topic"
              placeholder="e.g. React hooks fundamentals"
              required
              disabled={isLoading}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormNumberField
                control={form.control}
                name="num_questions"
                label="Number of questions"
                placeholder="5"
                required
                disabled={isLoading}
                inputProps={{ min: 1, max: 20 }}
              />
              <FormSelectField
                control={form.control}
                name="difficulty"
                label="Difficulty"
                placeholder="Select difficulty"
                required
                disabled={isLoading}
                options={[...difficultyOptions]}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
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
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
