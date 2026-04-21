export const quizQueryKeys = {
  all: ["quizzes"] as const,
  list: (coursePk: string, modulePk: string) =>
    [...quizQueryKeys.all, coursePk, modulePk] as const,
  detail: (coursePk: string, modulePk: string, id: string) =>
    [...quizQueryKeys.all, coursePk, modulePk, id] as const,
  attemptResult: (
    coursePk: string,
    modulePk: string,
    quizPk: string,
    attemptId: string
  ) =>
    [
      ...quizQueryKeys.all,
      coursePk,
      modulePk,
      quizPk,
      "attempt",
      attemptId,
      "result",
    ] as const,
};

export const quizMutationKeys = {
  createQuiz: () => ["createQuiz"] as const,
  updateQuiz: () => ["updateQuiz"] as const,
  deleteQuiz: () => ["deleteQuiz"] as const,
  generateAiQuiz: () => ["generateAiQuiz"] as const,
  submitAttempt: () => ["submitQuizAttempt"] as const,
};
