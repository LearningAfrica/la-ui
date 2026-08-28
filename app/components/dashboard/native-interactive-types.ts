export type NativeBlockType =
  | "accordion"
  | "flashcards"
  | "multiple_choice"
  | "tabs"
  | "callout"
  | "true_false"
  | "matching"
  | "sequence"
  | "scenario";

export type NativeItem = {
  id?: string;
  title?: string;
  content?: string;
  front?: string;
  back?: string;
  left?: string;
  right?: string;
};

export type NativeScenarioChoice = {
  id?: string;
  text: string;
  feedback: string;
  correct?: boolean;
};

export type NativeBlock = {
  id?: string;
  type: NativeBlockType;
  title: string;
  instructions?: string;
  required?: boolean;
  points?: number;
  content?: string;
  items?: NativeItem[];
  question?: string;
  statement?: string;
  options?: string[];
  choices?: NativeScenarioChoice[];
  correctIndex?: number;
  correctAnswer?: boolean;
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  explanation?: string;
  hint?: string;
};

export type NativeDefinition = {
  version?: 1 | 2;
  title?: string;
  learningObjective?: string;
  completionMode?: "all" | "score";
  passScore?: number;
  showCelebration?: boolean;
  presentationMode?: "journey" | "scroll";
  motionIntensity?: "calm" | "playful" | "energetic";
  showProgress?: boolean;
  showPoints?: boolean;
  showStreak?: boolean;
  blocks: NativeBlock[];
};

export function createNativeId(prefix = "activity") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return `${prefix}-${crypto.randomUUID()}`;

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function blockKey(block: NativeBlock, index: number) {
  return block.id || `${block.type}-${index}`;
}

export function blockPoints(block: NativeBlock) {
  return Math.max(0, Math.round(block.points ?? 10));
}
