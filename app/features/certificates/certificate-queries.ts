import { useQuery } from "@tanstack/react-query";
import { apiClient, createMediaUrl } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { certificateQueryKeys } from "./certificate-query-keys";

export interface Certificate {
  id: string;
  certificate_id: string;
  course: string;
  course_title?: string;
  learner: string;
  learner_name?: string;
  learner_email?: string;
  issued_at: string;
  pdf_url: string | null;
}

/**
 * Resolve a certificate PDF URL. The backend may return an absolute URL
 * (`pdf_url`) or a media-relative path; prepend the API base only for the
 * latter.
 */
export function resolveCertificateUrl(pdfUrl: string | null): string | null {
  if (!pdfUrl) return null;

  if (/^https?:\/\//i.test(pdfUrl)) return pdfUrl;

  return createMediaUrl(pdfUrl);
}

type CertResponse = Paginated<Certificate> | Certificate[];

function toList(body: CertResponse): Certificate[] {
  return Array.isArray(body) ? body : (body?.data ?? []);
}

function useCertList(
  endpoint: string,
  keyFn: (orgId?: string) => readonly unknown[],
  requireOrg: boolean
) {
  const { selectedOrganization } = useOrganizationStore();
  const organization = selectedOrganization?.id;

  return useQuery({
    queryKey: keyFn(organization),
    queryFn: async () => {
      const response = await apiClient.get<CertResponse>(endpoint, {
        params: { organization },
      });

      return toList(response.data);
    },
    enabled: requireOrg ? !!organization : true,
  });
}

export const useMyCertificates = () =>
  useCertList("/api/my-certificates/", certificateQueryKeys.mine, false);

export const useInstructorCertificates = () =>
  useCertList(
    "/api/instructor-certificates/",
    certificateQueryKeys.instructor,
    true
  );

export const useOrganizationCertificates = () =>
  useCertList(
    "/api/organization-certificates/",
    certificateQueryKeys.organization,
    true
  );
