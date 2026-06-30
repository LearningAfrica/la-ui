import { useState } from "react";
import moment from "moment";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import Award from "~icons/lucide/award";
import Download from "~icons/lucide/download";
import Eye from "~icons/lucide/eye";
import Loader2 from "~icons/lucide/loader-2";
import { toast } from "@/lib/toast";
import { apiClient } from "@/lib/api";
import {
  useMyCertificates,
  useCertificatePdfUrl,
  resolveCertificateUrl,
  type Certificate,
} from "@/features/certificates/certificate-queries";

// Hide the native PDF chrome so the embed reads as a thumbnail/preview.
const PDF_VIEW = "#toolbar=0&navpanes=0&scrollbar=0&view=Fit";

function certFileName(c: Certificate) {
  const base = (c.course_title ?? "certificate").replace(/[^\w-]+/g, "-");

  return `${base}-${c.certificate_id}.pdf`;
}

async function downloadCertificate(c: Certificate, url: string) {
  const id = toast.loading({ message: "Preparing download…" });

  try {
    const res = await apiClient.get<Blob>(url, { responseType: "blob" });
    const href = URL.createObjectURL(res.data);
    const a = document.createElement("a");

    a.href = href;
    a.download = certFileName(c);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
    toast.dismiss(id);
    toast.success({ message: "Certificate downloaded" });
  } catch {
    toast.dismiss(id);
    toast.error({
      message: "Download failed",
      description: "Could not download the certificate. Try again.",
    });
  }
}

// Renders the PDF from a same-origin blob URL (fetched via apiClient) so the
// iframe carries no auth/cross-origin concerns of its own.
function PdfFrame({
  pdfUrl,
  title,
  thumbnail,
  className,
}: {
  pdfUrl: string;
  title: string;
  thumbnail?: boolean;
  className?: string;
}) {
  const { data: blobUrl, isLoading, isError } = useCertificatePdfUrl(pdfUrl);

  if (isError) {
    return (
      <div className="text-destructive flex h-full w-full items-center justify-center p-4 text-center text-xs">
        Couldn’t load the certificate PDF.
      </div>
    );
  }

  if (isLoading || !blobUrl) {
    return thumbnail ? (
      <Skeleton className="h-full w-full rounded-none" />
    ) : (
      <div className="text-muted-foreground flex h-full w-full items-center justify-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading preview…
      </div>
    );
  }

  return (
    <iframe
      src={`${blobUrl}${PDF_VIEW}`}
      title={title}
      tabIndex={thumbnail ? -1 : undefined}
      className={className}
    />
  );
}

function CertificateCard({
  certificate,
  onPreview,
}: {
  certificate: Certificate;
  onPreview: (c: Certificate) => void;
}) {
  const pdfUrl = resolveCertificateUrl(certificate.pdf_url);

  return (
    <Card className="flex flex-col overflow-hidden pt-0">
      {pdfUrl ? (
        <button
          type="button"
          onClick={() => onPreview(certificate)}
          className="group bg-muted focus-visible:ring-ring relative block aspect-[1.414/1] w-full overflow-hidden border-b focus-visible:ring-2 focus-visible:outline-none"
          aria-label={`Preview ${certificate.course_title ?? "certificate"}`}
        >
          <div className="pointer-events-none absolute inset-0">
            <PdfFrame
              pdfUrl={pdfUrl}
              title={certificate.course_title ?? "Certificate"}
              thumbnail
              className="h-full w-full"
            />
          </div>
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
            <span className="bg-background text-foreground inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium shadow">
              <Eye className="h-4 w-4" />
              Preview
            </span>
          </span>
        </button>
      ) : (
        <div className="bg-muted text-muted-foreground flex aspect-[1.414/1] w-full flex-col items-center justify-center gap-2 border-b text-xs">
          <Award className="h-8 w-8 opacity-40" />
          PDF is being prepared
        </div>
      )}

      <CardContent className="flex-1 space-y-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Award className="h-4 w-4 shrink-0 text-amber-500" />
          <span className="min-w-0 truncate">
            {certificate.course_title ?? "Certificate"}
          </span>
        </h3>
        <Badge
          variant="secondary"
          className="max-w-full truncate font-mono text-xs"
        >
          {certificate.certificate_id}
        </Badge>
        <p className="text-muted-foreground text-xs">
          Issued {moment(certificate.issued_at).format("MMM D, YYYY")}
        </p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="outline"
          className="flex-1"
          disabled={!pdfUrl}
          onClick={() => pdfUrl && onPreview(certificate)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        <Button
          className="flex-1"
          disabled={!pdfUrl}
          onClick={() => pdfUrl && downloadCertificate(certificate, pdfUrl)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ClientDashboardCertificates() {
  const { data: certificates, isLoading } = useMyCertificates();
  const [preview, setPreview] = useState<Certificate | null>(null);

  const items = certificates ?? [];
  const previewUrl = preview ? resolveCertificateUrl(preview.pdf_url) : null;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <p className="text-muted-foreground mt-1">
          Preview and download your earned certificates
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden pt-0">
              <Skeleton className="aspect-[1.414/1] w-full rounded-none" />
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-12 text-sm">
              <Award className="h-10 w-10 opacity-40" />
              <p>
                No certificates yet. Complete a course to earn your first
                certificate.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {items.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onPreview={setPreview}
            />
          ))}
        </div>
      )}

      <Sheet
        open={!!preview}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <SheetContent
          side="bottom"
          className="flex h-[80vh] flex-col gap-4 p-4 sm:p-6"
        >
          <SheetHeader className="p-0">
            <SheetTitle className="truncate">
              {preview?.course_title ?? "Certificate"}
            </SheetTitle>
          </SheetHeader>
          {previewUrl ? (
            <div className="min-h-0 w-full flex-1 overflow-hidden rounded-md border">
              <PdfFrame
                pdfUrl={previewUrl}
                title="Certificate preview"
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
              Preview unavailable.
            </div>
          )}
          {preview && previewUrl && (
            <SheetFooter className="p-0">
              <Button
                className="w-full sm:w-auto"
                onClick={() => downloadCertificate(preview, previewUrl)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
