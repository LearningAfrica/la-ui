import Award from "~icons/lucide/award";
import { OrgRoleGuard } from "@/components/auth/org-role-guard";
import { CertificatesTable } from "@/components/dashboard/certificates-table";
import { useInstructorCertificates } from "@/features/certificates/certificate-queries";

export default function ClientDashboardInstructorCertificates() {
  const { data, isLoading, error } = useInstructorCertificates();

  return (
    <OrgRoleGuard allowedRoles={["admin", "instructor"]}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Award className="h-6 w-6" />
            Issued Certificates
          </h1>
          <p className="text-muted-foreground mt-1">
            Certificates issued to learners for your courses.
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
