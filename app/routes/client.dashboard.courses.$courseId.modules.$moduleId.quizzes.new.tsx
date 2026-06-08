import { Link, useParams } from "react-router";
import ArrowLeft from "~icons/lucide/arrow-left";
import ClipboardCheck from "~icons/lucide/clipboard-check";
import { Button } from "@/components/ui/button";
import { QuizForm } from "@/components/dashboard/quiz-form";
import { OrgRoleGuard } from "@/components/auth/org-role-guard";
import { orgRoutes } from "@/lib/utils/org-routes";

export default function NewQuizPage() {
  return (
    <OrgRoleGuard allowedRoles={["admin", "instructor"]}>
      <NewQuizPageInner />
    </OrgRoleGuard>
  );
}

function NewQuizPageInner() {
  const {
    orgId = "",
    courseId,
    moduleId,
  } = useParams<{
    orgId: string;
    courseId: string;
    moduleId: string;
  }>();
  const back = `${orgRoutes.courseModules(orgId, courseId!)}?moduleId=${moduleId}&tab=quizzes`;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <Button asChild variant="ghost" size="sm">
          <Link to={back}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Quizzes
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6" />
          <h1 className="text-2xl font-bold sm:text-3xl">Create Quiz</h1>
        </div>
        <p className="text-muted-foreground">
          Build a quiz to assess learner understanding of this module.
        </p>
      </div>
      <QuizForm coursePk={courseId!} modulePk={moduleId!} redirectTo={back} />
    </div>
  );
}
