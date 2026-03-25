import { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Layers,
  FileText,
  Video,
  File,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  BookOpen,
  Tag,
} from "lucide-react";
import { useCourse } from "@/features/courses/course-queries";
import { useCourseModules } from "@/features/modules/module-queries";
import { useModuleContents } from "@/features/module-contents/module-content-queries";
import type { CourseModuleDetail } from "@/features/modules/module-queries";
import type { ModuleContent } from "@/features/module-contents/module-content-queries";

function TextContentViewer({ content }: { content: ModuleContent }) {
  return (
    <div
      className="prose dark:prose-invert max-w-none text-sm"
      dangerouslySetInnerHTML={{ __html: content.data.body ?? "" }}
    />
  );
}

function VideoContentViewer({ content }: { content: ModuleContent }) {
  const url = content.data.video_url ?? "";
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");

  let embedUrl = "";

  if (isYoutube) {
    const videoId =
      url.match(/[?&]v=([^&]+)/)?.[1] ?? url.match(/youtu\.be\/([^?]+)/)?.[1];

    if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  return (
    <div className="space-y-3">
      {embedUrl ? (
        <div className="aspect-video overflow-hidden rounded-lg">
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
          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <Video className="h-4 w-4" />
          Watch Video
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {content.data.duration_seconds != null &&
        content.data.duration_seconds > 0 && (
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Clock className="h-3.5 w-3.5" />
            {Math.floor(content.data.duration_seconds / 60)}m{" "}
            {content.data.duration_seconds % 60}s
          </div>
        )}
    </div>
  );
}

function FileContentViewer({ content }: { content: ModuleContent }) {
  return (
    <div className="bg-muted flex items-center gap-3 rounded-lg p-4">
      <File className="text-muted-foreground h-8 w-8" />
      <div>
        <p className="text-sm font-medium">
          {content.data.file_name ?? "Attachment"}
        </p>
        <p className="text-muted-foreground text-xs">
          File attachment for this lesson
        </p>
      </div>
    </div>
  );
}

function ContentItem({ content }: { content: ModuleContent }) {
  const typeIcons = { text: FileText, video: Video, file: File };
  const Icon = typeIcons[content.content_type] ?? FileText;

  return (
    <div className="space-y-3 py-4">
      <div className="flex items-center gap-2">
        <Icon className="text-muted-foreground h-4 w-4" />
        <h4 className="text-sm font-semibold">{content.title}</h4>
        <Badge variant="outline" className="text-xs">
          {content.content_type}
        </Badge>
      </div>
      {content.content_type === "text" && (
        <TextContentViewer content={content} />
      )}
      {content.content_type === "video" && (
        <VideoContentViewer content={content} />
      )}
      {content.content_type === "file" && (
        <FileContentViewer content={content} />
      )}
    </div>
  );
}

function ModuleSection({
  module: mod,
  courseId,
  index,
}: {
  module: CourseModuleDetail;
  courseId: string;
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const { data: contents, isLoading } = useModuleContents(courseId, mod.id);
  const contentsList = useMemo(() => contents ?? [], [contents]);

  return (
    <Card>
      <button
        type="button"
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="font-semibold">{mod.title}</h3>
            {mod.description && (
              <p className="text-muted-foreground mt-0.5 text-xs">
                {mod.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {mod.contents.length} items
          </Badge>
          {expanded ? (
            <ChevronDown className="text-muted-foreground h-4 w-4" />
          ) : (
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          )}
        </div>
      </button>

      {expanded && (
        <CardContent className="border-t pt-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : contentsList.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No content in this module yet.
            </p>
          ) : (
            <div className="divide-y">
              {contentsList.map((content) => (
                <ContentItem key={content.id} content={content} />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function CoursePreviewPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const { data: course, isLoading: courseLoading } = useCourse(courseId!);
  const { data: modules, isLoading: modulesLoading } = useCourseModules(
    courseId!
  );

  const modulesList = useMemo(() => modules ?? [], [modules]);

  if (courseLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Link to="/client/dashboard/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Courses
          </Button>
        </Link>
      </div>

      {/* Course Hero */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {course.course_image_url && (
              <img
                src={course.course_image_url}
                alt={course.title}
                className="h-48 w-full rounded-lg object-cover md:w-72"
              />
            )}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {course.title}
                </h1>
                {course.category && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {course.category.category_name}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={course.is_premium ? "default" : "secondary"}>
                  {course.is_premium ? "Premium" : "Free"}
                </Badge>
                <Badge variant={course.is_private ? "outline" : "secondary"}>
                  {course.is_private ? "Private" : "Public"}
                </Badge>
              </div>

              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="text-muted-foreground h-3.5 w-3.5" />
                  {course.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Layers className="text-muted-foreground h-4 w-4" />
                  <span>{modulesList.length} modules</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="text-muted-foreground h-4 w-4" />
                  <span>
                    {modulesList.reduce((acc, m) => acc + m.contents.length, 0)}{" "}
                    lessons
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview */}
      {course.overview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {course.overview}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modules */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Course Content</h2>
        {modulesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : modulesList.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Layers className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                No modules have been added to this course yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {modulesList.map((mod, i) => (
              <ModuleSection
                key={mod.id}
                module={mod}
                courseId={courseId!}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
