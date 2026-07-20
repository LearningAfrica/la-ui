import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Reorder, useDragControls } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@/components/ui/form";
import {
  FormTextField,
  FormNumberField,
  FormSelectField,
} from "@/components/form-fields";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { orgRoutes } from "@/lib/utils/org-routes";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { useCourseModules } from "@/features/modules/module-queries";
import type { CourseModuleDetail } from "@/features/modules/module-queries";
import { useDeleteModule } from "@/features/modules/module-mutations";
import {
  useModuleContents,
  type ModuleContent,
} from "@/features/module-contents/module-content-queries";
import {
  useUpdateModuleContent,
  useDeleteModuleContent,
} from "@/features/module-contents/module-content-mutations";
import { useQuizzes } from "@/features/quizzes/quiz-queries";
import { useGenerateAiQuiz } from "@/features/quizzes/quiz-mutations";
import type { ContentType } from "@/lib/schema/module-content-schema";
import {
  aiQuizResolver,
  defaultAiQuizValues,
  difficultyOptions,
} from "@/lib/schema/quiz-schema";
import { ContentForm } from "@/components/dashboard/content-form";
import Plus from "~icons/lucide/plus";
import ChevronDown from "~icons/lucide/chevron-down";
import ChevronLeft from "~icons/lucide/chevron-left";
import GripVertical from "~icons/lucide/grip-vertical";
import FileText from "~icons/lucide/file-text";
import Video from "~icons/lucide/video";
import Paperclip from "~icons/lucide/paperclip";
import ClipboardList from "~icons/lucide/clipboard-list";
import Sparkles from "~icons/lucide/sparkles";
import Pencil from "~icons/lucide/pencil";
import Trash2 from "~icons/lucide/trash-2";
import BookOpen from "~icons/lucide/book-open";
import Loader2 from "~icons/lucide/loader-2";

// ---- lesson type metadata (drives the in-sheet picker + row icons) ---------
const LESSON_TYPES: {
  type: ContentType;
  label: string;
  description: string;
  icon: typeof FileText;
}[] = [
  {
    type: "text",
    label: "Text",
    description: "A written lesson with rich formatting.",
    icon: FileText,
  },
  {
    type: "video",
    label: "Video",
    description: "Embed a video for learners to watch.",
    icon: Video,
  },
  {
    type: "file",
    label: "File",
    description: "Attach a document to download.",
    icon: Paperclip,
  },
];

function LessonTypeIcon({
  type,
  className,
}: {
  type: ModuleContent["content_type"];
  className?: string;
}) {
  if (type === "video") return <Video className={className} />;

  if (type === "file") return <Paperclip className={className} />;

  return <FileText className={className} />;
}

