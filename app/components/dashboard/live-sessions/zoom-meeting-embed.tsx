import { useEffect, useState } from "react";
import Loader2 from "~icons/lucide/loader-2";
import { useZoomCallJoinInfo } from "@/features/zoom-calls/zoom-call-queries";

// Ported from the working zoom-x reference: load Zoom's Client View (`ZoomMtg`)
// from Zoom's CDN <script> tags instead of importing the npm package. The npm
// bundle computes its asset publicPath from `document.currentScript`, which is
// null inside a Vite ESM build ("Automatic publicPath is not supported"). The
// CDN bundle also ships Zoom's own React, so it never touches the host app's
// React 19. Version must match the installed @zoom/meetingsdk (6.1.0).
const ZOOM_VERSION = "6.1.0";
const ZOOM_CDN = `https://source.zoom.us/${ZOOM_VERSION}`;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-zoom="${src}"]`)) return resolve();

    const s = document.createElement("script");

    s.src = src;
    s.async = false; // preserve execution order
    s.dataset.zoom = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadZoomMtg(): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;

  if (w.ZoomMtg) return w.ZoomMtg;

  // Order matters: vendor deps first, then the main SDK.
  await loadScript(`${ZOOM_CDN}/lib/vendor/react.min.js`);
  await loadScript(`${ZOOM_CDN}/lib/vendor/react-dom.min.js`);
  await loadScript(`${ZOOM_CDN}/lib/vendor/redux.min.js`);
  await loadScript(`${ZOOM_CDN}/lib/vendor/redux-thunk.min.js`);
  await loadScript(`${ZOOM_CDN}/lib/vendor/lodash.min.js`);
  await loadScript(`${ZOOM_CDN}/zoom-meeting-${ZOOM_VERSION}.min.js`);

  return w.ZoomMtg;
}

export function ZoomMeetingEmbed({ sessionId }: { sessionId: string }) {
  const { data, isLoading, error } = useZoomCallJoinInfo(sessionId, true);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let zoom: any;

    (async () => {
      try {
        const ZoomMtg = await loadZoomMtg();

        if (cancelled || !ZoomMtg) return;

        zoom = ZoomMtg;
        ZoomMtg.setZoomJSLib(`${ZOOM_CDN}/lib`, "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();

        const leaveUrl = data.leaveUrl || window.location.origin;

        ZoomMtg.init({
          leaveUrl,
          success: () => {
            ZoomMtg.join({
              sdkKey: data.sdkKey,
              signature: data.signature,
              meetingNumber: data.meetingNumber,
              userName: data.userName,
              userEmail: data.userEmail,
              passWord: data.passWord ?? "",
              success: () => {},
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              error: (e: any) => {
                if (!cancelled)
                  setJoinError(
                    String(e?.reason ?? "Failed to join the meeting")
                  );
              },
            });
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error: (e: any) => {
            if (!cancelled)
              setJoinError(
                String(e?.reason ?? "Failed to initialize the meeting")
              );
          },
        });
      } catch (e) {
        if (!cancelled)
          setJoinError(
            e instanceof Error ? e.message : "Failed to join the meeting"
          );
      }
    })();

    return () => {
      cancelled = true;

      try {
        zoom?.leaveMeeting?.();
      } catch {
        /* not in a meeting */
      }
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-[70vh] items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Preparing session…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive flex h-[70vh] items-center justify-center text-sm">
        Could not load session credentials. Try refreshing the page.
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

  return <div id="zmmtg-root" />;
}
