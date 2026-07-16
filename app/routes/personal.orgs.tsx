import { useMemo } from "react";
import { useNavigate } from "react-router";
import Pencil from "~icons/lucide/pencil";
import RefreshCw from "~icons/lucide/refresh-cw";

import { useMyOrganizations } from "@/features/organizations/organization-queries";
import { orgRoutes } from "@/lib/utils/org-routes";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { useCanCreateOrg } from "@/stores/auth/auth-hooks";
import { CreateOrganizationModal } from "@/components/dashboard/create-organization-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PersonalOrganizationsPage() {
  const { data, isLoading, isFetching, refetch } = useMyOrganizations();
  const { setSelectedOrganization } = useOrganizationStore();
  const canCreateOrg = useCanCreateOrg();
  const navigate = useNavigate();
  const orgs = useMemo(() => data ?? [], [data]);

  const enter = (org: (typeof orgs)[number]) => {
    setSelectedOrganization(org);
    navigate(orgRoutes.overview(org.id));
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="la-eyebrow">Organizations</p>
          <h2 className="font-display text-la-ink mt-1 text-2xl font-medium tracking-tight">
            My organizations
          </h2>
          <p className="text-la-muted mt-1 text-[13px]">
            Open one to switch into its workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh organizations"
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
          {canCreateOrg && orgs.length > 0 && <CreateOrganizationModal />}
        </div>
      </header>

      {isLoading ? (
        <div className="text-la-muted text-[12px]">Loading…</div>
      ) : orgs.length === 0 ? (
        <div className="border-la-rule text-la-muted flex flex-col items-center gap-4 rounded border border-dashed p-8 text-center text-[13px]">
          {canCreateOrg ? (
            <>
              <p>
                You don&apos;t have an organization yet. Create one to get
                started.
              </p>
              <CreateOrganizationModal />
            </>
          ) : (
            <p>You haven&apos;t joined any organizations yet.</p>
          )}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => {
            const isOwner = org.role === "admin";

            return (
              <li key={org.id} className="relative">
                {isOwner && (
                  <div className="absolute top-2 right-2 z-10">
                    <CreateOrganizationModal organization={org}>
                      <button
                        type="button"
                        aria-label={`Edit ${org.name}`}
                        className="border-la-rule bg-la-paper text-la-muted hover:text-la-ink hover:border-la-forest flex size-7 items-center justify-center rounded border transition-colors"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </CreateOrganizationModal>
                  </div>
                )}
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
            );
          })}
        </ul>
      )}
    </div>
  );
}
