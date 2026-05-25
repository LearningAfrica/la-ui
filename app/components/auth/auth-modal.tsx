import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAppModal } from "@/stores/filters/modal-hooks";

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

        <div className="flex justify-end px-3 pt-3">
          <button
            type="button"
            onClick={modal.close}
            aria-label="Close"
            className="text-la-muted hover:text-la-ink hover:bg-la-cream grid size-8 place-items-center rounded transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 pt-2 pb-6 sm:px-7 sm:pb-7">
          {tab === "sign-in" ? (
            <LoginForm
              onAuthSuccess={handleSuccess}
              onSwitchAuthMode={() => setTab("sign-up")}
            />
          ) : (
            <RegisterForm
              onAuthSuccess={handleSuccess}
              onSwitchAuthMode={() => setTab("sign-in")}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
