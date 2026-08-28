import { useState } from "react";
import ArrowDown from "~icons/lucide/arrow-down";
import ArrowUp from "~icons/lucide/arrow-up";
import Copy from "~icons/lucide/copy";
import Eye from "~icons/lucide/eye";
import Plus from "~icons/lucide/plus";
import Trash2 from "~icons/lucide/trash-2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createNativeId,
  type NativeBlock,
  type NativeBlockType,
  type NativeDefinition,
  type NativeItem,
} from "./native-interactive-types";
import { NativeLearningPlayer } from "./native-learning-player";

export type { NativeBlock, NativeDefinition } from "./native-interactive-types";

const blockTypes: Array<{
  value: NativeBlockType;
  label: string;
  description: string;
}> = [
  {
    value: "flashcards",
    label: "Flip cards",
    description: "Recall and self-check",
  },
  {
    value: "multiple_choice",
    label: "Multiple choice",
    description: "Question with feedback",
  },
  {
    value: "true_false",
    label: "True or false",
    description: "Fast misconception check",
  },
  {
    value: "matching",
    label: "Matching game",
    description: "Pair related concepts",
  },
  {
    value: "sequence",
    label: "Put in order",
    description: "Arrange steps or events",
  },
  {
    value: "scenario",
    label: "Decision scenario",
    description: "Choose and see consequences",
  },
  {
    value: "accordion",
    label: "Accordion",
    description: "Progressive disclosure",
  },
  { value: "tabs", label: "Tabs", description: "Explore related views" },
  { value: "callout", label: "Key point", description: "Highlight an idea" },
];

const areaClass =
  "border-input bg-background min-h-20 w-full rounded-md border px-3 py-2 text-sm";

function starter(type: NativeBlockType): NativeBlock {
  const common = { id: createNativeId(type), type, required: true, points: 10 };

  if (type === "multiple_choice")
    return {
      ...common,
      title: "Knowledge check",
      question: "",
      options: ["", ""],
      correctIndex: 0,
      feedbackCorrect: "Exactly right — well done!",
      feedbackIncorrect: "Not quite. Review the explanation and try again.",
    };

  if (type === "true_false")
    return {
      ...common,
      title: "True or false",
      statement: "",
      correctAnswer: true,
      feedbackCorrect: "Correct!",
      feedbackIncorrect: "Not yet — take another look.",
    };

  if (type === "flashcards")
    return {
      ...common,
      title: "Flip to reveal",
      instructions:
        "Predict the answer, then flip each card and mark what you know.",
      items: [{ id: createNativeId("card"), front: "", back: "" }],
    };

  if (type === "matching")
    return {
      ...common,
      title: "Match the pairs",
      instructions: "Select one item from each column to make a pair.",
      items: [
        { id: createNativeId("pair"), left: "", right: "" },
        { id: createNativeId("pair"), left: "", right: "" },
      ],
      feedbackCorrect: "Great match!",
      feedbackIncorrect: "Those do not match yet. Try another combination.",
    };

  if (type === "sequence")
    return {
      ...common,
      title: "Put the steps in order",
      instructions: "Reorder the items, then check your answer.",
      items: [
        { id: createNativeId("step"), title: "" },
        { id: createNativeId("step"), title: "" },
      ],
      feedbackCorrect: "Perfect sequence!",
      feedbackIncorrect:
        "Some steps are out of order. Adjust them and try again.",
    };

  if (type === "scenario")
    return {
      ...common,
      title: "What would you do?",
      content: "",
      choices: [
        { id: createNativeId("choice"), text: "", feedback: "", correct: true },
        {
          id: createNativeId("choice"),
          text: "",
          feedback: "",
          correct: false,
        },
      ],
    };

  if (type === "accordion" || type === "tabs")
    return {
      ...common,
      title: type === "tabs" ? "Explore the views" : "Explore this topic",
      items: [{ id: createNativeId("item"), title: "", content: "" }],
    };

  return { ...common, title: "Key point", content: "" };
}

