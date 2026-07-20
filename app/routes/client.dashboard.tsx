import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "react-router";
import { useState } from "react";
import BookOpen from "~icons/lucide/book-open";
import GraduationCap from "~icons/lucide/graduation-cap";
import Award from "~icons/lucide/award";
import ArrowRight from "~icons/lucide/arrow-right";
import UserPlus from "~icons/lucide/user-plus";
import FolderOpen from "~icons/lucide/folder-open";
import Plus from "~icons/lucide/plus";
import Mail from "~icons/lucide/mail";
import { cn } from "@/lib/utils";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { orgRoutes } from "@/lib/utils/org-routes";
import {
  useMyOrganizationMembers,
  type OrganizationMembershipRole,
} from "@/features/organizations/organization-queries";
import { InviteMemberDialog } from "@/components/dashboard/invite-member-dialog";
import { useCourses } from "@/features/courses/course-queries";
import { useCategories } from "@/features/categories/category-queries";
import { useOrganizationInvites } from "@/features/organizations/organization-queries";
import { useUserStats } from "@/features/stats/stats-queries";

type IconType = React.ComponentType<{ className?: string }>;

function DashboardHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-la-forest mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display text-la-ink text-4xl font-bold tracking-tight lg:text-5xl">
          {title}
        </h1>
        <p className="text-la-muted mt-2 max-w-prose">{subtitle}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

function StatStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-la-rule-strong bg-la-rule-strong mb-8 grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  );
}

function StatCell({
  eyebrow,
  title,
  value,
  accent,
  loading,
}: {
  eyebrow: string;
  title: string;
  value: React.ReactNode;
  accent: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-la-paper relative p-5">
      <span
        className={cn("absolute inset-x-0 top-0 h-1", accent)}
        aria-hidden
      />
      <p className="text-la-muted text-[0.7rem] font-semibold tracking-[0.15em] uppercase">
        {eyebrow}
      </p>
      {loading ? (
        <Skeleton className="mt-3 h-10 w-14" />
      ) : (
        <p className="font-display text-la-ink mt-3 text-4xl font-bold tabular-nums">
          {value}
        </p>
      )}
      <p className="text-la-ink-2 mt-1 text-sm font-medium">{title}</p>
    </div>
  );
}

function ActionRail({
  title = "Quick actions",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-la-rule-strong bg-la-paper rounded-lg border">
      <div className="border-la-rule border-b px-5 py-4">
        <h2 className="font-display text-la-ink text-lg font-bold">{title}</h2>
      </div>
      <nav className="p-2">{children}</nav>
    </section>
  );
}

function RailLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: IconType;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="group hover:bg-la-cream flex items-center gap-3 rounded-md px-3 py-3 transition-colors"
    >
      <span className="bg-la-cream text-la-ink-2 group-hover:bg-la-forest group-hover:text-la-paper flex size-9 items-center justify-center rounded-md transition-colors">
        <Icon className="size-4" />
      </span>
      <span className="text-la-ink flex-1 font-medium">{label}</span>
      <ArrowRight className="text-la-muted size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function AdminOverview({ orgId, orgName }: { orgId: string; orgName: string }) {
  const { data: membersData, isLoading: membersLoading } =
    useMyOrganizationMembers({
      organizationId: orgId,
      filters: { page: 1, page_size: 5 },
    });
  const { data: coursesData, isLoading: coursesLoading } = useCourses({
    page: 1,
    pageSize: 1,
  });
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    page: 1,
    limit: 1,
  });
  const { data: invitesData, isLoading: invitesLoading } =
    useOrganizationInvites({
      organizationId: orgId,
      filters: { page: 1, page_size: 1, status: "pending" },
    });
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const totalMembers = membersData?.meta?.total_docs || 0;
  const totalCourses = coursesData?.meta?.total_docs || 0;
  const totalCategories = categoriesData?.meta?.total_docs || 0;
  const pendingInvites = invitesData?.meta?.total_docs || 0;

  return (
    <div>
      <DashboardHeader
        eyebrow="Admin"
        title={orgName}
        subtitle="Workspace administration overview"
        action={
          <Button onClick={() => setInviteDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Invite members
          </Button>
        }
      />

      <StatStrip>
        <StatCell
          eyebrow="Members"
          title="Active workspace members"
          value={totalMembers}
          accent="bg-la-ink"
          loading={membersLoading}
        />
        <StatCell
          eyebrow="Courses"
          title="Published courses"
          value={totalCourses}
          accent="bg-la-forest"
          loading={coursesLoading}
        />
        <StatCell
          eyebrow="Categories"
          title="Content categories"
          value={totalCategories}
          accent="bg-la-ok"
          loading={categoriesLoading}
        />
        <StatCell
          eyebrow="Invites"
          title="Awaiting response"
          value={pendingInvites}
          accent="bg-la-amber"
          loading={invitesLoading}
        />
      </StatStrip>

      <ActionRail>
        <RailLink
          to={orgRoutes.members(orgId)}
          icon={UserPlus}
          label="Manage members"
        />
        <RailLink
          to={orgRoutes.courses(orgId)}
          icon={BookOpen}
          label="View courses"
        />
        <RailLink
          to={orgRoutes.categories(orgId)}
          icon={FolderOpen}
          label="Manage categories"
        />
      </ActionRail>

      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        organizationId={orgId}
      />
    </div>
  );
}

