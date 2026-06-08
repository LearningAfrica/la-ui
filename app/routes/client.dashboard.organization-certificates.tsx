import Award from "~icons/lucide/award";
import { OrgRoleGuard } from "@/components/auth/org-role-guard";
import { CertificatesTable } from "@/components/dashboard/certificates-table";
import { useOrganizationCertificates } from "@/features/certificates/certificate-queries";

export default function ClientDashboardOrganizationCertificates() {
  const { data, isLoading, error } = useOrganizationCertificates();

  return (
    <OrgRoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Award className="h-6 w-6" />
            Organization Certificates
          </h1>
          <p className="text-muted-foreground mt-1">
            All certificates issued across your organization&apos;s courses.
          </p>
        </div>
        <CertificatesTable
          certificates={data ?? []}
          isLoading={isLoading}
          error={error as Error | null}
        />
      </div>
    </OrgRoleGuard>
  );
}
