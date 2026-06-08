import { redirect, type LoaderFunctionArgs } from "react-router";
import { orgRoutes } from "@/lib/utils/org-routes";

export function loader({ params }: LoaderFunctionArgs) {
  const orgId = params.orgId ?? "";

  return redirect(orgRoutes.courses(orgId));
}

export default function ClientDashboardMyCourses() {
  return null;
}