function formatDuration(seconds?: number) {
  if (!seconds) return null;

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${m}:${s.toString().padStart(2, "0")}`;
}

// The Add-lesson Sheet moves through these steps in place — no overlay modals.
type SheetStep = "pick" | "content" | "ai";
type SheetState = {
  open: boolean;
  step: SheetStep;
  editing: ModuleContent | null;
  presetType: ContentType | null;
};

const CLOSED_SHEET: SheetState = {
  open: false,
  step: "pick",
  editing: null,
  presetType: null,
};

// ===========================================================================
export function CurriculumBuilder({
  courseId,
  orgId,
}: {
  courseId: string;
  orgId: string;
}) {
  const createModuleModal = useAppModal("create-or-update-module");
  const { data: modules, isLoading } = useCourseModules(courseId);
  const modulesList = modules?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-la-forest mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
            Course builder
          </p>
          <h2 className="font-display text-la-ink text-3xl font-bold tracking-tight">
            Curriculum
          </h2>
          <p className="text-la-muted mt-1">
            Add modules and lessons, then drag to reorder.
          </p>
        </div>
        <Button onClick={() => createModuleModal.open(undefined)}>
          <Plus className="mr-1 size-4" />
          Add module
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : modulesList.length === 0 ? (
        <div className="border-la-rule-strong rounded-lg border border-dashed px-6 py-16 text-center">
          <BookOpen className="text-la-muted mx-auto size-8" />
          <p className="font-display text-la-ink mt-4 text-lg font-semibold">
            No modules yet
          </p>
          <p className="text-la-muted mt-1 text-sm">
            Start by adding your first module to hold lessons.
          </p>
          <Button
            className="mt-5"
            onClick={() => createModuleModal.open(undefined)}
          >
            <Plus className="mr-1 size-4" />
            Add module
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {modulesList.map((module, i) => (
            <ModuleCard
              key={module.id}
              module={module}
              defaultOpen={i === 0}
              courseId={courseId}
              orgId={orgId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ===========================================================================
function ModuleCard({
  module,
  defaultOpen,
  courseId,
  orgId,
}: {
  module: CourseModuleDetail;
  defaultOpen: boolean;
  courseId: string;
  orgId: string;
}) {
  const navigate = useNavigate();
  const moduleModal = useAppModal("create-or-update-module");
  const [expanded, setExpanded] = useState(defaultOpen);

  const { data: contents } = useModuleContents(courseId, module.id);
  const { data: quizzes } = useQuizzes(courseId, module.id);
  const updateContent = useUpdateModuleContent();
  const deleteContent = useDeleteModuleContent();
  const deleteModule = useDeleteModule();

  // Display order = server order, with an optional drag override layered on top.
  const [dragOrder, setDragOrder] = useState<string[] | null>(null);
  const items = useMemo(() => {
    const sorted = [...(contents ?? [])].sort((a, b) => a.order - b.order);

    if (!dragOrder) return sorted;

    const byId = new Map(sorted.map((c) => [c.id, c] as const));
    const ordered: ModuleContent[] = [];

    dragOrder.forEach((id) => {
      const c = byId.get(id);

      if (c) {
        ordered.push(c);
        byId.delete(id);
      }
    });
    byId.forEach((c) => ordered.push(c)); // any lessons added since the drag

    return ordered;
  }, [contents, dragOrder]);
  const lastReordered = useRef<ModuleContent[]>([]);

  const [sheet, setSheet] = useState<SheetState>(CLOSED_SHEET);
  const [confirmModuleDelete, setConfirmModuleDelete] = useState(false);
  const [pendingLessonDelete, setPendingLessonDelete] =
    useState<ModuleContent | null>(null);

  const lessonCount =
    (contents?.length ?? module.contents?.length ?? 0) + (quizzes?.length ?? 0);

  // ponytail: no bulk reorder endpoint — PATCH each content whose order moved.
  // Fine for authoring (few lessons per module); swap to a bulk endpoint if it grows.
  function commitOrder() {
    lastReordered.current.forEach((c, i) => {
      const nextOrder = i + 1;

      if (c.order !== nextOrder) {
        updateContent.mutate({
          coursePk: courseId,
          modulePk: module.id,
          id: c.id,
          order: nextOrder,
        });
      }
    });
  }

  function handleReorder(next: ModuleContent[]) {
    lastReordered.current = next;
    setDragOrder(next.map((c) => c.id));
  }

  const openPicker = () =>
    setSheet({ open: true, step: "pick", editing: null, presetType: null });
  const closeSheet = () => setSheet(CLOSED_SHEET);

  function chooseType(type: ContentType) {
    setSheet({ open: true, step: "content", editing: null, presetType: type });
  }

  const sheetTitle =
    sheet.step === "ai"
      ? "Generate quiz with AI"
      : sheet.editing
        ? "Edit lesson"
        : "Add lesson";

  return (
    <div className="border-la-rule-strong bg-la-paper overflow-hidden rounded-lg border">
      {/* Module header */}
      <div className="flex items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-la-muted hover:text-la-ink flex size-7 shrink-0 items-center justify-center rounded transition-colors"
          aria-label={expanded ? "Collapse module" : "Expand module"}
        >
          <ChevronDown
            className={cn(
              "size-5 transition-transform",
              !expanded && "-rotate-90"
            )}
          />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-la-ink truncate text-base font-bold">
            {module.title}
          </h3>
          <p className="text-la-muted text-xs">
            {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
          </p>
        </div>
        <Button size="sm" onClick={openPicker}>
          <Plus className="mr-1 size-4" />
          <span className="hidden sm:inline">Add lesson</span>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Edit module"
          onClick={() =>
            moduleModal.open({
              id: module.id,
              title: module.title,
              description: module.description,
            })
          }
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Delete module"
          className="text-la-bad hover:text-la-bad"
          onClick={() => setConfirmModuleDelete(true)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Module body */}
      {expanded && (
        <div className="border-la-rule border-t px-3 py-3 sm:px-4">
          {items.length === 0 && (quizzes?.length ?? 0) === 0 ? (
            <p className="text-la-muted py-6 text-center text-sm">
              No lessons yet. Add your first with{" "}
              <span className="text-la-ink font-medium">Add lesson</span>.
            </p>
          ) : (
            <>
              <Reorder.Group
                axis="y"
                values={items}
                onReorder={handleReorder}
                className="space-y-1"
              >
                {items.map((content) => (
                  <LessonRow
                    key={content.id}
                    content={content}
                    onEdit={() =>
                      setSheet({
                        open: true,
                        step: "content",
                        editing: content,
                        presetType: null,
                      })
                    }
                    onDelete={() => setPendingLessonDelete(content)}
                    onCommitOrder={commitOrder}
                  />
                ))}
              </Reorder.Group>

              {/* Quizzes — a lesson type, edited in the dedicated quiz builder */}
              {quizzes?.map((quiz) => (
                <div
                  key={quiz.id}
                  className="group hover:bg-la-cream flex items-center gap-3 rounded-md px-2 py-2"
                >
                  <span className="w-4 shrink-0" aria-hidden />
                  <span className="bg-la-forest-wash text-la-forest flex size-8 shrink-0 items-center justify-center rounded-md">
                    <ClipboardList className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-la-ink truncate text-sm font-medium">
                      {quiz.title}
                    </p>
                    <p className="text-la-muted text-xs">
                      Quiz · {quiz.questions?.length ?? 0} questions
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    asChild
                    aria-label="Edit quiz"
                  >
                    <Link
                      to={orgRoutes.quizEdit(
                        orgId,
                        courseId,
                        module.id,
                        quiz.id
                      )}
                    >
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Add / edit lesson — one Sheet, stepped in place (no overlay modals) */}
      <Sheet open={sheet.open} onOpenChange={(v) => !v && closeSheet()}>
        <SheetContent
          dismissible={false}
          className="flex w-full flex-col overflow-y-auto sm:max-w-xl"
        >
          <SheetHeader>
            <SheetTitle className="font-display flex items-center gap-2">
              {sheet.step !== "pick" && !sheet.editing && (
                <button
                  type="button"
                  onClick={() =>
                    setSheet((s) => ({ ...s, step: "pick", presetType: null }))
                  }
                  className="text-la-muted hover:text-la-ink -ml-1"
                  aria-label="Back to lesson types"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}
              {sheetTitle}
            </SheetTitle>
            <SheetDescription>In {module.title}</SheetDescription>
          </SheetHeader>

          <div className="px-4 pb-6">
            {sheet.step === "pick" && (
              <div className="grid gap-3">
                {LESSON_TYPES.map(
                  ({ type, label, description, icon: Icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => chooseType(type)}
                      className="border-la-rule-strong hover:border-la-forest hover:bg-la-forest-wash flex items-start gap-3 rounded-lg border p-4 text-left transition-colors"
                    >
                      <span className="bg-la-cream text-la-ink-2 flex size-9 shrink-0 items-center justify-center rounded-md">
                        <Icon className="size-4" />
                      </span>
                      <span>
                        <span className="text-la-ink block font-medium">
                          {label}
                        </span>
                        <span className="text-la-muted block text-xs">
                          {description}
                        </span>
                      </span>
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => {
                    closeSheet();
                    navigate(orgRoutes.quizNew(orgId, courseId, module.id));
                  }}
                  className="border-la-rule-strong hover:border-la-forest hover:bg-la-forest-wash flex items-start gap-3 rounded-lg border p-4 text-left transition-colors"
                >
                  <span className="bg-la-cream text-la-ink-2 flex size-9 shrink-0 items-center justify-center rounded-md">
                    <ClipboardList className="size-4" />
                  </span>
                  <span>
                    <span className="text-la-ink block font-medium">Quiz</span>
                    <span className="text-la-muted block text-xs">
                      Build a graded quiz with questions.
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSheet((s) => ({ ...s, step: "ai" }))}
                  className="border-la-rule-strong hover:border-la-forest hover:bg-la-forest-wash flex items-start gap-3 rounded-lg border p-4 text-left transition-colors"
                >
                  <span className="bg-la-amber/15 text-la-amber flex size-9 shrink-0 items-center justify-center rounded-md">
                    <Sparkles className="size-4" />
                  </span>
                  <span>
                    <span className="text-la-ink block font-medium">
                      Quiz with AI
                    </span>
                    <span className="text-la-muted block text-xs">
                      Let AI draft a quiz from a topic.
                    </span>
                  </span>
                </button>
              </div>
            )}

            {sheet.step === "content" && (
              <ContentForm
                key={sheet.editing?.id ?? sheet.presetType ?? "new"}
                coursePk={courseId}
                modulePk={module.id}
                content={sheet.editing ?? undefined}
                initialType={sheet.presetType ?? undefined}
                onSuccess={closeSheet}
                onCancel={closeSheet}
              />
            )}

            {sheet.step === "ai" && (
              <AiQuizForm
                coursePk={courseId}
                modulePk={module.id}
                onSuccess={closeSheet}
                onCancel={closeSheet}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete module confirm */}
      <AlertDialog
        open={confirmModuleDelete}
        onOpenChange={setConfirmModuleDelete}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this module?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{module.title}&rdquo; and all of its lessons will be
              permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-la-bad hover:bg-la-bad/90 text-white"
              onClick={() =>
                deleteModule.mutate({
                  coursePk: courseId,
                  id: module.id,
                  title: module.title,
                })
              }
            >
              Delete module
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete lesson confirm */}
      <AlertDialog
        open={!!pendingLessonDelete}
        onOpenChange={(v) => !v && setPendingLessonDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingLessonDelete?.title}&rdquo; will be permanently
              removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-la-bad hover:bg-la-bad/90 text-white"
              onClick={() => {
                if (pendingLessonDelete) {
                  deleteContent.mutate({
                    coursePk: courseId,
                    modulePk: module.id,
                    id: pendingLessonDelete.id,
                    title: pendingLessonDelete.title,
                  });
                }

                setPendingLessonDelete(null);
              }}
            >
              Delete lesson
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ===========================================================================
function AiQuizForm({
  coursePk,
  modulePk,
  onSuccess,
  onCancel,
}: {
  coursePk: string;
  modulePk: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const generateAi = useGenerateAiQuiz();
  const form = useForm({
    resolver: aiQuizResolver,
    defaultValues: defaultAiQuizValues,
  });
  const isLoading = generateAi.isPending || form.formState.isSubmitting;

  const handleSubmit = form.handleSubmit((data) => {
    generateAi.mutate({ coursePk, modulePk, ...data }, { onSuccess });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormTextField
          control={form.control}
          name="topic"
          label="Topic"
          placeholder="e.g. Reading distributions"
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
        <div className="border-la-rule bg-la-paper sticky bottom-0 z-10 -mx-4 flex justify-end gap-3 border-t px-4 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 size-4" />
            )}
            Generate
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ===========================================================================
function LessonRow({
  content,
  onEdit,
  onDelete,
  onCommitOrder,
}: {
  content: ModuleContent;
  onEdit: () => void;
  onDelete: () => void;
  onCommitOrder: () => void;
}) {
  const controls = useDragControls();
  const duration = formatDuration(content.data?.duration_seconds);

  return (
    <Reorder.Item
      value={content}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onCommitOrder}
      className="border-la-rule bg-la-paper hover:bg-la-cream flex items-center gap-3 rounded-md border px-2 py-2"
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="text-la-muted hover:text-la-ink shrink-0 cursor-grab touch-none active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>
      <span className="bg-la-cream text-la-ink-2 flex size-8 shrink-0 items-center justify-center rounded-md">
        <LessonTypeIcon type={content.content_type} className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-la-ink truncate text-sm font-medium">
          {content.title}
        </p>
        <p className="text-la-muted text-xs capitalize">
          {content.content_type}
          {duration ? ` · ${duration}` : ""}
        </p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Edit lesson"
        onClick={onEdit}
      >
        <Pencil className="size-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Delete lesson"
        className="text-la-bad hover:text-la-bad"
        onClick={onDelete}
      >
        <Trash2 className="size-4" />
      </Button>
    </Reorder.Item>
  );
}
