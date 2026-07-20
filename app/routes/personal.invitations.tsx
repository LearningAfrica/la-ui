import Loader2 from "~icons/lucide/loader-2";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useAcceptInvite,
  useDeclineInvite,
} from "@/features/invites/invites-mutations";
import { useMyInvites, type Invite } from "@/features/invites/invites-queries";

export default function PersonalInvitationsPage() {
  const { data, isLoading } = useMyInvites();
  const invites = data?.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header>
        <p className="text-la-forest mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
          Invitations
        </p>
        <h1 className="font-display text-la-ink text-2xl font-bold tracking-tight lg:text-3xl">
          Your invitations
        </h1>
        <p className="text-la-muted mt-2 max-w-prose text-sm">
          Accept to join an organization, or decline if it&apos;s no longer
          relevant.
        </p>
      </header>

      {isLoading ? (
        <ul className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <li
              key={i}
              className="border-la-rule-strong bg-la-paper rounded-lg border p-5"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="size-11 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : invites.length === 0 ? (
        <div className="border-la-rule bg-la-paper rounded-lg border border-dashed px-6 py-16 text-center">
          <p className="font-display text-la-ink text-lg font-semibold">
            No invitations yet.
          </p>
          <p className="text-la-muted mt-1 text-sm">
            When an organization invites you, it&apos;ll show up here.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {invites.map((invite) => (
            <InviteCard key={invite.id} invite={invite} />
          ))}
        </ul>
      )}
    </div>
  );
}

function InviteCard({ invite }: { invite: Invite }) {
  const accept = useAcceptInvite();
  const decline = useDeclineInvite();

  const status = invite.is_used ? "accepted" : "pending";
  const actionable = !invite.is_used;

  const isAccepting = accept.isPending && accept.variables === invite.id;
  const isDeclining = decline.isPending && decline.variables === invite.id;
  const busy = isAccepting || isDeclining;

  return (
    <li className="border-la-rule-strong bg-la-paper flex flex-col gap-4 rounded-lg border p-5 sm:flex-row sm:items-center">
      <div
        className="bg-la-forest-wash text-la-forest font-display flex size-11 shrink-0 items-center justify-center rounded-md text-base font-bold uppercase"
        aria-hidden
      >
        {invite.email?.charAt(0) || "?"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-la-ink truncate font-bold">
            {invite.email}
          </span>
          <StatusPill status={status} />
        </div>
        <p className="text-la-muted mt-1 flex items-center gap-1.5 text-sm">
          Invited as
          <span className="bg-la-forest-wash text-la-forest rounded-full px-2 py-0.5 text-xs font-medium capitalize">
            {invite.role}
          </span>
        </p>
      </div>

      {actionable && (
        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            onClick={() => accept.mutate(invite.id)}
            disabled={busy}
          >
            {isAccepting ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : null}
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => decline.mutate(invite.id)}
            disabled={busy}
          >
            {isDeclining ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : null}
            Decline
          </Button>
        </div>
      )}
    </li>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        status === "pending" && "bg-la-amber/15 text-la-amber-deep",
        status === "accepted" && "bg-la-ok/15 text-la-ok",
        status === "declined" && "bg-la-bad/10 text-la-bad"
      )}
    >
      {status}
    </span>
  );
}
