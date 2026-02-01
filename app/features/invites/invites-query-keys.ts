// Invites Query and Mutation Keys
export const invitesQueryKeys = {
  invites: () => ["invites"] as const,
  invite: (id: string) => ["invite", id] as const,
  myInvites: () => ["myInvites"] as const,
};

// Mutation Keys
export const invitesMutationKeys = {
  acceptInvite: () => ["acceptInvite"] as const,
  declineInvite: () => ["declineInvite"] as const,
};
