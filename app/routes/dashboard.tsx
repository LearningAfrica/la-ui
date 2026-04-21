import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { generateSEOTags } from "@/lib/utils/seo";
import { useMemo, useState } from "react";
import { href, Link, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth/auth-hooks";
import { RouteGuard } from "@/components/auth/route-guard";
import { useMyOrganizations } from "@/features/organizations/organization-queries";
import {
  useMyInquiries,
  type InquiryInterface,
} from "@/features/inquiries/inquiry-queries";
import { useMyInvites } from "@/features/invites/invites-queries";

import { OrganizationCard } from "@/components/dashboard/organization-card";
import { InquiriesTable } from "@/components/dashboard/inquiries-table";
import { InvitesTable } from "@/components/dashboard/invites-table";
import { CreateOrganizationModal } from "@/components/dashboard/create-organization-modal";
import {
  Building2,
  Mail,
  User,
  Plus,
  AlertCircle,
  CheckCircle2,
  MailOpen,
  ArrowLeft,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Dashboard | Learning Africa - Your Learning Analytics Hub",
      description:
        "View your learning analytics, statistics, and insights in real-time",
      url: href("/dashboard"),
      image: "/og.png",
    }),
  ];
}
type TabType = "organizations" | "inquiries" | "invites";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<TabType>("organizations");
  const {
    user,
    canCreateOrg,
    isVerified,
    logout: logoutStore,
  } = useAuthStore();
  const navigate = useNavigate();
  const {
    data: inquiriesData,
    isLoading: inquiriesLoading,
    isFetching: inquiriesFetching,
    error: inquiriesError,
    refetch: refetchInquiries,
  } = useMyInquiries();
  const inquiries = useMemo(() => inquiriesData?.data || [], [inquiriesData]);

  const {
    data: organizations,
    isFetching: organizationsFetching,
    refetch: refetchOrganizations,
  } = useMyOrganizations();
  const {
    data: invitesData,
    isFetching: invitesFetching,
    refetch: refetchInvites,
  } = useMyInvites();

  const orgCount = organizations?.length ?? 0;
  const inquiryCount = inquiriesData?.meta?.total_docs ?? 0;
  const inviteCount = invitesData?.data?.length ?? 0;

  const handleTabChange = (value: string) => {
    setSelectedTab(value as TabType);
  };

  const handleLogout = () => {
    logoutStore();
    navigate("/");
  };

  return (
    <RouteGuard allowedRoles={["user"]} requireVerified>
      <main className="mx-auto min-h-screen max-w-5xl px-3 py-4 sm:px-4 sm:py-8">
        {/* User Info Section */}
        <section className="mb-8">
          <Card className="border-orange-200 dark:border-orange-900">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-amber-500 text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                        {user?.first_name} {user?.last_name}
                      </h2>
                      {isVerified ? (
                        <Badge
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Not Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={href("/")}>
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Home
                    </Button>
                  </Link>
                  {canCreateOrg && (
                    <CreateOrganizationModal>
                      <Button variant="gradient" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Organization
                      </Button>
                    </CreateOrganizationModal>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs Section */}
        <section>
          <Tabs value={selectedTab} onValueChange={handleTabChange}>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="organizations">
                  <Building2 className="mr-1 hidden h-4 w-4 sm:mr-2 sm:inline-block" />
                  Organizations
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1.5 py-0.5 text-xs sm:ml-2"
                  >
                    {orgCount}
                  </Badge>
                </TabsTrigger>

                <TabsTrigger value="invites">
                  <MailOpen className="mr-1 hidden h-4 w-4 sm:mr-2 sm:inline-block" />
                  Invitations
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1.5 py-0.5 text-xs sm:ml-2"
                  >
                    {inviteCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="inquiries">
                  <User className="mr-1 hidden h-4 w-4 sm:mr-2 sm:inline-block" />
                  Inquiries
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1.5 py-0.5 text-xs sm:ml-2"
                  >
                    {inquiryCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              {(() => {
                const refreshMap = {
                  organizations: {
                    refetch: refetchOrganizations,
                    fetching: organizationsFetching,
                  },
                  invites: {
                    refetch: refetchInvites,
                    fetching: invitesFetching,
                  },
                  inquiries: {
                    refetch: refetchInquiries,
                    fetching: inquiriesFetching,
                  },
                };
                const active = refreshMap[selectedTab];

                return (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => active.refetch()}
                    disabled={active.fetching}
                    className="self-start sm:self-auto"
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${active.fetching ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                );
              })()}
            </div>
            <TabsContent value="organizations">
              <OrganizationsTab />
            </TabsContent>
            <TabsContent value="inquiries">
              <InquiriesTab
                inquiries={inquiries ?? []}
                isLoading={inquiriesLoading}
                error={inquiriesError}
              />
            </TabsContent>
            <TabsContent value="invites">
              <InvitesTab />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </RouteGuard>
  );
}

function OrganizationsTab() {
  const { data: organizations, isLoading, error } = useMyOrganizations();
  const { canCreateOrg } = useAuthStore();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <p className="text-muted-foreground text-center">
            Failed to load organizations. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!organizations || organizations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No Organizations Yet</h3>
          <p className="text-muted-foreground mb-4 text-center">
            {canCreateOrg
              ? "Get started by creating your first organization."
              : "Submit an inquiry to create your first organization."}
          </p>
          {canCreateOrg ? (
            <CreateOrganizationModal>
              <Button variant="gradient">
                <Plus className="mr-2 h-4 w-4" />
                Create Organization
              </Button>
            </CreateOrganizationModal>
          ) : (
            <Link to={href("/inquiry")}>
              <Button variant="gradient">
                <Plus className="mr-2 h-4 w-4" />
                Submit Inquiry
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Your Organizations ({organizations.length})
        </h3>
        {canCreateOrg && (
          <CreateOrganizationModal>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </CreateOrganizationModal>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <OrganizationCard key={org.id} organization={org} />
        ))}
      </div>
    </div>
  );
}

type InquiriesTabProps = {
  inquiries: InquiryInterface[];
  isLoading: boolean;
  error: unknown;
};

function InquiriesTab({ inquiries, isLoading, error }: InquiriesTabProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <p className="text-muted-foreground text-center">
            Failed to load inquiries. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!inquiries || inquiries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <User className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No Inquiries Yet</h3>
          <p className="text-muted-foreground mb-4 text-center">
            You haven't submitted any organization onboarding inquiries.
          </p>
          <Link to={href("/inquiry")}>
            <Button variant="gradient">
              <Plus className="mr-2 h-4 w-4" />
              Submit Inquiry
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Your Inquiries ({inquiries.length})
        </h3>
        <Link to={href("/inquiry")}>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Submit New
          </Button>
        </Link>
      </div>
      <InquiriesTable inquiries={inquiries} />
    </div>
  );
}

function InvitesTab() {
  const { data: response, isLoading, error } = useMyInvites();

  const invites = response?.data ?? [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <p className="text-muted-foreground text-center">
            Failed to load invitations. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (invites.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MailOpen className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No Invitations</h3>
          <p className="text-muted-foreground text-center">
            You don't have any pending invitations to collaborate in
            organizations.
          </p>
        </CardContent>
      </Card>
    );
  }

  const pendingInvites = invites.filter(
    (inv) => !inv.is_used && new Date(inv.expiration_time) > new Date()
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Your Invitations ({invites.length})
          </h3>
          {pendingInvites.length > 0 && (
            <p className="text-muted-foreground text-sm">
              {pendingInvites.length} pending invitation
              {pendingInvites.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
      <InvitesTable invites={invites} />
    </div>
  );
}
