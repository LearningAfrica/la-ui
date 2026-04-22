import { Link, useParams } from "react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentForm } from "@/components/dashboard/content-form";
import { useModuleContent } from "@/features/module-contents/module-content-queries";

export default function EditContentPage() {
  const { courseId, moduleId, contentId } = useParams<{
    courseId: string;
    moduleId: string;
    contentId: string;
  }>();
  const { data: content, isLoading } = useModuleContent(
    courseId!,
    moduleId!,
    contentId!
  );
  const back = `/client/dashboard/courses/${courseId}/modules?moduleId=${moduleId}&tab=contents`;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <Button asChild variant="ghost" size="sm">
          <Link to={back}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Contents
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-2xl font-bold sm:text-3xl">Edit Content</h1>
        </div>
        <p className="text-muted-foreground">Update the content details.</p>
      </div>

      {isLoading || !content ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <ContentForm
          coursePk={courseId!}
          modulePk={moduleId!}
          content={content}
          redirectTo={back}
        />
      )}
    </div>
  );
}
