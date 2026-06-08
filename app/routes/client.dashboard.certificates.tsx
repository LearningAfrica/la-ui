import moment from "moment";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Award from "~icons/lucide/award";
import Download from "~icons/lucide/download";
import Eye from "~icons/lucide/eye";
import {
  useMyCertificates,
  resolveCertificateUrl,
  type Certificate,
} from "@/features/certificates/certificate-queries";

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const pdfUrl = resolveCertificateUrl(certificate.pdf_url);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Award className="h-5 w-5 shrink-0 text-amber-500" />
          <span className="truncate">
            {certificate.course_title ?? "Certificate"}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <Badge variant="default" className="bg-amber-600 hover:bg-amber-700">
          {certificate.certificate_id}
        </Badge>
        <p className="text-muted-foreground text-xs">
          Issued {moment(certificate.issued_at).format("MMM D, YYYY")}
        </p>
      </CardContent>

      {pdfUrl ? (
        <CardFooter className="gap-2">
          <Button asChild variant="outline" className="flex-1">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              View
            </a>
          </Button>
          <Button asChild className="flex-1">
            <a href={pdfUrl} download>
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        </CardFooter>
      ) : (
        <CardFooter>
          <span className="text-muted-foreground text-xs">
            PDF is being prepared.
          </span>
        </CardFooter>
      )}
    </Card>
  );
}

export default function ClientDashboardCertificates() {
  const { data: certificates, isLoading } = useMyCertificates();

  const items = certificates ?? [];

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <p className="text-muted-foreground mt-1">
          View and download your earned certificates
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-24" />
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}
    </div>
  );
}
