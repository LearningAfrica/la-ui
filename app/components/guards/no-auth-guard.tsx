import { useAuthStore } from "@/stores/auth/auth-store";
import { Navigate, useSearchParams } from "react-router";

type NoAuthGuardProps = {
  children: React.ReactNode;
};

export default function NoAuthGuard({ children }: NoAuthGuardProps) {
  const [searchParams] = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const redirect = searchParams.get("_redirect");
  const redirectUrl = decodeURIComponent(redirect || "/dashboard");

  if (isAuthenticated) {
    return <Navigate to={redirectUrl} replace />;
  }

  return <>{children}</>;
}
