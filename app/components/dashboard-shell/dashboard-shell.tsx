import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Props = {
  sidebar: React.ReactNode;
  /**
   * Render-prop for the topbar. Receives `onMenuClick` to wire the
   * mobile hamburger that toggles the sidebar drawer.
   */
  topbar: (ctx: { onMenuClick: () => void }) => React.ReactNode;
  className?: string;
};

export function DashboardShell({ sidebar, topbar, className }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const lastPath = useRef(location.pathname);

  // Close mobile drawer on navigation only — skip the initial render and any
  // effect run where the path hasn't actually changed. The guard prevents the
  // cascading-render loop the rule warns about.
  useEffect(() => {
    if (lastPath.current === location.pathname) return;

    lastPath.current = location.pathname;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "la-shell-bg text-la-ink flex h-screen w-full overflow-hidden font-sans",
        className
      )}
    >
      {/* Persistent sidebar at lg+ */}
      <div className="hidden lg:flex">{sidebar}</div>

      {/* Mobile/tablet drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="left"
          className="border-la-rule bg-la-paper w-[260px] p-0"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {sidebar}
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        {topbar({ onMenuClick: () => setDrawerOpen(true) })}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
