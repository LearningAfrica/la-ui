import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ArrowDown from "~icons/lucide/arrow-down";
import ArrowUp from "~icons/lucide/arrow-up";
import Check from "~icons/lucide/check";
import CheckCircle2 from "~icons/lucide/check-circle-2";
import ChevronDown from "~icons/lucide/chevron-down";
import ChevronLeft from "~icons/lucide/chevron-left";
import ChevronRight from "~icons/lucide/chevron-right";
import Flame from "~icons/lucide/flame";
import HelpCircle from "~icons/lucide/help-circle";
import Lightbulb from "~icons/lucide/lightbulb";
import RotateCcw from "~icons/lucide/rotate-ccw";
import Sparkles from "~icons/lucide/sparkles";
import Star from "~icons/lucide/star";
import X from "~icons/lucide/x";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  blockKey,
  blockPoints,
  type NativeBlock,
  type NativeDefinition,
} from "./native-interactive-types";

export type NativeInteraction = {
  verb: "interacted" | "answered" | "completed";
  block: NativeBlock;
  success?: boolean;
  response?: string;
  score?: { raw: number; max: number; scaled: number };
};

type ActivityProps = {
  block: NativeBlock;
  onComplete: (success?: boolean, response?: string) => void;
  onInteract: (success?: boolean, response?: string) => void;
};

const spring = { type: "spring" as const, stiffness: 360, damping: 28 };