function itemFor(block: NativeBlock): NativeItem {
  if (block.type === "flashcards")
    return { id: createNativeId("card"), front: "", back: "" };

  if (block.type === "matching")
    return { id: createNativeId("pair"), left: "", right: "" };

  if (block.type === "sequence")
    return { id: createNativeId("step"), title: "" };

  return { id: createNativeId("item"), title: "", content: "" };
}

function FeedbackFields({
  block,
  disabled,
  onChange,
}: {
  block: NativeBlock;
  disabled?: boolean;
  onChange: (block: NativeBlock) => void;
}) {
  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          value={block.feedbackCorrect ?? ""}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...block, feedbackCorrect: event.target.value })
          }
          placeholder="Feedback when correct"
        />
        <Input
          value={block.feedbackIncorrect ?? ""}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...block, feedbackIncorrect: event.target.value })
          }
          placeholder="Feedback when incorrect"
        />
      </div>
      <textarea
        className={areaClass}
        value={block.explanation ?? ""}
        disabled={disabled}
        onChange={(event) =>
          onChange({ ...block, explanation: event.target.value })
        }
        placeholder="Explanation shown after answering"
      />
      <Input
        value={block.hint ?? ""}
        disabled={disabled}
        onChange={(event) => onChange({ ...block, hint: event.target.value })}
        placeholder="Optional hint"
      />
    </>
  );
}

