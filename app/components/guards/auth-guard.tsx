import { useAuthStore } from "@/stores/auth/auth-store";
import React from "react";
import { Navigate, useLocation } from "react-router";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathName = useLocation().pathname;
  const redirectUrl = encodeURIComponent(pathName);

  if (!isAuthenticated) {
    return <Navigate to={`/?_redirect=${redirectUrl}`} replace />;
  }

  return <>{children}</>;
}
