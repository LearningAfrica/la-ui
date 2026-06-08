export interface CertificateFilters {
  organization?: string;
  page?: number;
  page_size?: number;
}

export const certificateQueryKeys = {
  all: ["certificates"] as const,
  mine: (orgId?: string) =>
    [...certificateQueryKeys.all, "mine", orgId] as const,
  instructor: (orgId?: string) =>
    [...certificateQueryKeys.all, "instructor", orgId] as const,
  organization: (orgId?: string) =>
    [...certificateQueryKeys.all, "organization", orgId] as const,
};
