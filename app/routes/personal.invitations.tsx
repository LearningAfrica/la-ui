import { useMyInvites } from "@/features/invites/invites-queries";

export default function PersonalInvitationsPage() {
  const { data, isLoading } = useMyInvites();
  const invites = data?.data ?? [];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <header>
        <p className="la-eyebrow">Invitations</p>
        <h2 className="font-display text-la-ink mt-1 text-2xl font-medium tracking-tight">
          Pending invitations
        </h2>
        <p className="text-la-muted mt-1 text-[13px]">
          Accept to join an organization, or decline if it&apos;s no longer
          relevant.
        </p>
      </header>

      {isLoading ? (
        <div className="text-la-muted text-[12px]">Loading…</div>
      ) : invites.length === 0 ? (
        <div className="border-la-rule text-la-muted rounded border border-dashed p-6 text-center text-[13px]">
          No invitations waiting for you.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {invites.map((invite) => (
            <li
              key={invite.id}
              className="border-la-rule bg-la-paper flex items-center justify-between rounded border px-4 py-3"
            >
              <div>
                <div className="font-display text-la-ink text-[14px] font-semibold">
                  {invite.email}
                </div>
                <div className="text-la-muted text-[11px]">
                  Role: {invite.role}
                </div>
              </div>
              <span className="text-la-muted text-[12px]">
                {invite.is_used ? "Accepted" : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
