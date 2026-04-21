import { useQuery } from "@tanstack/react-query";
import { quizQueryKeys } from "./quiz-query-keys";
import { apiClient } from "@/lib/api";

export interface QuizChoice {
  id: string;
  choice_text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  order: number;
  choices: QuizChoice[];
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  module: string;
  passing_score: number;
  questions: QuizQuestion[];
  created_at?: string;
  updated_at?: string;
}

export interface QuizAttemptResult {
  id: string;
  quiz: string;
  score: number;
  passed: boolean;
  submitted_at: string;
  answers: Array<{
    question: string;
    selected_choice: string;
    is_correct: boolean;
  }>;
}

export const useQuizzes = (coursePk: string, modulePk: string) => {
  return useQuery({
    queryKey: quizQueryKeys.list(coursePk, modulePk),
    queryFn: async () => {
      const response = await apiClient.get<Quiz[]>(
        `/api/courses/${coursePk}/modules/${modulePk}/quizzes/`
      );

      return response.data;
    },
    enabled: !!coursePk && !!modulePk,
  });
};

export const useQuiz = (coursePk: string, modulePk: string, id: string) => {
  return useQuery({
    queryKey: quizQueryKeys.detail(coursePk, modulePk, id),
    queryFn: async () => {
      const response = await apiClient.get<Quiz>(
        `/api/courses/${coursePk}/modules/${modulePk}/quizzes/${id}/`
      );

      return response.data;
    },
    enabled: !!coursePk && !!modulePk && !!id,
  });
};

export const useQuizAttemptResult = (
  coursePk: string,
  modulePk: string,
  quizPk: string,
  attemptId: string
) => {
  return useQuery({
    queryKey: quizQueryKeys.attemptResult(
      coursePk,
      modulePk,
      quizPk,
      attemptId
    ),
    queryFn: async () => {
      const response = await apiClient.get<QuizAttemptResult>(
        `/api/courses/${coursePk}/modules/${modulePk}/quizzes/${quizPk}/attempt/${attemptId}/result/`
      );

      return response.data;
    },
    enabled: !!coursePk && !!modulePk && !!quizPk && !!attemptId,
  });
};
