import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrganizationFormData } from "@/lib/schema/organization-schema";
import { organizationQueryKeys } from "./organization-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";

interface CreateOrganizationResponse {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  type: string;
  country: string;
  member_count: number;
  course_count: number;
  created_at: string;
  is_active: boolean;
}

// Create Organization Mutation
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createOrganization"],
    mutationFn: async (data: OrganizationFormData) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);

      if (data.logo) {
        formData.append("logo", data.logo);
      }

      const response = await apiClient.post<CreateOrganizationResponse>(
        "/api/organizations/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.myOrganizations(),
      });
      toast.success({
        message: `Organization "${data.name}" has been created successfully.`,
        description: "You can now manage your organization.",
      });
    },
    onError: (error) => {
      const errorMessage = extractError(error);

      toast.error({
        message: errorMessage,
        description:
          "Please try again or contact support if the issue persists.",
      });
    },
  });
};
