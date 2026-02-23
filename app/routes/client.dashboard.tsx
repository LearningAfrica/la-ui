import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";
import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  ArrowRight,
  UserPlus,
  FolderOpen,
} from "lucide-react";
import { useOrganizationStore } from "@/stores/organization/organization-store";
import {
  useMyOrganizationMembers,
  type OrganizationMembershipRole,
} from "@/features/organizations/organization-queries";

function AdminOverview({ orgId, orgName }: { orgId: string; orgName: string }) {
  const { data: membersData, isLoading } = useMyOrganizationMembers({
    organizationId: orgId,
    filters: { page: 1, page_size: 5 },
  });

  const totalMembers = membersData?.meta?.total_docs || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{orgName}</h1>
        <p className="text-muted-foreground mt-1">
          Workspace administration overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <div className="rounded-lg bg-blue-600/10 p-2">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalMembers}</div>
            )}
            <p className="text-muted-foreground text-xs">
              Active workspace members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <div className="rounded-lg bg-green-600/10 p-2">
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <div className="rounded-lg bg-purple-600/10 p-2">
              <FolderOpen className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <div className="rounded-lg bg-amber-600/10 p-2">
              <Award className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full justify-between">
            <Link to="/client/dashboard/members">
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Manage Members
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-between">
            <Link to="/client/dashboard/courses">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                View Courses
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-between">
            <Link to="/client/dashboard/categories">
              <span className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Manage Categories
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InstructorOverview({ orgName }: { orgName: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{orgName}</h1>
        <p className="text-muted-foreground mt-1">Instructor dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <div className="rounded-lg bg-blue-600/10 p-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Learners
            </CardTitle>
            <div className="rounded-lg bg-green-600/10 p-2">
              <GraduationCap className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Completion
            </CardTitle>
            <div className="rounded-lg bg-amber-600/10 p-2">
              <Award className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full justify-between">
            <Link to="/client/dashboard/my-courses">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                My Courses
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function LearnerOverview({ orgName }: { orgName: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{orgName}</h1>
        <p className="text-muted-foreground mt-1">Your learning dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enrolled Courses
            </CardTitle>
            <div className="rounded-lg bg-blue-600/10 p-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <div className="rounded-lg bg-yellow-600/10 p-2">
              <GraduationCap className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="rounded-lg bg-green-600/10 p-2">
              <Award className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <div className="rounded-lg bg-purple-600/10 p-2">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full justify-between">
            <Link to="/client/dashboard/courses">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Browse Courses
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-between">
            <Link to="/client/dashboard/my-learning">
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                My Learning
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-between">
            <Link to="/client/dashboard/certificates">
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                My Certificates
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
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
  const { selectedOrganization } = useOrganizationStore();
  const role = selectedOrganization?.role || "learner";
  const orgId = selectedOrganization?.id || "";
  const orgName = selectedOrganization?.name || "Organization";

  const DashboardComponent = roleComponents[role] || LearnerOverview;

  return (
    <div className="container mx-auto p-6">
      <DashboardComponent orgId={orgId} orgName={orgName} />
    </div>
  );
}
