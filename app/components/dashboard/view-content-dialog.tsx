import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, File, ExternalLink } from "lucide-react";
import { useAppModal } from "@/stores/filters/modal-hooks";
import type { ModuleContent } from "@/features/module-contents/module-content-queries";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "view-content": ModuleContent | undefined;
  }
}

const typeIcons = {
  text: FileText,
  video: Video,
  file: File,
} as const;

export function ViewContentDialog() {
  const modal = useAppModal("view-content");
  const content = modal.data;

  const Icon = content
    ? (typeIcons[content.content_type] ?? FileText)
    : FileText;

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(v) => {
        if (!v) modal.close();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {content?.title ?? "Content Details"}
          </DialogTitle>
          <DialogDescription>Content details and preview.</DialogDescription>
        </DialogHeader>

        {content && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge>{content.content_type}</Badge>
              <Badge variant="outline">Order: {content.order}</Badge>
            </div>

            {content.content_type === "text" && content.data.body && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Body</p>
                <div
                  className="bg-muted max-h-60 overflow-auto rounded-md p-3 text-sm"
                  dangerouslySetInnerHTML={{ __html: content.data.body }}
                />
              </div>
            )}

            {content.content_type === "video" && (
              <div className="space-y-3">
                {content.data.video_url && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Video URL</p>
                    <a
                      href={content.data.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      {content.data.video_url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {content.data.duration_seconds != null && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-muted-foreground text-sm">
                      {Math.floor(content.data.duration_seconds / 60)}m{" "}
                      {content.data.duration_seconds % 60}s
                    </p>
                  </div>
                )}
              </div>
            )}

            {content.content_type === "file" && (
              <div className="space-y-1">
                <p className="text-sm font-medium">File</p>
                <p className="text-muted-foreground text-sm">
                  {content.data.file_name ?? "Unknown file"}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-sm font-medium">Created</p>
              <p className="text-muted-foreground text-sm">
                {new Date(content.data.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => modal.close()}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