export function NativeInteractiveBuilder({
  value,
  onChange,
  disabled,
}: {
  value?: NativeDefinition;
  onChange: (value: NativeDefinition) => void;
  disabled?: boolean;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const definition: NativeDefinition = {
    version: 2,
    completionMode: "all",
    passScore: 70,
    showCelebration: true,
    presentationMode: "journey",
    motionIntensity: "playful",
    showProgress: true,
    showPoints: true,
    showStreak: true,
    ...value,
    blocks: value?.blocks ?? [],
  };
  const blocks = definition.blocks;
  const changeDefinition = (changes: Partial<NativeDefinition>) =>
    onChange({ ...definition, ...changes });
  const update = (index: number, block: NativeBlock) =>
    changeDefinition({
      blocks: blocks.map((current, i) => (i === index ? block : current)),
    });
  const updateItem = (
    blockIndex: number,
    itemIndex: number,
    changes: Partial<NativeItem>
  ) => {
    const block = blocks[blockIndex];

    update(blockIndex, {
      ...block,
      items: (block.items ?? []).map((item, i) =>
        i === itemIndex ? { ...item, ...changes } : item
      ),
    });
  };
  const move = (index: number, target: number) => {
    const next = [...blocks];

    [next[index], next[target]] = [next[target], next[index]];
    changeDefinition({ blocks: next });
  };

  return (
    <div className="space-y-5">
      <section className="bg-muted/30 space-y-4 rounded-xl border p-4">
        <div>
          <h3 className="font-semibold">Learning design</h3>
          <p className="text-muted-foreground text-xs">
            Start with the outcome, then use short activities to practise it.
          </p>
        </div>
        <textarea
          className={areaClass}
          value={definition.learningObjective ?? ""}
          disabled={disabled}
          onChange={(event) =>
            changeDefinition({ learningObjective: event.target.value })
          }
          placeholder="Learning objective — e.g. By the end, learners can identify the three parts of an xAPI statement."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium">Completion rule</span>
            <select
              className="border-input bg-background h-10 w-full rounded-md border px-3"
              value={definition.completionMode ?? "all"}
              disabled={disabled}
              onChange={(event) =>
                changeDefinition({
                  completionMode: event.target.value as "all" | "score",
                })
              }
            >
              <option value="all">Complete every required activity</option>
              <option value="score">Reach the passing score</option>
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Passing score (%)</span>
            <Input
              type="number"
              min={1}
              max={100}
              value={definition.passScore ?? 70}
              disabled={disabled || definition.completionMode !== "score"}
              onChange={(event) =>
                changeDefinition({ passScore: Number(event.target.value) })
              }
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium">Learner experience</span>
            <select
              className="border-input bg-background h-10 w-full rounded-md border px-3"
              value={definition.presentationMode ?? "journey"}
              disabled={disabled}
              onChange={(event) =>
                changeDefinition({
                  presentationMode: event.target.value as "journey" | "scroll",
                })
              }
            >
              <option value="journey">
                Challenge journey — one activity at a time
              </option>
              <option value="scroll">
                Learning page — show every activity
              </option>
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium">Motion style</span>
            <select
              className="border-input bg-background h-10 w-full rounded-md border px-3"
              value={definition.motionIntensity ?? "playful"}
              disabled={disabled}
              onChange={(event) =>
                changeDefinition({
                  motionIntensity: event.target.value as
                    | "calm"
                    | "playful"
                    | "energetic",
                })
              }
            >
              <option value="calm">Calm — subtle fades and movement</option>
              <option value="playful">
                Playful — balanced game-like motion
              </option>
              <option value="energetic">
                Energetic — stronger movement and celebration
              </option>
            </select>
          </label>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              ["showProgress", "Show lesson progress"],
              ["showPoints", "Show experience points"],
              ["showStreak", "Show answer streak"],
            ] as const
          ).map(([field, label]) => (
            <label key={field} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={definition[field] !== false}
                disabled={disabled}
                onChange={(event) =>
                  changeDefinition({ [field]: event.target.checked })
                }
              />
              {label}
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={definition.showCelebration !== false}
            disabled={disabled}
            onChange={(event) =>
              changeDefinition({ showCelebration: event.target.checked })
            }
          />
          Celebrate mastery when the lesson is completed
        </label>
      </section>

      <div>
        <h3 className="font-semibold">Activity path</h3>
        <p className="text-muted-foreground text-xs">
          Mix explanation, retrieval practice, decisions, and application.
        </p>
      </div>
      {blocks.map((block, index) => (
        <section
          key={block.id ?? index}
          className="space-y-4 rounded-xl border p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-primary/10 text-primary grid size-7 place-items-center rounded-full text-xs font-bold">
              {index + 1}
            </span>
            <select
              className="border-input bg-background h-9 rounded-md border px-2 text-sm"
              value={block.type}
              disabled={disabled}
              onChange={(event) =>
                update(index, starter(event.target.value as NativeBlockType))
              }
            >
              {blockTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <Input
              className="min-w-48 flex-1"
              value={block.title}
              disabled={disabled}
              onChange={(event) =>
                update(index, { ...block, title: event.target.value })
              }
              placeholder="Activity title"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled || index === 0}
              onClick={() => move(index, index - 1)}
              aria-label="Move activity up"
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled || index === blocks.length - 1}
              onClick={() => move(index, index + 1)}
              aria-label="Move activity down"
            >
              <ArrowDown className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              onClick={() =>
                changeDefinition({
                  blocks: [
                    ...blocks.slice(0, index + 1),
                    {
                      ...block,
                      id: createNativeId(block.type),
                      title: `${block.title} (copy)`,
                    },
                    ...blocks.slice(index + 1),
                  ],
                })
              }
              aria-label="Duplicate activity"
            >
              <Copy className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled || blocks.length === 1}
              onClick={() =>
                changeDefinition({
                  blocks: blocks.filter((_, i) => i !== index),
                })
              }
              aria-label="Delete activity"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_110px]">
            <Input
              value={block.instructions ?? ""}
              disabled={disabled}
              onChange={(event) =>
                update(index, { ...block, instructions: event.target.value })
              }
              placeholder="Learner instruction (optional)"
            />
            <Input
              type="number"
              min={0}
              max={1000}
              value={block.points ?? 10}
              disabled={disabled}
              onChange={(event) =>
                update(index, { ...block, points: Number(event.target.value) })
              }
              aria-label="Points"
              title="Points"
            />
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={block.required !== false}
              disabled={disabled}
              onChange={(event) =>
                update(index, { ...block, required: event.target.checked })
              }
            />
            Required for completion
          </label>

          {block.type === "callout" && (
            <textarea
              className={areaClass}
              value={block.content ?? ""}
              disabled={disabled}
              onChange={(event) =>
                update(index, { ...block, content: event.target.value })
              }
              placeholder="Key message"
            />
          )}

          {(block.type === "multiple_choice" ||
            block.type === "true_false") && (
            <div className="space-y-3">
              <Input
                value={
                  block.type === "true_false"
                    ? (block.statement ?? "")
                    : (block.question ?? "")
                }
                disabled={disabled}
                onChange={(event) =>
                  update(index, {
                    ...block,
                    [block.type === "true_false" ? "statement" : "question"]:
                      event.target.value,
                  })
                }
                placeholder={
                  block.type === "true_false" ? "Statement" : "Question"
                }
              />
              {block.type === "multiple_choice" ? (
                <div className="space-y-2">
                  {(block.options ?? []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${block.id ?? index}`}
                        checked={(block.correctIndex ?? 0) === optionIndex}
                        onChange={() =>
                          update(index, { ...block, correctIndex: optionIndex })
                        }
                        aria-label={`Mark option ${optionIndex + 1} correct`}
                      />
                      <Input
                        value={option}
                        disabled={disabled}
                        onChange={(event) =>
                          update(index, {
                            ...block,
                            options: (block.options ?? []).map((current, i) =>
                              i === optionIndex ? event.target.value : current
                            ),
                          })
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={disabled || (block.options?.length ?? 0) <= 2}
                        onClick={() =>
                          update(index, {
                            ...block,
                            options: (block.options ?? []).filter(
                              (_, i) => i !== optionIndex
                            ),
                            correctIndex: 0,
                          })
                        }
                        aria-label={`Remove option ${optionIndex + 1}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    onClick={() =>
                      update(index, {
                        ...block,
                        options: [...(block.options ?? []), ""],
                      })
                    }
                  >
                    <Plus className="mr-1 size-3" /> Add option
                  </Button>
                </div>
              ) : (
                <label className="block space-y-1 text-sm">
                  <span className="font-medium">Correct answer</span>
                  <select
                    className="border-input bg-background h-10 w-full rounded-md border px-3"
                    value={String(block.correctAnswer ?? true)}
                    disabled={disabled}
                    onChange={(event) =>
                      update(index, {
                        ...block,
                        correctAnswer: event.target.value === "true",
                      })
                    }
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </label>
              )}
              <FeedbackFields
                block={block}
                disabled={disabled}
                onChange={(next) => update(index, next)}
              />
            </div>
          )}

          {block.type === "scenario" && (
            <div className="space-y-3">
              <textarea
                className={areaClass}
                value={block.content ?? ""}
                disabled={disabled}
                onChange={(event) =>
                  update(index, { ...block, content: event.target.value })
                }
                placeholder="Describe the situation and decision."
              />
              {(block.choices ?? []).map((choice, choiceIndex) => (
                <div
                  key={choice.id ?? choiceIndex}
                  className="bg-muted/40 grid gap-2 rounded-lg p-3 sm:grid-cols-[24px_1fr_1fr_auto]"
                >
                  <input
                    type="radio"
                    name={`scenario-${block.id ?? index}`}
                    checked={choice.correct === true}
                    onChange={() =>
                      update(index, {
                        ...block,
                        choices: (block.choices ?? []).map((item, i) => ({
                          ...item,
                          correct: i === choiceIndex,
                        })),
                      })
                    }
                    aria-label={`Mark choice ${choiceIndex + 1} best`}
                  />
                  <Input
                    value={choice.text}
                    disabled={disabled}
                    onChange={(event) =>
                      update(index, {
                        ...block,
                        choices: (block.choices ?? []).map((item, i) =>
                          i === choiceIndex
                            ? { ...item, text: event.target.value }
                            : item
                        ),
                      })
                    }
                    placeholder="Decision"
                  />
                  <Input
                    value={choice.feedback}
                    disabled={disabled}
                    onChange={(event) =>
                      update(index, {
                        ...block,
                        choices: (block.choices ?? []).map((item, i) =>
                          i === choiceIndex
                            ? { ...item, feedback: event.target.value }
                            : item
                        ),
                      })
                    }
                    placeholder="Consequence / coaching feedback"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled || (block.choices?.length ?? 0) <= 2}
                    onClick={() =>
                      update(index, {
                        ...block,
                        choices: (block.choices ?? []).filter(
                          (_, i) => i !== choiceIndex
                        ),
                      })
                    }
                    aria-label={`Remove choice ${choiceIndex + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() =>
                  update(index, {
                    ...block,
                    choices: [
                      ...(block.choices ?? []),
                      {
                        id: createNativeId("choice"),
                        text: "",
                        feedback: "",
                        correct: false,
                      },
                    ],
                  })
                }
              >
                <Plus className="mr-1 size-3" /> Add decision
              </Button>
            </div>
          )}

          {["accordion", "tabs", "flashcards", "matching", "sequence"].includes(
            block.type
          ) && (
            <div className="space-y-2">
              {(block.items ?? []).map((item, itemIndex) => (
                <div
                  key={item.id ?? itemIndex}
                  className="bg-muted/40 grid gap-2 rounded-lg p-3 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <Input
                    value={
                      block.type === "flashcards"
                        ? (item.front ?? "")
                        : block.type === "matching"
                          ? (item.left ?? "")
                          : (item.title ?? "")
                    }
                    disabled={disabled}
                    onChange={(event) =>
                      updateItem(index, itemIndex, {
                        [block.type === "flashcards"
                          ? "front"
                          : block.type === "matching"
                            ? "left"
                            : "title"]: event.target.value,
                      })
                    }
                    placeholder={
                      block.type === "flashcards"
                        ? "Front / prompt"
                        : block.type === "matching"
                          ? "Left item"
                          : block.type === "sequence"
                            ? `Step ${itemIndex + 1}`
                            : "Label"
                    }
                  />
                  {block.type !== "sequence" && (
                    <textarea
                      className="border-input bg-background min-h-10 rounded-md border px-3 py-2 text-sm"
                      value={
                        block.type === "flashcards"
                          ? (item.back ?? "")
                          : block.type === "matching"
                            ? (item.right ?? "")
                            : (item.content ?? "")
                      }
                      disabled={disabled}
                      onChange={(event) =>
                        updateItem(index, itemIndex, {
                          [block.type === "flashcards"
                            ? "back"
                            : block.type === "matching"
                              ? "right"
                              : "content"]: event.target.value,
                        })
                      }
                      placeholder={
                        block.type === "flashcards"
                          ? "Back / answer"
                          : block.type === "matching"
                            ? "Matching item"
                            : "Content"
                      }
                    />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled || (block.items?.length ?? 0) <= 1}
                    onClick={() =>
                      update(index, {
                        ...block,
                        items: (block.items ?? []).filter(
                          (_, i) => i !== itemIndex
                        ),
                      })
                    }
                    aria-label={`Remove item ${itemIndex + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() =>
                  update(index, {
                    ...block,
                    items: [...(block.items ?? []), itemFor(block)],
                  })
                }
              >
                <Plus className="mr-1 size-3" /> Add item
              </Button>
            </div>
          )}
        </section>
      ))}

      <section className="space-y-3 rounded-xl border border-dashed p-4">
        <div>
          <h3 className="font-semibold">Add an activity</h3>
          <p className="text-muted-foreground text-xs">
            Choose the interaction that best practises the learning objective.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {blockTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              disabled={disabled}
              className="hover:border-primary hover:bg-primary/5 rounded-lg border p-3 text-left transition disabled:opacity-50"
              onClick={() =>
                changeDefinition({ blocks: [...blocks, starter(type.value)] })
              }
            >
              <span className="block text-sm font-semibold">{type.label}</span>
              <span className="text-muted-foreground text-xs">
                {type.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Learner preview</h3>
            <p className="text-muted-foreground text-xs">
              Test the motion, feedback, scoring, and completion flow before
              publishing.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={disabled || blocks.length === 0}
            onClick={() => setShowPreview((current) => !current)}
          >
            <Eye className="mr-2 size-4" />
            {showPreview ? "Close preview" : "Preview lesson"}
          </Button>
        </div>
        {showPreview && (
          <div className="bg-background mt-4 rounded-xl border p-4">
            <NativeLearningPlayer
              key={JSON.stringify(definition)}
              definition={definition}
            />
          </div>
        )}
      </section>
    </div>
  );
}
