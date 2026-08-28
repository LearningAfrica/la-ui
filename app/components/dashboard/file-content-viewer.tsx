import { useEffect, useMemo, useState } from "react";
import Download from "~icons/lucide/download";
import Eye from "~icons/lucide/eye";
import File from "~icons/lucide/file";
import Loader2 from "~icons/lucide/loader-2";
import X from "~icons/lucide/x";
import { Button } from "@/components/ui/button";
import {
  useModuleContentFile,
  type ModuleContent,
} from "@/features/module-contents/module-content-queries";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";

type PreviewKind = "image" | "pdf" | "text" | "video" | "audio" | "none";

const previewExtensions: Record<Exclude<PreviewKind, "none">, string[]> = {
  image: ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"],
  pdf: ["pdf"],
  text: ["txt", "csv", "json", "md", "log", "xml"],
  video: ["mp4", "webm", "ogv"],
  audio: ["mp3", "wav", "ogg", "m4a", "aac"],
};

function getPreviewKind(fileName: string): PreviewKind {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";

  for (const [kind, extensions] of Object.entries(previewExtensions)) {
    if (extensions.includes(extension)) return kind as PreviewKind;
  }

  return "none";
}

function formatTextContent(content: string, fileName: string) {
  if (!fileName.toLowerCase().endsWith(".json")) return content;

  try {
    return JSON.stringify(JSON.parse(content), null, 2);
  } catch {
    return content;
  }
}

function TextFilePreview({ blob, fileName }: { blob: Blob; fileName: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    blob
      .text()
      .then((text) => {
        if (!cancelled) {
          setContent(formatTextContent(text, fileName));
          setHasError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [blob, fileName]);

  if (hasError) {
    return (
      <div className="p-6 text-center text-sm text-red-700">
        The text content could not be decoded. You can still download the file.
      </div>
    );
  }

  if (content === null) {
    return (
      <div className="flex min-h-64 items-center justify-center bg-white text-slate-700">
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing text preview…
        </div>
      </div>
    );
  }

  return (
    <pre className="min-h-64 bg-white p-5 font-mono text-sm leading-6 break-words whitespace-pre-wrap text-slate-950 selection:bg-blue-200">
      {content || "This file is empty."}
    </pre>
  );
}

function saveBlob(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}

interface FileContentViewerProps {
  content: ModuleContent;
  coursePk: string;
  modulePk: string;
}

export function FileContentViewer({
  content,
  coursePk,
  modulePk,
}: FileContentViewerProps) {
  const fileName =
    content.data.file_name ||
    content.data.file?.split("/").pop()?.split("?")[0] ||
    "lesson-attachment";
  const previewKind = useMemo(() => getPreviewKind(fileName), [fileName]);
  const canPreview = previewKind !== "none";
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const {
    data: previewBlob,
    isLoading,
    isError,
    refetch,
  } = useModuleContentFile(
    coursePk,
    modulePk,
    content.id,
    canPreview && isPreviewOpen
  );

  useEffect(() => {
    if (!isPreviewOpen || !previewBlob) {
      setPreviewUrl("");

      return;
    }

    const objectUrl = URL.createObjectURL(previewBlob);

    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [isPreviewOpen, previewBlob]);

  const downloadFile = async () => {
    setIsDownloading(true);

    try {
      const response = await apiClient.get<Blob>(
        `/api/courses/${coursePk}/modules/${modulePk}/contents/${content.id}/file/`,
        {
          params: { download: 1 },
          responseType: "blob",
        }
      );

      saveBlob(response.data, fileName);
    } catch {
      toast.error({
        message: "The file could not be downloaded.",
        description: "Please try again or contact your course administrator.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 flex flex-wrap items-center gap-4 rounded-xl border p-5">
        <File className="text-muted-foreground h-10 w-10 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{fileName}</p>
          <p className="text-muted-foreground text-sm">
            {canPreview
              ? "Preview this lesson attachment below or download a copy."
              : "This file format is available for download."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen((open) => !open)}
            >
              {isPreviewOpen ? (
                <X className="mr-1.5 h-3.5 w-3.5" />
              ) : (
                <Eye className="mr-1.5 h-3.5 w-3.5" />
              )}
              {isPreviewOpen ? "Close file" : "Open file"}
            </Button>
          )}
          <Button size="sm" onClick={downloadFile} disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="mr-1.5 h-3.5 w-3.5" />
            )}
            Download
          </Button>
        </div>
      </div>

      {canPreview && isPreviewOpen && (
        <section className="overflow-hidden rounded-xl border shadow-sm">
          <div className="bg-muted/50 flex items-center justify-between gap-4 border-b px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold">File preview</p>
              <p className="text-muted-foreground truncate text-xs">
                {fileName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewOpen(false)}
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              Close
            </Button>
          </div>
          <div className="bg-background max-h-[72vh] min-h-64 overflow-auto">
            {isLoading && (
              <div className="flex min-h-64 items-center justify-center">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading file preview…
                </div>
              </div>
            )}

            {isError && (
              <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/60 dark:bg-red-950/30">
                <p className="font-medium text-red-700 dark:text-red-300">
                  The file preview could not be loaded.
                </p>
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  You can retry the preview or download the file directly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => void refetch()}
                >
                  Retry preview
                </Button>
              </div>
            )}

            {previewUrl && previewKind === "image" && (
              <div className="p-4">
                <img
                  src={previewUrl}
                  alt={fileName}
                  className="mx-auto max-w-full object-contain"
                />
              </div>
            )}

            {previewUrl && previewKind === "pdf" && (
              <iframe
                src={previewUrl}
                title={fileName}
                className="h-[70vh] min-h-96 w-full bg-white"
              />
            )}

            {previewBlob && previewKind === "text" && (
              <TextFilePreview blob={previewBlob} fileName={fileName} />
            )}

            {previewUrl && previewKind === "video" && (
              <div className="bg-black">
                <video
                  src={previewUrl}
                  controls
                  className="max-h-[70vh] w-full"
                >
                  Your browser does not support video playback.
                </video>
              </div>
            )}

            {previewUrl && previewKind === "audio" && (
              <div className="p-5">
                <audio src={previewUrl} controls className="w-full">
                  Your browser does not support audio playback.
                </audio>
              </div>
            )}
          </div>
        </section>
      )}

      {!canPreview && (
        <div className="bg-muted/30 rounded-xl border border-dashed p-8 text-center">
          <File className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
          <p className="font-medium">Browser preview unavailable</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Download the file and open it with a compatible application.
          </p>
        </div>
      )}
    </div>
  );
}
