import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const quizChoiceSchema = z.object({
  choice_text: z
    .string()
    .min(1, "Answer text is required")
    .max(500, "Answer must be less than 500 characters"),
  is_correct: z.boolean().default(false),
});

export const quizQuestionSchema = z.object({
  question_text: z
    .string()
    .min(3, "Question must be at least 3 characters")
    .max(1000, "Question must be less than 1000 characters"),
  order: z.coerce.number().int().min(0).default(0),
  choices: z
    .array(quizChoiceSchema)
    .min(2, "At least two answers are required")
    .refine(
      (choices) => choices.some((c) => c.is_correct),
      "Mark at least one answer as correct"
    ),
});

export const quizSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000).optional(),
  passing_score: z.coerce
    .number()
    .int()
    .min(0, "Passing score must be between 0 and 100")
    .max(100, "Passing score must be between 0 and 100")
    .default(70),
  questions: z.array(quizQuestionSchema).min(1, "Add at least one question"),
});

export type QuizFormData = z.infer<typeof quizSchema>;

export type QuizQuestionFormData = z.infer<typeof quizQuestionSchema>;

export type QuizChoiceFormData = z.infer<typeof quizChoiceSchema>;

export const quizResolver = zodResolver(quizSchema);

export const defaultQuizValues: QuizFormData = {
  title: "",
  description: "",
  passing_score: 70,
  questions: [
    {
      question_text: "",
      order: 0,
      choices: [
        { choice_text: "", is_correct: true },
        { choice_text: "", is_correct: false },
      ],
    },
  ],
};

export const aiQuizSchema = z.object({
  topic: z
    .string()
    .min(3, "Topic must be at least 3 characters")
    .max(200, "Topic must be less than 200 characters"),
  num_questions: z.coerce
    .number()
    .int()
    .min(1, "At least 1 question")
    .max(20, "Max 20 questions")
    .default(5),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export type AiQuizFormData = z.infer<typeof aiQuizSchema>;

export const aiQuizResolver = zodResolver(aiQuizSchema);

export const defaultAiQuizValues: AiQuizFormData = {
  topic: "",
  num_questions: 5,
  difficulty: "medium",
};

export const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;
