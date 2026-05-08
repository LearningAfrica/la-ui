import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { cn } from "@/lib/utils";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "auth-modal": {
      mode?: "sign-in" | "sign-up";
      /** Called once the user becomes authenticated. */
      onAuthSuccess?: () => void;
    };
  }
}

type Tab = "sign-in" | "sign-up";

export function AuthModal() {
  const modal = useAppModal("auth-modal");
  const [tab, setTab] = useState<Tab>(modal.data?.mode ?? "sign-in");
  const requestedMode = modal.data?.mode;

  // Sync tab when the open call requests a specific mode
  useEffect(() => {
    if (!modal.isOpen || !requestedMode) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTab(requestedMode);
  }, [modal.isOpen, requestedMode]);

  const handleSuccess = () => {
    const cb = modal.data?.onAuthSuccess;

    modal.close();

    if (cb) cb();
  };

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(next) => {
        if (!next) modal.close();
      }}
    >
      <DialogContent
        className="border-la-rule-strong bg-la-paper max-w-md gap-0 overflow-hidden rounded-md border p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          {tab === "sign-in" ? "Sign in" : "Create account"}
        </DialogTitle>

        <div className="border-la-rule flex items-center justify-between border-b px-5 py-3">
          <div className="flex gap-1">
            <TabButton
              active={tab === "sign-in"}
              onClick={() => setTab("sign-in")}
            >
              Sign in
            </TabButton>
            <TabButton
              active={tab === "sign-up"}
              onClick={() => setTab("sign-up")}
            >
              Sign up
            </TabButton>
          </div>
          <button
            type="button"
            onClick={modal.close}
            aria-label="Close"
            className="text-la-muted hover:text-la-ink hover:bg-la-cream grid size-8 place-items-center rounded transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-6 sm:px-7 sm:py-7">
          {tab === "sign-in" ? (
            <LoginForm onAuthSuccess={handleSuccess} />
          ) : (
            <RegisterForm onAuthSuccess={handleSuccess} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-display rounded px-3 py-1.5 text-[13px] font-medium transition-colors",
        active ? "bg-la-cream text-la-ink" : "text-la-muted hover:text-la-ink"
      )}
    >
      {children}
    </button>
  );
}
