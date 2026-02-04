import { Suspense, useMemo } from "react";
import Loader from "../loaders/page-loader";
import AccessDenied from "./access-denied";
import { useAuthRole } from "@/stores/auth";
import type { UserRole } from "@/features/auth/mutations";

type Props = {
  children: React.ReactNode;
  roles?: UserRole[];
};

export default function PageGuard({ children, roles }: Props) {
  const role = useAuthRole();
  const hasAccess = useMemo(() => {
    if (!roles || roles.length === 0) return true; // No roles required, allow access

    return roles.some((r) => r === role);
  }, [roles, role]);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return <Suspense fallback={<Loader variant={"dots"} />}>{children}</Suspense>;
}