function InstructorOverview({
  orgId,
  orgName,
}: {
  orgId: string;
  orgName: string;
}) {
  const { data: coursesData, isLoading: coursesLoading } = useCourses({
    page: 1,
    pageSize: 1,
  });
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    page: 1,
    limit: 1,
  });
  const { data: userStats, isLoading: statsLoading } = useUserStats({
    enabled: false,
  });

  const totalCourses = coursesData?.meta?.total_docs ?? 0;
  const totalCategories = categoriesData?.meta?.total_docs ?? 0;
  const totalLearners =
    typeof userStats?.total_learners === "number"
      ? userStats.total_learners
      : null;
  const avgCompletion =
    typeof userStats?.average_completion === "number"
      ? userStats.average_completion
      : null;

  return (
    <div>
      <DashboardHeader
        eyebrow="Instructor"
        title={orgName}
        subtitle="Manage your courses and track learner progress"
        action={
          <Button asChild>
            <Link to={orgRoutes.courseNew(orgId)}>
              <Plus className="mr-2 h-4 w-4" />
              New course
            </Link>
          </Button>
        }
      />

      <StatStrip>
        <StatCell
          eyebrow="Courses"
          title="Courses created"
          value={totalCourses}
          accent="bg-la-ink"
          loading={coursesLoading}
        />
        <StatCell
          eyebrow="Learners"
          title="Enrolled learners"
          value={totalLearners ?? "—"}
          accent="bg-la-forest"
          loading={statsLoading}
        />
        <StatCell
          eyebrow="Completion"
          title="Average rate"
          value={avgCompletion != null ? `${Math.round(avgCompletion)}%` : "—"}
          accent="bg-la-ok"
          loading={statsLoading}
        />
        <StatCell
          eyebrow="Categories"
          title="Content categories"
          value={totalCategories}
          accent="bg-la-amber"
          loading={categoriesLoading}
        />
      </StatStrip>

      <ActionRail>
        <RailLink
          to={orgRoutes.courses(orgId)}
          icon={BookOpen}
          label="My courses"
        />
        <RailLink
          to={orgRoutes.courseNew(orgId)}
          icon={Plus}
          label="New course"
        />
        <RailLink
          to={orgRoutes.categories(orgId)}
          icon={FolderOpen}
          label="Categories"
        />
      </ActionRail>
    </div>
  );
}

function LearnerOverview({
  orgId,
  orgName,
}: {
  orgId: string;
  orgName: string;
}) {
  const { data, isLoading } = useCourses({ page: 1, pageSize: 1 });
  const enrolled = data?.meta?.total_docs ?? 0;

  const hint = (text: string) => (
    <span className="text-la-muted text-sm font-medium">{text}</span>
  );

  return (
    <div>
      <DashboardHeader
        eyebrow="Learner"
        title={orgName}
        subtitle="Your learning dashboard"
      />

      <StatStrip>
        <StatCell
          eyebrow="Enrolled"
          title="Active enrollments"
          value={enrolled}
          accent="bg-la-ink"
          loading={isLoading}
        />
        <StatCell
          eyebrow="In progress"
          title="Track your active courses"
          value={hint("Open my learning")}
          accent="bg-la-forest"
        />
        <StatCell
          eyebrow="Completed"
          title="Finished courses"
          value={hint("Open my learning")}
          accent="bg-la-ok"
        />
        <StatCell
          eyebrow="Certificates"
          title="Earned credentials"
          value={hint("Open certificates")}
          accent="bg-la-amber"
        />
      </StatStrip>

      <ActionRail>
        <RailLink
          to={orgRoutes.courses(orgId)}
          icon={BookOpen}
          label="Browse courses"
        />
        <RailLink
          to={orgRoutes.myLearning(orgId)}
          icon={GraduationCap}
          label="My learning"
        />
        <RailLink
          to={orgRoutes.certificates(orgId)}
          icon={Award}
          label="My certificates"
        />
      </ActionRail>
    </div>
  );
}

const roleComponents: Record<
  OrganizationMembershipRole,
  React.ComponentType<{ orgId: string; orgName: string }>
> = {
  admin: AdminOverview,
  instructor: InstructorOverview,
  learner: LearnerOverview,
};

export default function ClientDashboard() {
  const { orgId: urlOrgId } = useParams<{ orgId: string }>();
  const { selectedOrganization } = useOrganizationStore();
  const role = selectedOrganization?.role || "learner";
  const orgId = urlOrgId || selectedOrganization?.id || "";
  const orgName = selectedOrganization?.name || "Organization";

  const DashboardComponent = roleComponents[role] || LearnerOverview;

  return (
    <div className="p-6 lg:p-8">
      <DashboardComponent orgId={orgId} orgName={orgName} />
    </div>
  );
}
