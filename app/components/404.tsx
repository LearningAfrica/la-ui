import React from "react";
import ComponentTransition from "./transitions/page-transition";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useAuthStore } from "@/stores/auth/auth-store";
import { href, Link } from "react-router";
import { AlertTriangle } from "lucide-react";
import { Separator } from "./ui/separator";

export default function NotFoundComponent() {
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const link = authenticated ? href("/dashboard") : "/";

  return (
    <ComponentTransition variant="slideUp" className="">
      <div className="flex h-screen items-center justify-center">
        <Empty className="w-fit max-w-md border shadow">
          <EmptyHeader>
            <EmptyMedia>
              <AlertTriangle className="text-muted-foreground size-20" />
            </EmptyMedia>
            <EmptyTitle>404 - Page Not Found</EmptyTitle>
            <EmptyDescription>
              The page you are looking for does not exist. Go back to{" "}
              <Separator className="my-2" />
              <Link to={link} className="text-primary capitalize underline">
                home page
              </Link>
              .
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </ComponentTransition>
  );
}
