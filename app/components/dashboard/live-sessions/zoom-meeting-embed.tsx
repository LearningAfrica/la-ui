import { useEffect, useState } from "react";
import Loader2 from "~icons/lucide/loader-2";
import { useZoomCallJoinInfo } from "@/features/zoom-calls/zoom-call-queries";

// Client View must own a root outside the host React tree. Zoom bundles its own
// React runtime and mutates this node directly; rendering #zmmtg-root through
// React causes error #299 when an error or route change removes the container.
const ZOOM_VERSION = "6.2.0";
const ZOOM_CDN = `https://source.zoom.us/${ZOOM_VERSION}`;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-zoom="${src}"]`
    );

    if (existing?.dataset.loaded === "true") return resolve();

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error(`Failed to load ${src}`)),
        { once: true }
      );

      return;
    }

    const script = document.createElement("script");

    script.src = src;
    script.async = false;
    script.dataset.zoom = src;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      script.remove();
      reject(new Error(`Failed to load ${src}`));
    };
    document.head.appendChild(script);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadZoomMtg(): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hostWindow = window as any;

  if (hostWindow.ZoomMtg) return hostWindow.ZoomMtg;

  await loadScript(`${ZOOM_CDN}/lib/vendor/react.min.js`);
  await loadScript(`${ZOOM_CDN}/lib/vendor/react-dom.min.js`);
  await loadScript(`${ZOOM_CDN}/lib/vendor/redux.min.js`);
  await loadScript(`${ZOOM_CDN}/lib/vendor/redux-thunk.min.js`);
  await loadScript(`${ZOOM_CDN}/lib/vendor/react-redux.min.js`);
  await loadScript(`${ZOOM_CDN}/lib/vendor/lodash.min.js`);
  await loadScript(
    `https://source.zoom.us/zoom-meeting-${ZOOM_VERSION}.min.js`
  );

  if (!hostWindow.ZoomMtg) {
    throw new Error("Zoom could not load. Refresh the page and try again.");
  }

  return hostWindow.ZoomMtg;
}

function createZoomRoot(): HTMLDivElement {
  document.getElementById("zmmtg-root")?.remove();

  const root = document.createElement("div");

  root.id = "zmmtg-root";
  root.dataset.learningAfricaZoomRoot = "true";
  document.body.appendChild(root);

  return root;
}

function errorReason(value: unknown, fallback: string): string {
  if (!value || typeof value !== "object") return fallback;

  const candidate = value as {
    reason?: unknown;
    errorMessage?: unknown;
    errorCode?: unknown;
    result?: unknown;
    response?: { data?: { error?: string } };
  };

  if (candidate.response?.data?.error) return candidate.response.data.error;

  const nested = candidate.result;

  if (nested && typeof nested === "object") {
    return errorReason(nested, fallback);
  }

  const message = String(
    candidate.reason ??
      candidate.errorMessage ??
      (typeof nested === "string" ? nested : fallback)
  );

  return candidate.errorCode
    ? `${message} (Zoom code ${String(candidate.errorCode)})`
    : message;
}

export function ZoomMeetingEmbed({
  sessionId,
  leavePath,
}: {
  sessionId: string;
  leavePath: string;
}) {
  const { data, isLoading, error } = useZoomCallJoinInfo(sessionId, true);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(true);

  useEffect(() => {
    if (!data) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let zoom: any;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;
    const zoomRoot = createZoomRoot();

    const cleanup = () => {
      zoomRoot.remove();
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
    };

    (async () => {
      try {
        if (data.role === 1 && !data.zak) {
          throw new Error("Host authorization is missing. Please try again.");
        }

        const ZoomMtg = await loadZoomMtg();

        if (cancelled || !ZoomMtg) return;

        zoom = ZoomMtg;
        ZoomMtg.setZoomJSLib(`${ZOOM_CDN}/lib`, "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();

        const leaveUrl = new URL(leavePath, window.location.origin).toString();

        ZoomMtg.init({
          leaveUrl,
          leaveOnPageUnload: true,
          success: () => {
            if (cancelled) return;

            ZoomMtg.join({
              signature: data.signature,
              meetingNumber: data.meetingNumber,
              userName: data.userName,
              userEmail: data.userEmail,
              passWord: data.passWord ?? "",
              ...(data.zak ? { zak: data.zak } : {}),
              success: () => {
                if (!cancelled) setIsJoining(false);
              },
              error: (joinFailure: unknown) => {
                if (cancelled) return;

                zoomRoot.style.display = "none";
                window.setTimeout(cleanup, 500);
                setIsJoining(false);
                setJoinError(
                  errorReason(joinFailure, "Failed to join the meeting")
                );
              },
            });
          },
          error: (initializationFailure: unknown) => {
            if (cancelled) return;

            zoomRoot.style.display = "none";
            window.setTimeout(cleanup, 500);
            setIsJoining(false);
            setJoinError(
              errorReason(
                initializationFailure,
                "Failed to initialize the meeting"
              )
            );
          },
        });
      } catch (loadFailure) {
        if (cancelled) return;

        cleanup();
        setIsJoining(false);
        setJoinError(
          loadFailure instanceof Error
            ? loadFailure.message
            : "Failed to join the meeting"
        );
      }
    })();

    return () => {
      cancelled = true;

      try {
        zoom?.leaveMeeting?.({ success: cleanup, error: cleanup });
      } catch {
        cleanup();
      }

      window.setTimeout(cleanup, 500);
    };
  }, [data, leavePath]);

  if (error) {
    return (
      <div className="text-destructive flex h-[70vh] items-center justify-center text-sm">
        {errorReason(error, "Could not prepare the session. Please try again.")}
      </div>
    );
  }

  if (joinError) {
    return (
      <div className="text-destructive flex h-[70vh] flex-col items-center justify-center gap-1 px-4 text-center text-sm">
        <span>Could not join the Zoom session.</span>
        <span className="text-muted-foreground text-xs">{joinError}</span>
      </div>
    );
  }

  if (isLoading || isJoining) {
    return (
      <div className="text-muted-foreground flex h-[70vh] items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Preparing session…
      </div>
    );
  }

  return null;
}
