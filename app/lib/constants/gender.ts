export const GENDER_OPTIONS = [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
] as const;

export type GenderOption = (typeof GENDER_OPTIONS)[number];
