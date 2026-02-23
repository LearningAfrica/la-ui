import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MailOpen } from "lucide-react";
import { useMyInvites } from "@/features/invites/invites-queries";
import { InvitesTable } from "@/components/dashboard/invites-table";

export default function ClientDashboardInvitations() {
  const { data: invites, isLoading, error } = useMyInvites();

  const pendingCount =
    invites?.filter((inv) => inv.status === "pending").length ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
            <p className="text-muted-foreground text-center">
              Failed to load invitations. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invitations</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization invitations
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="secondary" className="text-sm">
            {pendingCount} pending
          </Badge>
        )}
      </div>

      {!invites || invites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MailOpen className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">No Invitations</h3>
            <p className="text-muted-foreground text-center">
              You don&apos;t have any organization invitations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <InvitesTable invites={invites} />
      )}
    </div>
  );
}
