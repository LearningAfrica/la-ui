import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  File,
  FileText,
  ListTree,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCourseMyProgress } from "@/features/courses/course-queries";
import { useCourseModules } from "@/features/modules/module-queries";
import {
  useMarkContentComplete,
  useMarkContentIncomplete,
} from "@/features/module-contents/module-content-mutations";
import type { ModuleContent } from "@/features/module-contents/module-content-queries";
import type { CourseModuleDetail } from "@/features/modules/module-queries";

interface FlatItem {
  content: ModuleContent;
  module: CourseModuleDetail;
  index: number;
}

function flattenModules(modules: CourseModuleDetail[]): FlatItem[] {
  const out: FlatItem[] = [];
  let i = 0;

  for (const mod of modules) {
    for (const content of mod.contents) {
      out.push({ content, module: mod, index: i });
      i++;
    }
  }

  return out;
}

function formatLessonDuration(seconds: number | undefined): string {
  if (!seconds || seconds <= 0) return "";

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${m}:${s.toString().padStart(2, "0")}`;
}

function TextBody({ content }: { content: ModuleContent }) {
  return (
    <div
      className="lesson-prose"
      dangerouslySetInnerHTML={{ __html: content.data.body ?? "" }}
    />
  );
}

function VideoBody({ content }: { content: ModuleContent }) {
  const url = content.data.video_url ?? "";
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
  let embedUrl = "";

  if (isYoutube) {
    const videoId =
      url.match(/[?&]v=([^&]+)/)?.[1] ?? url.match(/youtu\.be\/([^?]+)/)?.[1];

    if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  return (
    <div className="space-y-4">
      {embedUrl ? (
        <div className="aspect-video overflow-hidden rounded-xl border">
          <iframe
            src={embedUrl}
            title={content.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center gap-2 underline underline-offset-4"
        >
          <Video className="h-4 w-4" />
          Watch video
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {content.data.body && (
        <div
          className="lesson-prose"
          dangerouslySetInnerHTML={{ __html: content.data.body }}
        />
      )}
    </div>
  );
}

function FileBody({ content }: { content: ModuleContent }) {
  return (
    <div className="bg-muted/50 flex items-center gap-4 rounded-xl border p-5">
      <File className="text-muted-foreground h-10 w-10 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {content.data.file_name ?? "Attachment"}
        </p>
        <p className="text-muted-foreground text-sm">
          File attachment for this lesson
        </p>
      </div>
      {content.data.file && (
        <Button asChild variant="outline" size="sm">
          <a href={content.data.file} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1 h-3.5 w-3.5" />
            Open
          </a>
        </Button>
      )}
    </div>
  );
}

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

function useTocHeadings(content: ModuleContent | undefined): TocHeading[] {
  return useMemo(() => {
    if (!content || content.content_type !== "text") return [];

    const html = content.data.body ?? "";

    if (!html) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const nodes = Array.from(doc.querySelectorAll("h2, h3"));

    return nodes.map((node, i) => {
      const text = node.textContent?.trim() ?? "";
      const id =
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || `section-${i}`;

      return {
        id,
        text,
        level: node.tagName === "H2" ? 2 : 3,
      };
    });
  }, [content]);
}

export default function LessonReaderPage() {
  const { courseId, contentId } = useParams<{
    courseId: string;
    contentId: string;
  }>();
  const navigate = useNavigate();

  const { data: modules, isLoading: modulesLoading } = useCourseModules(
    courseId!
  );
  const { data: progress } = useCourseMyProgress(courseId!);
  const markComplete = useMarkContentComplete();
  const markIncomplete = useMarkContentIncomplete();

  const flat = useMemo(() => flattenModules(modules ?? []), [modules]);

  const current = flat.find((f) => f.content.id === contentId);
  const prev = current && current.index > 0 ? flat[current.index - 1] : null;
  const next =
    current && current.index < flat.length - 1 ? flat[current.index + 1] : null;

  const isCompleted = useMemo(() => {
    if (!progress?.modules || !contentId) return false;

    return progress.modules.some((mod) =>
      mod.contents?.some(
        (content) => content.id === contentId && content.is_completed
      )
    );
  }, [progress, contentId]);

  const headings = useTocHeadings(current?.content);

  // After render, assign IDs to headings in the rendered HTML so the TOC can scroll to them.
  const [contentRoot, setContentRoot] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!contentRoot || headings.length === 0) return;

    const nodes = contentRoot.querySelectorAll("h2, h3");

    nodes.forEach((node, i) => {
      const heading = headings[i];

      if (heading) node.id = heading.id;
    });
  }, [contentRoot, headings, current?.content.id]);

  if (modulesLoading || !current) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const { content, module: mod } = current;
  const typeIcons = { text: FileText, video: Video, file: File };
  const TypeIcon = typeIcons[content.content_type] ?? FileText;

  const handleMarkComplete = () => {
    if (!courseId) return;

    markComplete.mutate(
      { coursePk: courseId, modulePk: mod.id, id: content.id },
      {
        onSuccess: () => {
          if (next) {
            navigate(
              `/client/dashboard/courses/${courseId}/lessons/${next.content.id}`
            );
          }
        },
      }
    );
  };

  const handleMarkIncomplete = () => {
    if (!courseId) return;

    markIncomplete.mutate({
      coursePk: courseId,
      modulePk: mod.id,
      id: content.id,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {progress && (
        <div className="text-muted-foreground mb-6 text-xs font-medium tracking-wide uppercase">
          Lesson {current.index + 1} of {flat.length}
        </div>
      )}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
        {/* Article column */}
        <article className="min-w-0">
          <header className="mb-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <TypeIcon className="h-3 w-3" />
                {mod.title}
              </Badge>
              {content.data.duration_seconds ? (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {formatLessonDuration(content.data.duration_seconds)}
                </Badge>
              ) : null}
              {isCompleted && (
                <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {content.title}
            </h1>
          </header>

          <div ref={setContentRoot}>
            {content.content_type === "text" && <TextBody content={content} />}
            {content.content_type === "video" && (
              <VideoBody content={content} />
            )}
            {content.content_type === "file" && <FileBody content={content} />}
          </div>

          {/* Mark complete */}
          <div className="border-border/60 mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
            {isCompleted ? (
              <Button
                variant="outline"
                onClick={handleMarkIncomplete}
                disabled={markIncomplete.isPending}
              >
                <Circle className="mr-2 h-4 w-4" />
                Mark incomplete
              </Button>
            ) : (
              <Button
                onClick={handleMarkComplete}
                disabled={markComplete.isPending}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {next ? "Mark complete & continue" : "Mark complete"}
              </Button>
            )}

            <div className="flex items-center gap-2">
              {prev && (
                <Button asChild variant="ghost" size="sm">
                  <Link
                    to={`/client/dashboard/courses/${courseId}/lessons/${prev.content.id}`}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Link>
                </Button>
              )}
              {next && (
                <Button asChild variant="ghost" size="sm">
                  <Link
                    to={`/client/dashboard/courses/${courseId}/lessons/${next.content.id}`}
                  >
                    Next
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Up next */}
          {next && (
            <Link
              to={`/client/dashboard/courses/${courseId}/lessons/${next.content.id}`}
              className="hover:border-primary/50 hover:bg-muted/30 group mt-6 flex items-center gap-4 rounded-xl border p-5 transition-colors"
            >
              <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                <ArrowRight className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Up next
                </p>
                <p className="truncate font-semibold">{next.content.title}</p>
                <p className="text-muted-foreground truncate text-sm">
                  {next.module.title}
                </p>
              </div>
            </Link>
          )}
        </article>

        {/* Right rail TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            {headings.length > 0 && (
              <div>
                <p className="text-muted-foreground mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                  <ListTree className="h-3.5 w-3.5" />
                  On this page
                </p>
                <ul className="space-y-1.5 border-l">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className={cn(
                          "text-muted-foreground hover:text-foreground hover:border-foreground/40 -ml-px block border-l border-transparent py-1 pl-3 text-sm transition-colors",
                          h.level === 3 && "pl-6"
                        )}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
