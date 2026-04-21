import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quizMutationKeys, quizQueryKeys } from "./quiz-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";
import type { Quiz, QuizAttemptResult } from "./quiz-queries";

export interface CreateQuizChoicePayload {
  choice_text: string;
  is_correct: boolean;
}

export interface CreateQuizQuestionPayload {
  question_text: string;
  order: number;
  choices: CreateQuizChoicePayload[];
}

export interface CreateQuizPayload {
  coursePk: string;
  modulePk: string;
  title: string;
  description?: string;
  passing_score: number;
  questions: CreateQuizQuestionPayload[];
}

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: quizMutationKeys.createQuiz(),
    mutationFn: async ({ coursePk, modulePk, ...data }: CreateQuizPayload) => {
      const response = await apiClient.post<Quiz>(
        `/api/courses/${coursePk}/modules/${modulePk}/quizzes/`,
        { ...data, module: modulePk }
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.all });
      toast.success({
        message: `Quiz "${data.title}" created successfully.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to create quiz. Please try again.",
      });
    },
  });
};

export interface UpdateQuizPayload {
  coursePk: string;
  modulePk: string;
  id: string;
  title?: string;
  description?: string;
  passing_score?: number;
  questions?: CreateQuizQuestionPayload[];
}

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: quizMutationKeys.updateQuiz(),
    mutationFn: async ({
      coursePk,
      modulePk,
      id,
      ...data
    }: UpdateQuizPayload) => {
      const response = await apiClient.patch<Quiz>(
        `/api/courses/${coursePk}/modules/${modulePk}/quizzes/${id}/`,
        data
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.all });
      toast.success({
        message: `Quiz "${data.title}" updated successfully.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to update quiz. Please try again.",
      });
    },
  });
};

export interface DeleteQuizPayload {
  coursePk: string;
  modulePk: string;
  id: string;
  title?: string;
}

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: quizMutationKeys.deleteQuiz(),
    mutationFn: async ({ coursePk, modulePk, id }: DeleteQuizPayload) => {
      await apiClient.delete(
        `/api/courses/${coursePk}/modules/${modulePk}/quizzes/${id}/`
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.all });
      toast.success({
        message: `Quiz${variables.title ? ` "${variables.title}"` : ""} deleted.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to delete quiz. Please try again.",
      });
    },
  });
};

export interface GenerateAiQuizPayload {
  coursePk: string;
  modulePk: string;
  topic?: string;
  num_questions?: number;
  difficulty?: "easy" | "medium" | "hard";
}

// Backend runs AI generation async and responds 202 with a task id.
// The actual quiz lands in the module's list once the job completes, so
// the UI polls the quiz list for a short window after kickoff.
interface AiGenerationResponse {
  message?: string;
  task_id?: string;
}

export const useGenerateAiQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: quizMutationKeys.generateAiQuiz(),
    mutationFn: async ({
      coursePk,
      modulePk,
      ...data
    }: GenerateAiQuizPayload) => {
      const response = await apiClient.post<AiGenerationResponse>(
        `/api/courses/${coursePk}/modules/${modulePk}/quizzes/generate-ai/`,
        { ...data, module: modulePk }
      );

      return { response: response.data, coursePk, modulePk };
    },
    onSuccess: ({ coursePk, modulePk }) => {
      toast.success({
        message: "AI quiz generation started",
        description:
          "The quiz will appear here in a moment — we're refreshing the list.",
      });

      // Poll the quizzes list a few times to pick up the generated quiz.
      const key = quizQueryKeys.list(coursePk, modulePk);
      let ticks = 0;
      const interval = window.setInterval(() => {
        ticks += 1;
        queryClient.invalidateQueries({ queryKey: key });

        if (ticks >= 6) window.clearInterval(interval);
      }, 3000);
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to generate quiz. Please try again.",
      });
    },
  });
};

export interface SubmitAttemptPayload {
  coursePk: string;
  modulePk: string;
  quizPk: string;
  attemptId: string;
  answers: Array<{
    question: string;
    selected_choice: string;
  }>;
}

export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: quizMutationKeys.submitAttempt(),
    mutationFn: async ({
      coursePk,
      modulePk,
      quizPk,
      attemptId,
      answers,
    }: SubmitAttemptPayload) => {
      const response = await apiClient.post<QuizAttemptResult>(
        `/api/courses/${coursePk}/modules/${modulePk}/quizzes/${quizPk}/attempt/${attemptId}/submit/`,
        { answers }
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: quizQueryKeys.all });
      toast.success({
        message: data.passed
          ? "Quiz passed! Nice work."
          : "Quiz submitted. Keep practising.",
        description: `Score: ${data.score}%`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to submit quiz. Please try again.",
      });
    },
  });
};