function ActivityShell({
  block,
  children,
}: {
  block: NativeBlock;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card text-card-foreground overflow-hidden rounded-2xl border shadow-sm">
      <div className="border-b px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold">{block.title}</h2>
            {block.instructions && (
              <p className="text-muted-foreground mt-1 text-sm">
                {block.instructions}
              </p>
            )}
          </div>
          {block.points !== 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
              <Star className="size-3" />
              {blockPoints(block)} XP
            </span>
          )}
        </div>
      </div>
      <div className="text-card-foreground p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Feedback({
  success,
  message,
  explanation,
  onRetry,
}: {
  success: boolean;
  message?: string;
  explanation?: string;
  onRetry?: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      role="status"
      aria-live="polite"
      className={cn(
        "mt-4 rounded-xl border p-4",
        success
          ? "border-emerald-300 bg-emerald-50 text-emerald-950"
          : "border-orange-300 bg-orange-50 text-orange-950"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full",
            success ? "bg-emerald-600 text-white" : "bg-orange-500 text-white"
          )}
        >
          {success ? <Check className="size-5" /> : <X className="size-5" />}
        </span>
        <div className="flex-1">
          <p className="font-bold">
            {message || (success ? "Correct!" : "Not quite yet")}
          </p>
          {explanation && <p className="mt-1 text-sm">{explanation}</p>}
          {!success && onRetry && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-3 bg-white"
              onClick={onRetry}
            >
              <RotateCcw className="mr-1 size-4" /> Try again
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function InvalidActivity({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-orange-300 bg-orange-50 p-4 text-sm font-medium text-orange-950"
    >
      {message} Ask the instructor to review and republish this lesson.
    </div>
  );
}

function CalloutActivity({ block, onComplete }: ActivityProps) {
  const [done, setDone] = useState(false);

  return (
    <ActivityShell block={block}>
      <div className="from-primary/10 to-primary/5 border-primary/30 text-card-foreground rounded-xl border-l-4 bg-gradient-to-r p-5 text-base whitespace-pre-wrap">
        {block.content}
      </div>
      <Button
        type="button"
        className="mt-4"
        variant={done ? "outline" : "default"}
        onClick={() => {
          setDone(true);
          onComplete(true, "acknowledged");
        }}
      >
        {done ? (
          <>
            <Check className="mr-2 size-4" />
            Understood
          </>
        ) : (
          "Got it"
        )}
      </Button>
    </ActivityShell>
  );
}

function AccordionActivity({ block, onComplete, onInteract }: ActivityProps) {
  const [open, setOpen] = useState<number[]>([]);
  const reduceMotion = useReducedMotion();
  const toggle = (index: number) => {
    const next = open.includes(index)
      ? open.filter((item) => item !== index)
      : [...open, index];

    setOpen(next);
    onInteract(undefined, String(index));

    if ((block.items ?? []).every((_, itemIndex) => next.includes(itemIndex)))
      onComplete(true, "explored-all");
  };

  return (
    <ActivityShell block={block}>
      <div className="space-y-2">
        {(block.items ?? []).map((item, index) => {
          const expanded = open.includes(index);

          return (
            <div
              key={item.id ?? index}
              className="overflow-hidden rounded-xl border"
            >
              <button
                type="button"
                className="hover:bg-muted/50 flex w-full items-center justify-between p-4 text-left font-semibold"
                aria-expanded={expanded}
                onClick={() => toggle(index)}
              >
                <span>{item.title}</span>
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : spring}
                >
                  <ChevronDown className="size-5" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground border-t px-4 py-4 text-sm whitespace-pre-wrap">
                      {item.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </ActivityShell>
  );
}

function TabsActivity({ block, onComplete, onInteract }: ActivityProps) {
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState(() => new Set([0]));
  const reduceMotion = useReducedMotion();
  const select = (index: number) => {
    const next = new Set(visited).add(index);

    setVisited(next);
    setActive(index);
    onInteract(undefined, String(index));

    if (next.size === (block.items?.length ?? 0))
      onComplete(true, "explored-all");
  };
  const item = block.items?.[active];

  return (
    <ActivityShell block={block}>
      <div
        role="tablist"
        aria-label={block.title}
        className="flex gap-1 overflow-x-auto border-b"
      >
        {(block.items ?? []).map((tab, index) => (
          <button
            key={tab.id ?? index}
            type="button"
            role="tab"
            aria-selected={active === index}
            className={cn(
              "relative shrink-0 px-4 py-3 text-sm font-semibold",
              active === index
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => select(index)}
          >
            {tab.title}
            {active === index && (
              <motion.span
                layoutId={`tab-${block.id ?? block.title}`}
                className="bg-primary absolute inset-x-0 bottom-0 h-0.5"
                transition={reduceMotion ? { duration: 0 } : spring}
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={reduceMotion ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-28 py-5 text-sm whitespace-pre-wrap"
        >
          <h3 className="mb-2 font-bold">{item?.title}</h3>
          <p className="text-muted-foreground">{item?.content}</p>
        </motion.div>
      </AnimatePresence>
      <p className="text-muted-foreground text-xs">
        Explored {visited.size} of {block.items?.length ?? 0}
      </p>
    </ActivityShell>
  );
}

function FlashcardsActivity({ block, onComplete, onInteract }: ActivityProps) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [mastered, setMastered] = useState(() => new Set<number>());
  const reduceMotion = useReducedMotion();
  const total = block.items?.length ?? 0;
  const mark = (index: number) => {
    const next = new Set(mastered).add(index);

    setMastered(next);
    onInteract(true, `mastered:${index}`);

    if (next.size === total) onComplete(true, "mastered-all");
  };

  return (
    <ActivityShell block={block}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(block.items ?? []).map((item, index) => {
          const isFlipped = !!flipped[index];

          return (
            <div key={item.id ?? index} style={{ perspective: 1000 }}>
              <motion.button
                type="button"
                className="relative h-44 w-full rounded-xl text-center"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.55,
                        type: "spring",
                        stiffness: 180,
                        damping: 20,
                      }
                }
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => {
                  setFlipped((state) => ({ ...state, [index]: !state[index] }));
                  onInteract(undefined, `flip:${index}`);
                }}
                aria-label={`${isFlipped ? "Show front of" : "Reveal answer for"} card ${index + 1}`}
              >
                <span className="from-primary/10 to-card text-card-foreground absolute inset-0 grid place-items-center rounded-xl border bg-gradient-to-br p-5 shadow-sm [backface-visibility:hidden]">
                  <span>
                    <span className="text-muted-foreground mb-2 block text-xs font-bold tracking-wide uppercase">
                      Prompt
                    </span>
                    <span className="font-semibold">{item.front}</span>
                  </span>
                </span>
                <span className="absolute inset-0 grid [transform:rotateY(180deg)] place-items-center rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 shadow-sm [backface-visibility:hidden]">
                  <span>
                    <span className="mb-2 block text-xs font-bold tracking-wide text-emerald-700 uppercase">
                      Answer
                    </span>
                    <span className="font-semibold">{item.back}</span>
                  </span>
                </span>
              </motion.button>
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex gap-2"
                  >
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        setFlipped((state) => ({ ...state, [index]: false }))
                      }
                    >
                      Review again
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="flex-1"
                      disabled={mastered.has(index)}
                      onClick={() => mark(index)}
                    >
                      {mastered.has(index) ? (
                        <Check className="mr-1 size-4" />
                      ) : null}
                      {mastered.has(index) ? "Mastered" : "I knew it"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <p className="text-muted-foreground mt-4 text-center text-sm">
        {mastered.size} of {total} cards mastered
      </p>
    </ActivityShell>
  );
}

function QuizActivity({ block, onComplete, onInteract }: ActivityProps) {
  const [selected, setSelected] = useState<number>();
  const [showHint, setShowHint] = useState(false);
  const options =
    block.type === "true_false" ? ["True", "False"] : (block.options ?? []);
  const correctIndex =
    block.type === "true_false"
      ? block.correctAnswer === false
        ? 1
        : 0
      : (block.correctIndex ?? 0);
  const correct = selected === correctIndex;
  const answer = (index: number) => {
    setSelected(index);

    const success = index === correctIndex;

    onInteract(success, options[index]);

    if (success) onComplete(true, options[index]);
  };

  return (
    <ActivityShell block={block}>
      <p className="mb-4 text-lg font-semibold">
        {block.type === "true_false" ? block.statement : block.question}
      </p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <motion.button
            whileTap={{ scale: 0.985 }}
            key={index}
            type="button"
            disabled={selected !== undefined}
            className={cn(
              "bg-card text-card-foreground flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left font-medium transition",
              selected === index &&
                correct &&
                "border-emerald-500 bg-emerald-50 text-emerald-950",
              selected === index &&
                !correct &&
                "border-orange-400 bg-orange-50 text-orange-950",
              selected === undefined &&
                "hover:border-primary/60 hover:bg-primary/5"
            )}
            onClick={() => answer(index)}
          >
            <span className="bg-muted grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="flex-1">{option}</span>
            {selected === index &&
              (correct ? (
                <CheckCircle2 className="size-5 text-emerald-600" />
              ) : (
                <X className="size-5 text-orange-600" />
              ))}
          </motion.button>
        ))}
      </div>
      {block.hint && selected === undefined && (
        <div className="mt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowHint((value) => !value)}
          >
            <HelpCircle className="mr-1 size-4" />
            {showHint ? "Hide hint" : "Need a hint?"}
          </Button>
          {showHint && (
            <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
              <Lightbulb className="mr-1 inline size-4" />
              {block.hint}
            </p>
          )}
        </div>
      )}
      {selected !== undefined && (
        <Feedback
          success={correct}
          message={correct ? block.feedbackCorrect : block.feedbackIncorrect}
          explanation={block.explanation}
          onRetry={correct ? undefined : () => setSelected(undefined)}
        />
      )}
    </ActivityShell>
  );
}

function MatchingActivity({ block, onComplete, onInteract }: ActivityProps) {
  const pairs = useMemo(() => block.items ?? [], [block.items]);
  const rightOrder = useMemo(
    () => pairs.map((_, index) => index).reverse(),
    [pairs]
  );
  const [left, setLeft] = useState<number>();
  const [matched, setMatched] = useState(() => new Set<number>());
  const [wrong, setWrong] = useState<number>();
  const chooseRight = (right: number) => {
    if (left === undefined) return;

    const success = left === right;

    onInteract(success, `${left}:${right}`);

    if (success) {
      const next = new Set(matched).add(left);

      setMatched(next);
      setLeft(undefined);
      setWrong(undefined);

      if (next.size === pairs.length) onComplete(true, "matched-all");
    } else {
      setWrong(right);
      setTimeout(() => setWrong(undefined), 450);
    }
  };

  return (
    <ActivityShell block={block}>
      {pairs.length < 2 ? (
        <InvalidActivity message="This matching activity needs at least two complete pairs." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div className="space-y-2">
            {pairs.map((item, index) => (
              <motion.button
                layout
                key={item.id ?? index}
                type="button"
                disabled={matched.has(index)}
                className={cn(
                  "bg-card text-card-foreground min-h-14 w-full rounded-xl border-2 p-3 text-sm font-semibold transition-colors",
                  matched.has(index) &&
                    "border-emerald-300 bg-emerald-50 text-emerald-950 opacity-70",
                  left === index &&
                    "border-primary bg-primary/10 text-card-foreground",
                  !matched.has(index) &&
                    left !== index &&
                    "hover:border-primary/50"
                )}
                onClick={() => setLeft(index)}
              >
                {item.left}
                {matched.has(index) && (
                  <Check className="ml-2 inline size-4 text-emerald-600" />
                )}
              </motion.button>
            ))}
          </div>
          <div className="space-y-2">
            {rightOrder.map((pairIndex) => (
              <motion.button
                animate={
                  wrong === pairIndex ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }
                }
                key={pairs[pairIndex]?.id ?? pairIndex}
                type="button"
                disabled={matched.has(pairIndex) || left === undefined}
                className={cn(
                  "bg-card text-card-foreground min-h-14 w-full rounded-xl border-2 p-3 text-sm font-semibold transition-colors disabled:opacity-60",
                  matched.has(pairIndex) &&
                    "border-emerald-300 bg-emerald-50 text-emerald-950 opacity-70",
                  !matched.has(pairIndex) &&
                    left !== undefined &&
                    "hover:border-primary/50"
                )}
                onClick={() => chooseRight(pairIndex)}
              >
                {pairs[pairIndex]?.right}
                {matched.has(pairIndex) && (
                  <Check className="ml-2 inline size-4 text-emerald-600" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
      <p className="text-muted-foreground mt-4 text-center text-sm">
        {matched.size} of {pairs.length} pairs matched
      </p>
    </ActivityShell>
  );
}

function SequenceActivity({ block, onComplete, onInteract }: ActivityProps) {
  const items = useMemo(() => block.items ?? [], [block.items]);
  const initial = useMemo(
    () => items.map((_, index) => index).reverse(),
    [items]
  );
  const [order, setOrder] = useState(initial);
  const [result, setResult] = useState<boolean>();
  const move = (index: number, offset: number) => {
    const target = index + offset;

    if (target < 0 || target >= order.length) return;

    const next = [...order];

    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setResult(undefined);
    onInteract(undefined, next.join(","));
  };
  const check = () => {
    const success = order.every((value, index) => value === index);

    setResult(success);
    onInteract(success, order.join(","));

    if (success) onComplete(true, order.join(","));
  };

  return (
    <ActivityShell block={block}>
      {items.length < 2 ? (
        <InvalidActivity message="This sequence activity needs at least two steps." />
      ) : (
        <div className="space-y-2">
          {order.map((itemIndex, index) => (
            <motion.div
              layout
              transition={spring}
              key={items[itemIndex]?.id ?? itemIndex}
              className="bg-muted/40 text-card-foreground flex items-center gap-3 rounded-xl border p-3"
            >
              <span className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-full text-xs font-bold">
                {index + 1}
              </span>
              <span className="flex-1 font-medium">
                {items[itemIndex]?.title}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                aria-label={`Move ${items[itemIndex]?.title} up`}
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === order.length - 1}
                onClick={() => move(index, 1)}
                aria-label={`Move ${items[itemIndex]?.title} down`}
              >
                <ArrowDown className="size-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
      {items.length >= 2 && (
        <Button type="button" className="mt-4" onClick={check}>
          Check order
        </Button>
      )}
      {result !== undefined && (
        <Feedback
          success={result}
          message={result ? block.feedbackCorrect : block.feedbackIncorrect}
          explanation={block.explanation}
        />
      )}
    </ActivityShell>
  );
}

function ScenarioActivity({ block, onComplete, onInteract }: ActivityProps) {
  const [selected, setSelected] = useState<number>();
  const choice = selected === undefined ? undefined : block.choices?.[selected];
  const choose = (index: number) => {
    setSelected(index);

    const current = block.choices?.[index];

    onInteract(current?.correct, current?.text);

    if (current?.correct) onComplete(true, current.text);
  };

  return (
    <ActivityShell block={block}>
      <div className="mb-5 rounded-xl border border-sky-200 bg-sky-50 p-5 whitespace-pre-wrap text-sky-950">
        {block.content}
      </div>
      {(block.choices?.length ?? 0) < 2 ? (
        <InvalidActivity message="This decision scenario needs at least two choices." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {(block.choices ?? []).map((item, index) => (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
              key={item.id ?? index}
              type="button"
              disabled={selected !== undefined}
              className={cn(
                "bg-card text-card-foreground rounded-xl border-2 p-4 text-left font-semibold shadow-sm transition-colors",
                selected === index &&
                  item.correct &&
                  "border-emerald-500 bg-emerald-50 text-emerald-950",
                selected === index &&
                  !item.correct &&
                  "border-orange-400 bg-orange-50 text-orange-950",
                selected === undefined && "hover:border-primary/60"
              )}
              onClick={() => choose(index)}
            >
              {item.text}
            </motion.button>
          ))}
        </div>
      )}
      {choice && (
        <Feedback
          success={choice.correct === true}
          message={
            choice.correct ? "Strong decision" : "Consider the consequence"
          }
          explanation={choice.feedback}
          onRetry={choice.correct ? undefined : () => setSelected(undefined)}
        />
      )}
    </ActivityShell>
  );
}

function Celebration({ score }: { score: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="from-primary/15 relative overflow-hidden rounded-2xl border bg-gradient-to-br via-amber-50 to-emerald-50 p-8 text-center"
    >
      <Sparkles className="mx-auto size-10 text-amber-500" />
      <h2 className="font-display mt-3 text-2xl font-bold">Lesson mastered!</h2>
      <p className="text-muted-foreground mt-1">
        You completed the learning path with {score}% mastery.
      </p>
      {!reduceMotion &&
        [...Array(10)].map((_, index) => (
          <motion.span
            key={index}
            className="absolute size-2 rounded-full bg-amber-400"
            initial={{ x: "50%", y: 70, opacity: 1 }}
            animate={{
              x: `${8 + index * 9}%`,
              y: -80 - (index % 3) * 25,
              opacity: 0,
              rotate: 180,
            }}
            transition={{ duration: 1.1, delay: index * 0.04 }}
          />
        ))}
    </motion.div>
  );
}

export function NativeLearningPlayer({
  definition,
  onInteraction,
  onCompleted,
}: {
  definition: NativeDefinition;
  onInteraction?: (interaction: NativeInteraction) => void;
  onCompleted?: () => void;
}) {
  const blocks = definition.blocks ?? [];
  const [completed, setCompleted] = useState(() => new Set<string>());
  const [earned, setEarned] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const reportedComplete = useRef(false);
  const totalPoints = blocks.reduce(
    (sum, block) => sum + blockPoints(block),
    0
  );
  const earnedPoints = Object.values(earned).reduce(
    (sum, points) => sum + points,
    0
  );
  const score = totalPoints
    ? Math.round((earnedPoints / totalPoints) * 100)
    : 100;
  const required = blocks
    .map((block, index) => ({ block, key: blockKey(block, index) }))
    .filter(({ block }) => block.required !== false);
  const progress = required.length
    ? Math.round(
        (required.filter(({ key }) => completed.has(key)).length /
          required.length) *
          100
      )
    : 100;
  const isComplete =
    definition.completionMode === "score"
      ? score >= (definition.passScore ?? 70)
      : required.every(({ key }) => completed.has(key));
  const journey = (definition.presentationMode ?? "journey") === "journey";
  const activeBlock = blocks[activeIndex];
  const activeKey = activeBlock
    ? blockKey(activeBlock, activeIndex)
    : undefined;
  const activeComplete = activeKey ? completed.has(activeKey) : false;
  const motionDistance =
    definition.motionIntensity === "calm"
      ? 8
      : definition.motionIntensity === "energetic"
        ? 42
        : 24;
  const motionDuration =
    definition.motionIntensity === "calm"
      ? 0.2
      : definition.motionIntensity === "energetic"
        ? 0.42
        : 0.3;

  useEffect(() => {
    if (isComplete && !reportedComplete.current) {
      reportedComplete.current = true;
      onCompleted?.();
    }
  }, [isComplete, onCompleted]);

  const complete = (
    block: NativeBlock,
    index: number,
    success = true,
    response?: string
  ) => {
    const key = blockKey(block, index);

    setCompleted((current) => new Set(current).add(key));
    setEarned((current) => ({
      ...current,
      [key]: success ? blockPoints(block) : (current[key] ?? 0),
    }));
    onInteraction?.({
      verb: "completed",
      block,
      success,
      response,
      score: {
        raw: success ? blockPoints(block) : 0,
        max: blockPoints(block),
        scaled: success ? 1 : 0,
      },
    });
  };

  const interact = (
    block: NativeBlock,
    success?: boolean,
    response?: string
  ) => {
    if (success === true) setStreak((current) => current + 1);
    else if (success === false) setStreak(0);

    onInteraction?.({
      verb: success === undefined ? "interacted" : "answered",
      block,
      success,
      response,
    });
  };

  const render = (block: NativeBlock, index: number) => {
    const props: ActivityProps = {
      block,
      onComplete: (success, response) =>
        complete(block, index, success, response),
      onInteract: (success, response) => interact(block, success, response),
    };

    if (block.type === "callout") return <CalloutActivity {...props} />;

    if (block.type === "accordion") return <AccordionActivity {...props} />;

    if (block.type === "tabs") return <TabsActivity {...props} />;

    if (block.type === "flashcards") return <FlashcardsActivity {...props} />;

    if (block.type === "multiple_choice" || block.type === "true_false")
      return <QuizActivity {...props} />;

    if (block.type === "matching") return <MatchingActivity {...props} />;

    if (block.type === "sequence") return <SequenceActivity {...props} />;

    if (block.type === "scenario") return <ScenarioActivity {...props} />;

    return (
      <ActivityShell block={block}>
        <InvalidActivity
          message={`The activity type “${String(block.type)}” is not supported by this learner player.`}
        />
      </ActivityShell>
    );
  };

  const navigate = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= blocks.length) return;

    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  return (
    <div className="space-y-5">
      <header className="bg-card text-card-foreground sticky top-0 z-10 rounded-2xl border p-4 shadow-sm">
        {definition.learningObjective && (
          <div className="mb-3">
            <span className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
              Your mission
            </span>
            <p className="mt-0.5 text-sm font-medium">
              {definition.learningObjective}
            </p>
          </div>
        )}
        <div className="flex items-center gap-3">
          {definition.showProgress !== false && (
            <>
              <div
                className="bg-muted h-3 flex-1 overflow-hidden rounded-full"
                role="progressbar"
                aria-label="Lesson progress"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  className="from-primary h-full rounded-full bg-gradient-to-r to-emerald-500"
                  animate={{ width: `${progress}%` }}
                  transition={reduceMotion ? { duration: 0 } : spring}
                />
              </div>
              <span className="w-10 text-right text-sm font-bold">
                {progress}%
              </span>
            </>
          )}
          {definition.showStreak !== false && (
            <motion.span
              key={`streak-${streak}`}
              initial={
                reduceMotion || streak === 0
                  ? false
                  : { scale: 0.7, rotate: -8 }
              }
              animate={{ scale: 1, rotate: 0 }}
              className="inline-flex items-center gap-1 text-sm font-bold text-orange-600"
              title="Correct-answer streak"
            >
              <Flame className="size-4" />
              {streak}
            </motion.span>
          )}
          {definition.showPoints !== false && (
            <span
              className="inline-flex items-center gap-1 text-sm font-bold text-amber-700"
              title="Experience points"
            >
              <Star className="size-4" />
              {earnedPoints}
            </span>
          )}
        </div>
      </header>
      {blocks.length === 0 && (
        <InvalidActivity message="This interactive lesson has no activities." />
      )}
      {journey && activeBlock ? (
        <>
          <div className="flex items-center justify-between gap-3 px-1 text-sm">
            <span className="text-muted-foreground font-medium">
              Challenge {activeIndex + 1} of {blocks.length}
            </span>
            <div className="flex gap-1" aria-label="Activity path">
              {blocks.map((block, index) => {
                const done = completed.has(blockKey(block, index));

                return (
                  <span
                    key={blockKey(block, index)}
                    className={cn(
                      "size-2 rounded-full",
                      done
                        ? "bg-emerald-500"
                        : index === activeIndex
                          ? "bg-primary"
                          : "bg-muted-foreground/25"
                    )}
                    aria-label={`Challenge ${index + 1}${done ? " completed" : ""}`}
                  />
                );
              })}
            </div>
          </div>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeKey}
              custom={direction}
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, x: direction * motionDistance, scale: 0.985 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction * -motionDistance, scale: 0.985 }
              }
              transition={{ duration: reduceMotion ? 0.01 : motionDuration }}
            >
              {render(activeBlock, activeIndex)}
            </motion.div>
          </AnimatePresence>
          <div className="bg-card text-card-foreground flex items-center justify-between rounded-2xl border p-3 shadow-sm">
            <Button
              type="button"
              variant="ghost"
              disabled={activeIndex === 0}
              onClick={() => navigate(activeIndex - 1)}
            >
              <ChevronLeft className="mr-1 size-4" /> Previous
            </Button>
            {activeIndex < blocks.length - 1 ? (
              <Button
                type="button"
                disabled={!activeComplete}
                onClick={() => navigate(activeIndex + 1)}
              >
                {activeComplete ? "Continue" : "Complete this challenge"}
                <ChevronRight className="ml-1 size-4" />
              </Button>
            ) : (
              <span
                className={cn(
                  "px-3 text-sm font-bold",
                  isComplete ? "text-emerald-700" : "text-muted-foreground"
                )}
                role="status"
              >
                {isComplete ? "Path complete" : "Finish the final challenge"}
              </span>
            )}
          </div>
        </>
      ) : (
        blocks.map((block, index) => (
          <motion.div
            key={blockKey(block, index)}
            initial={reduceMotion ? false : { opacity: 0, y: motionDistance }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: reduceMotion ? 0.01 : motionDuration,
              delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.2),
            }}
          >
            {render(block, index)}
          </motion.div>
        ))
      )}
      {isComplete && definition.showCelebration !== false && (
        <Celebration score={score} />
      )}
    </div>
  );
}
