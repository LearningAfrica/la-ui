// Auth Query and Mutation Keys
export const authQueryKeys = {
  // Query Keys
  currentUser: () => ["currentUser"] as const,
  verifyEmail: (token: string) => ["verifyEmail", token] as const,
  authStatus: () => ["authStatus"] as const,
};

// Mutation Keys
export const authMutationKeys = {
  login: () => ["login"] as const,
  register: () => ["register"] as const,
  logout: () => ["logout"] as const,
  forgotPassword: () => ["forgotPassword"] as const,
  resetPassword: () => ["resetPassword"] as const,
  verifyEmail: () => ["verifyEmail"] as const,
};
