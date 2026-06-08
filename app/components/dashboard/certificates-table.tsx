import moment from "moment";
import Award from "~icons/lucide/award";
import Download from "~icons/lucide/download";
import Eye from "~icons/lucide/eye";
import RefreshCw from "~icons/lucide/refresh-cw";
import { Button } from "@/components/ui/button";
import {
  resolveCertificateUrl,
  type Certificate,
} from "@/features/certificates/certificate-queries";

interface CertificatesTableProps {
  certificates: Certificate[];
  isLoading?: boolean;
  error?: Error | null;
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
                          <Button asChild size="sm" variant="outline">
                            <a
                              href={pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </a>
                          </Button>
                          <Button asChild size="sm" variant="ghost">
                            <a href={pdfUrl} download>
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </a>
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
