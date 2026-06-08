import { useEffect, useRef, useEffectEvent } from "react";
import Loader2 from "~icons/lucide/loader-2";
import {
  useZoomCallJoinInfo,
  type ZoomCallJoinInfo,
} from "@/features/zoom-calls/zoom-call-queries";

/**
 * Embeds a Zoom meeting in-app using the Meeting SDK Component View.
 * Component View renders into a provided <div>; it does not hijack the DOM
 * the way Client View (#zmmtg-root) does, so it composes with the SPA shell.
 */
export function ZoomMeetingEmbed({ sessionId }: { sessionId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const { data, isLoading, error } = useZoomCallJoinInfo(sessionId, true);

  const startMeeting = useEffectEvent(async (info: ZoomCallJoinInfo) => {
    if (startedRef.current || !containerRef.current) return;

    startedRef.current = true;

    // Dynamic import keeps the heavy SDK out of the main bundle and off SSR.
    const { default: ZoomMtgEmbedded } =
      await import("@zoom/meetingsdk/embedded");
    const client = ZoomMtgEmbedded.createClient();

    await client.init({
      zoomAppRoot: containerRef.current,
      language: "en-US",
      patchJsMedia: true,
    });

    await client.join({
      sdkKey: info.sdk_key,
      signature: info.signature,
      meetingNumber: info.meeting_number,
      password: info.password,
      userName: info.user_name,
      userEmail: info.user_email,
    });
  });

  useEffect(() => {
    if (data) startMeeting(data);
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

  return <div ref={containerRef} className="h-[80vh] w-full" />;
}
