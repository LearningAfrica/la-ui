import type { LoginOrganization } from "@/features/auth/auth-mutations";
import type { MyOrganization } from "./organization-queries";

/**
 * Turn the slim organization info that rides along with the login response
 * into the richer shape that the rest of the app reads. Unknown fields are
 * stubbed to empty/neutral values and get upgraded once
 * `GET /api/organizations/mine/` lands in the cache.
 */
export function loginOrganizationToMyOrganization(
  org: LoginOrganization
): MyOrganization {
  return {
    id: org.id,
    name: org.name,
    description: "",
    logo_url: null,
    logo: null,
    is_active: org.is_active,
    date_joined: "",
    role: org.role,
    created_at: "",
  };
}
