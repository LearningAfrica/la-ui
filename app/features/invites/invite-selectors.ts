import type { Invite } from "./invites-queries";

export const pendingInvites = (invites?: Invite[]) =>
  (invites ?? []).filter((inv) => !inv.is_used);

export const pendingInviteCount = (invites?: Invite[]) =>
  pendingInvites(invites).length;
