import { useState } from "react";
import LayoutDashboard from "~icons/lucide/layout-dashboard";
import LogOut from "~icons/lucide/log-out";
import Menu from "~icons/lucide/menu";
import X from "~icons/lucide/x";
import { Link, useNavigate } from "react-router";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth/auth-hooks";

import { LALogo } from "./la-logo";

const NAV_ITEMS = [
  { label: "Onboarding", to: "#onboarding" },
  { label: "Platform", to: "#platform" },
  { label: "Audiences", to: "#sectors" },
  { label: "Impact", to: "#impact" },
  { label: "How", to: "#how" },
];

type Props = {
  isAuthenticated?: boolean;
};

export function LandingHeader({ isAuthenticated }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const closeMobile = () => setMobileOpen(false);

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Account";
  const initials = (fullName || "LA")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const handleSignOut = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  return (
    <header className="border-la-rule bg-la-paper sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center px-5 md:px-10">
        <Link
          to="/"
          prefetch="intent"
          className="font-display text-la-ink flex items-center gap-2 text-[14px] font-semibold tracking-tight"
        >
          <LALogo />
          Learning Africa
        </Link>

        <nav className="font-display text-la-ink-2 ml-12 hidden items-center gap-7 text-[13px] font-medium md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.to}
              className="hover:text-la-ink transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account menu"
                  className="font-display bg-la-forest text-la-paper grid size-9 place-items-center rounded text-[12px] font-semibold hover:bg-(--color-la-forest-deep)"
                >
                  {initials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="border-la-rule bg-la-paper w-56 rounded border p-1"
              >
                <DropdownMenuLabel className="px-2 py-1.5">
                  <div className="font-display text-la-ink truncate text-[13px] font-semibold">
                    {fullName}
                  </div>
                  {user?.email && (
                    <div className="text-la-muted truncate text-[11px]">
                      {user.email}
                    </div>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-la-rule" />
                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard"
                    prefetch="intent"
                    className="text-la-ink-2 hover:bg-la-cream flex items-center gap-2 rounded px-2 py-1.5 text-[13px]"
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-la-rule" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-[13px] text-(--color-la-bad) hover:bg-(--color-la-bad)/10"
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                to="/sign-in"
                prefetch="intent"
                className="font-display text-la-ink hover:bg-la-cream hidden h-9 items-center rounded px-3 text-[13px] font-medium md:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                prefetch="intent"
                className="font-display bg-la-forest text-la-paper inline-flex h-9 items-center rounded px-3.5 text-[13px] font-medium transition-colors hover:bg-(--color-la-forest-deep)"
              >
                Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="text-la-ink-2 hover:bg-la-cream grid size-9 place-items-center rounded transition-colors md:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={cn("border-la-rule border-t md:hidden")}>
          <nav className="mx-auto flex max-w-[1280px] flex-col gap-1 px-5 py-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.to}
                onClick={() => setMobileOpen(false)}
                className="font-display text-la-ink-2 hover:bg-la-cream rounded px-3 py-2 text-[14px] font-medium"
              >
                {item.label}
              </a>
            ))}
            <div className="border-la-rule mt-2 flex flex-col gap-2 border-t pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    prefetch="intent"
                    onClick={() => setMobileOpen(false)}
                    className="font-display bg-la-forest text-la-paper rounded px-3 py-2 text-center text-[14px] font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="font-display border-la-rule rounded border px-3 py-2 text-center text-[14px] font-medium text-(--color-la-bad)"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/sign-in"
                    prefetch="intent"
                    onClick={closeMobile}
                    className="font-display text-la-ink border-la-rule flex-1 rounded border px-3 py-2 text-center text-[14px] font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/sign-up"
                    prefetch="intent"
                    onClick={closeMobile}
                    className="font-display bg-la-forest text-la-paper flex-1 rounded px-3 py-2 text-center text-[14px] font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
