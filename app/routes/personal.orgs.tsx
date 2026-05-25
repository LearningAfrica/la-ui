import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import { useMyOrganizations } from "@/features/organizations/organization-queries";
import { orgRoutes } from "@/lib/utils/org-routes";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";

export default function PersonalOrganizationsPage() {
  const { data, isLoading } = useMyOrganizations();
  const { setSelectedOrganization } = useOrganizationStore();
  const navigate = useNavigate();
  const orgs = useMemo(() => data ?? [], [data]);

  // Single-org shortcut: drop straight into the only workspace the user has.
  useEffect(() => {
    if (isLoading || orgs.length !== 1) return;

    const only = orgs[0];

    setSelectedOrganization(only);
    navigate(orgRoutes.overview(only.id), { replace: true });
  }, [isLoading, orgs, setSelectedOrganization, navigate]);

  const enter = (org: (typeof orgs)[number]) => {
    setSelectedOrganization(org);
    navigate(orgRoutes.overview(org.id));
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <header>
        <p className="la-eyebrow">Organizations</p>
        <h2 className="font-display text-la-ink mt-1 text-2xl font-medium tracking-tight">
          My organizations
        </h2>
        <p className="text-la-muted mt-1 text-[13px]">
          Open one to switch into its workspace.
        </p>
      </header>

      {isLoading ? (
        <div className="text-la-muted text-[12px]">Loading…</div>
      ) : orgs.length === 0 ? (
        <div className="border-la-rule text-la-muted rounded border border-dashed p-6 text-center text-[13px]">
          You haven&apos;t joined any organizations yet.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <li key={org.id}>
              <button
                type="button"
                onClick={() => enter(org)}
                className="border-la-rule bg-la-paper hover:border-la-forest flex w-full flex-col gap-3 rounded border p-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-la-forest text-la-paper font-display grid size-10 place-items-center rounded text-[13px] font-semibold">
                    {org.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-la-ink truncate text-[14px] font-semibold">
                      {org.name}
                    </div>
                    <div className="text-la-muted truncate text-[11px] capitalize">
                      {org.role}
                    </div>
                  </div>
                </div>
                {org.description && (
                  <p className="text-la-muted line-clamp-2 text-[12px]">
                    {org.description}
                  </p>
                )}
                <span className="font-display text-la-forest text-[12px] font-medium">
                  Open workspace →
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
