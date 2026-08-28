import moment from "moment";
import Award from "~icons/lucide/award";
import Download from "~icons/lucide/download";
import Eye from "~icons/lucide/eye";
import RefreshCw from "~icons/lucide/refresh-cw";
import Share2 from "~icons/lucide/share-2";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { toast } from "@/lib/toast";
import {
  resolveCertificateUrl,
  type Certificate,
} from "@/features/certificates/certificate-queries";

interface CertificatesTableProps {
  certificates: Certificate[];
  isLoading?: boolean;
  error?: Error | null;
}

async function openCertificate(url: string, download = false) {
  try {
    const response = await apiClient.get<Blob>(url, { responseType: "blob" });
    const objectUrl = URL.createObjectURL(response.data);

    if (download) {
      const anchor = document.createElement("a");

      anchor.href = objectUrl;
      anchor.download = "certificate.pdf";
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } else {
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    }
  } catch {
    toast.error({ message: "Could not open the certificate." });
  }
}

async function shareCertificate(certificate: Certificate) {
  if (!certificate.share_url) return;

  try {
    if (navigator.share) {
      await navigator.share({
        title: certificate.course_title ?? "Certificate",
        url: certificate.share_url,
      });
    } else {
      await navigator.clipboard.writeText(certificate.share_url);
      toast.success({ message: "Share link copied" });
    }
  } catch (error) {
    if ((error as DOMException)?.name !== "AbortError") {
      toast.error({ message: "Could not share the certificate." });
    }
  }
}

export function CertificatesTable({
  certificates,
  isLoading = false,
  error = null,
}: CertificatesTableProps) {
  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Learner
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Course
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Issued
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Certificate
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Loading certificates...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-destructive px-4 py-8 text-center"
                >
                  Error loading certificates: {error.message}
                </td>
              </tr>
            ) : certificates.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-muted-foreground px-4 py-8 text-center text-sm"
                >
                  No certificates issued yet.
                </td>
              </tr>
            ) : (
              certificates.map((cert) => {
                const pdfUrl = resolveCertificateUrl(cert.pdf_url);

                return (
                  <tr
                    key={cert.id}
                    className="hover:bg-muted/50 border-t transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Award className="text-muted-foreground h-4 w-4" />
                        <span className="font-medium">
                          {cert.learner_name ?? cert.learner}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {cert.course_title ?? cert.course}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {moment(cert.issued_at).format("MMM D, YYYY")}
                    </td>
                    <td className="px-4 py-3">
                      {pdfUrl ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openCertificate(pdfUrl)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openCertificate(pdfUrl, true)}
                          >
                            <Download className="mr-1 h-3 w-3" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!cert.share_url}
                            onClick={() => shareCertificate(cert)}
                          >
                            <Share2 className="mr-1 h-3 w-3" />
                            Share
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          {cert.certificate_id}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
