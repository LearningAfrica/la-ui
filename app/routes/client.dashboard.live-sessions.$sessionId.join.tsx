import { Link, useParams } from "react-router";
import ArrowLeft from "~icons/lucide/arrow-left";
import { OrgRoleGuard } from "@/components/auth/org-role-guard";
import { Button } from "@/components/ui/button";
import { ZoomMeetingEmbed } from "@/components/dashboard/live-sessions/zoom-meeting-embed";
import { orgRoutes } from "@/lib/utils/org-routes";

export default function LiveSessionJoinRoute() {
  const { orgId = "", sessionId = "" } = useParams<{
    orgId: string;
    sessionId: string;
  }>();

  return (
    <OrgRoleGuard allowedRoles={["admin", "instructor", "learner"]}>
      <div className="space-y-4 p-4">
        <Button asChild variant="ghost" size="sm">
          <Link to={orgRoutes.liveSessions(orgId)}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to sessions
          </Link>
        </Button>
        <ZoomMeetingEmbed sessionId={sessionId} />
      </div>
    </OrgRoleGuard>
  );
}
