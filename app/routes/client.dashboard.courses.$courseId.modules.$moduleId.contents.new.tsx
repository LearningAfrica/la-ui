import { Link, useParams } from "react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentForm } from "@/components/dashboard/content-form";

export default function NewContentPage() {
  const { courseId, moduleId } = useParams<{
    courseId: string;
    moduleId: string;
  }>();
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
          <h1 className="text-2xl font-bold sm:text-3xl">Add Module Content</h1>
        </div>
        <p className="text-muted-foreground">Add new content to this module.</p>
      </div>
      <ContentForm
        coursePk={courseId!}
        modulePk={moduleId!}
        redirectTo={back}
      />
    </div>
  );
}
