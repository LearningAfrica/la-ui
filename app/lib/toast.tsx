import { CheckCircle, Info, Loader, AlertTriangle, X } from "lucide-react";
import { createRoot, type Root } from "react-dom/client";

type ToastType = "success" | "error" | "warning" | "info" | "loading";

type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

type ToastOptions = {
  message: string;
  description?: string;
  duration?: number; // Duration in milliseconds, 0 means no auto-dismiss
  position?: ToastPosition; // Position on screen
};

type Toast = {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  position: ToastPosition;
};

const ToastContent = ({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) => {
  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
    },
    error: {
      icon: AlertTriangle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    loading: {
      icon: Loader,
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      iconColor: "text-gray-600",
      iconBg: "bg-gray-100",
    },
  };

  const config = configs[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 ${config.bgColor} ${config.borderColor} max-w-md min-w-[320px] rounded-lg border p-4 shadow-sm`}
    >
      <div className={`${config.iconBg} shrink-0 rounded-full p-1.5`}>
        <Icon
          className={`h-4 w-4 ${config.iconColor} ${toast.type === "loading" ? "animate-spin" : ""}`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-gray-900">{toast.message}</h3>
        {toast.description && (
          <p className="mt-0.5 text-xs text-gray-600">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

class ToastManager {
  private toasts: Toast[] = [];
  private containers: Map<ToastPosition, HTMLElement> = new Map();
  private roots: Map<ToastPosition, Root> = new Map();
  private readonly TOAST_DEFAULT_DURATION = 5000; //ms

  private getPositionClasses(position: ToastPosition): string {
    const baseClasses = "fixed flex flex-col gap-3 z-50";

    switch (position) {
      case "top-right":
        return `${baseClasses} top-6 right-6`;
      case "top-left":
        return `${baseClasses} top-6 left-6`;
      case "top-center":
        return `${baseClasses} top-6 left-1/2 transform -translate-x-1/2`;
      case "bottom-right":
        return `${baseClasses} bottom-6 right-6`;
      case "bottom-left":
        return `${baseClasses} bottom-6 left-6`;
      case "bottom-center":
        return `${baseClasses} bottom-6 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseClasses} top-6 right-6`;
    }
  }

  private ensureContainer(position: ToastPosition) {
    if (!this.containers.has(position)) {
      const container = document.createElement("div");
      container.className = this.getPositionClasses(position);
      container.style.zIndex = "9999";
      document.body.appendChild(container);

      const root = createRoot(container);

      this.containers.set(position, container);
      this.roots.set(position, root);
    }
  }

  private render() {
    // Group toasts by position
    const toastsByPosition = new Map<ToastPosition, Toast[]>();

    this.toasts.forEach((toast) => {
      if (!toastsByPosition.has(toast.position)) {
        toastsByPosition.set(toast.position, []);
      }
      toastsByPosition.get(toast.position)!.push(toast);
    });

    // Render toasts for each position
    toastsByPosition.forEach((toasts, position) => {
      this.ensureContainer(position);
      const root = this.roots.get(position);

      if (root) {
        // Reverse order for bottom positions so newest appears at bottom
        const orderedToasts = position.startsWith("bottom")
          ? [...toasts].reverse()
          : toasts;

        root.render(
          <div className="flex flex-col gap-3">
            {orderedToasts.map((toast) => (
              <ToastContent
                key={toast.id}
                toast={toast}
                onDismiss={() => this.dismiss(toast.id)}
              />
            ))}
          </div>
        );
      }
    });

    // Clean up empty containers
    this.containers.forEach((_, position) => {
      const positionToasts = toastsByPosition.get(position);
      if (!positionToasts || positionToasts.length === 0) {
        const root = this.roots.get(position);
        if (root) {
          root.render(<div className="flex flex-col gap-3"></div>);
        }
      }
    });
  }

  private addToast(type: ToastType, options: ToastOptions): string {
    const id = Math.random().toString(36).substring(2, 9);

    // Determine duration: custom duration, or default 4000ms for non-loading, 0 for loading
    const duration =
      options.duration !== undefined
        ? options.duration
        : type === "loading"
          ? 0
          : this.TOAST_DEFAULT_DURATION;

    // Default position is top-right
    const position = options.position || "top-right";

    const newToast: Toast = {
      id,
      type,
      message: options.message,
      description: options.description,
      position,
    };

    this.toasts.push(newToast);
    this.render();

    // Auto dismiss if duration > 0
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.render();
  }

  dismissAll() {
    this.toasts = [];
    this.render();
  }

  success(options: ToastOptions) {
    return this.addToast("success", options);
  }

  error(options: ToastOptions) {
    return this.addToast("error", options);
  }

  warning(options: ToastOptions) {
    return this.addToast("warning", options);
  }

  info(options: ToastOptions) {
    return this.addToast("info", options);
  }

  loading(options: ToastOptions) {
    return this.addToast("loading", options);
  }
}

// Create global instance
const toastManager = new ToastManager();

// Export simple functions that match the original useToast hook API
export const toast = {
  success: (options: ToastOptions) => toastManager.success(options),
  error: (options: ToastOptions) => toastManager.error(options),
  warning: (options: ToastOptions) => toastManager.warning(options),
  info: (options: ToastOptions) => toastManager.info(options),
  loading: (options: ToastOptions) => toastManager.loading(options),
  dismiss: (id?: string) => {
    if (id) {
      toastManager.dismiss(id);
    }
  },
  dismissAll: () => toastManager.dismissAll(),
};

export default toast;
