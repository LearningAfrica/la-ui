import { useState } from 'react';
import {
  ArrowLeft,
  Award,
  Calendar,
  Check,
  Copy,
  Download,
  ExternalLink,
  QrCode,
  Share2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Link, useParams } from 'react-router-dom';

// Mock certificate data
const certificates = [
  {
    id: 'cert-1',
    title: 'JavaScript Fundamentals',
    courseId: 'course-1',
    courseName: 'JavaScript Fundamentals',
    issueDate: '2023-10-15',
    expiryDate: '2026-10-15',
    instructor: 'Jane Doe',
    grade: 'A',
    score: 95,
    imageUrl: '/elegant-achievement-certificate.png',
    status: 'valid',
    credentialId: 'JS-FUND-2023-001',
    description:
      'This certificate verifies that the student has successfully completed the JavaScript Fundamentals course, demonstrating proficiency in core JavaScript concepts including variables, data types, functions, objects, arrays, and basic DOM manipulation.',
    skills: [
      'JavaScript',
      'ES6',
      'DOM Manipulation',
      'Asynchronous Programming',
      'Error Handling',
    ],
    qrCodeUrl: '/abstract-qr-code.png',
    verificationUrl: 'https://example.com/verify/JS-FUND-2023-001',
  },
  {
    id: 'cert-2',
    title: 'React Development',
    courseId: 'course-2',
    courseName: 'React Development Masterclass',
    issueDate: '2023-11-20',
    expiryDate: '2026-11-20',
    instructor: 'John Smith',
    grade: 'A-',
    score: 92,
    imageUrl: '/abstract-geometric-certificate.png',
    status: 'valid',
    credentialId: 'REACT-DEV-2023-042',
    description:
      'This certificate verifies that the student has successfully completed the React Development Masterclass, demonstrating proficiency in building modern web applications using React, including components, state management, hooks, and integration with APIs.',
    skills: [
      'React',
      'JSX',
      'Hooks',
      'State Management',
      'API Integration',
      'Component Design',
    ],
    qrCodeUrl: '/abstract-qr-code.png',
    verificationUrl: 'https://example.com/verify/REACT-DEV-2023-042',
  },
  {
    id: 'cert-3',
    title: 'UX Design Principles',
    courseId: 'course-3',
    courseName: 'UX Design Principles',
    issueDate: '2023-09-05',
    expiryDate: '2026-09-05',
    instructor: 'Sarah Johnson',
    grade: 'B+',
    score: 88,
    imageUrl: '/clean-achievement-award.png',
    status: 'valid',
    credentialId: 'UX-DESIGN-2023-103',
    description:
      'This certificate verifies that the student has successfully completed the UX Design Principles course, demonstrating understanding of user-centered design, wireframing, prototyping, usability testing, and design thinking methodologies.',
    skills: [
      'UX Design',
      'Wireframing',
      'Prototyping',
      'Usability Testing',
      'User Research',
    ],
    qrCodeUrl: '/abstract-qr-code.png',
    verificationUrl: 'https://example.com/verify/UX-DESIGN-2023-103',
  },
  {
    id: 'cert-4',
    title: 'Data Science Fundamentals',
    courseId: 'course-4',
    courseName: 'Introduction to Data Science',
    issueDate: '2023-08-12',
    expiryDate: '2026-08-12',
    instructor: 'Michael Brown',
    grade: 'A+',
    score: 98,
    imageUrl: '/personal-authentication.png',
    status: 'valid',
    credentialId: 'DATA-SCI-2023-027',
    description:
      'This certificate verifies that the student has successfully completed the Introduction to Data Science course, demonstrating proficiency in data analysis, visualization, statistical methods, and basic machine learning concepts.',
    skills: [
      'Data Analysis',
      'Python',
      'Statistics',
      'Data Visualization',
      'Machine Learning Basics',
    ],
    qrCodeUrl: '/abstract-qr-code.png',
    verificationUrl: 'https://example.com/verify/DATA-SCI-2023-027',
  },
];

export default function StudentCertificateDetailPage() {
  // const _router = useNavigate();
  const [copied, setCopied] = useState(false);
  const params = useParams<{
    id: string;
  }>();
  // Find certificate by ID
  const certificate = certificates.find((cert) => cert.id === params.id);

  if (!certificate) {
    return (
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/student/certificates">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Certificates
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="text-muted-foreground mb-4 h-12 w-12" />
            <h2 className="mb-2 text-xl font-semibold">
              Certificate Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The requested certificate could not be found.
            </p>
            <Button asChild>
              <Link to="/dashboard/student/certificates">
                Return to Certificates
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    // In a real app, this would trigger a download of the certificate
    toast.success('Certificate download started');
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    toast.success('Share dialog opened');
  };

  const copyCredentialId = () => {
    navigator.clipboard.writeText(certificate.credentialId);
    setCopied(true);
    toast.success('Credential ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const copyVerificationUrl = () => {
    navigator.clipboard.writeText(certificate.verificationUrl);
    toast.success('Verification URL copied to clipboard');
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/student/certificates">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Certificates
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {certificate.title}
                  </CardTitle>
                  <CardDescription className="mt-1 text-base">
                    {certificate.courseName}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  Grade: {certificate.grade}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6 aspect-[1.4/1] w-full overflow-hidden rounded-md border">
                <img
                  src={certificate.imageUrl || '/placeholder.svg'}
                  alt={certificate.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium">Description</h3>
                  <p className="text-muted-foreground text-sm">
                    {certificate.description}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {certificate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Certificate
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Credential ID
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">
                    {certificate.credentialId}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={copyCredentialId}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span className="sr-only">Copy credential ID</span>
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Issue Date</div>
                <div className="flex items-center">
                  <Calendar className="text-muted-foreground mr-1.5 h-3.5 w-3.5" />
                  <span className="text-sm font-medium">
                    {new Date(certificate.issueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Expiry Date</div>
                <div className="flex items-center">
                  <Calendar className="text-muted-foreground mr-1.5 h-3.5 w-3.5" />
                  <span className="text-sm font-medium">
                    {new Date(certificate.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Instructor</div>
                <div className="flex items-center">
                  <User className="text-muted-foreground mr-1.5 h-3.5 w-3.5" />
                  <span className="text-sm font-medium">
                    {certificate.instructor}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">Score</div>
                <div className="text-sm font-medium">{certificate.score}%</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <QrCode className="mr-2 h-4 w-4" />
                      View QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Certificate QR Code</DialogTitle>
                      <DialogDescription>
                        Scan this QR code to verify the certificate
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center p-4">
                      <img
                        src={certificate.qrCodeUrl || '/placeholder.svg'}
                        alt="Certificate QR Code"
                        className="h-48 w-48"
                      />
                    </div>
                    <div className="text-muted-foreground text-center text-sm">
                      Credential ID: {certificate.credentialId}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="text-sm font-medium">Verification Link</div>
                <div className="bg-muted flex items-center justify-between rounded-md p-2 text-sm">
                  <span className="mr-2 truncate">
                    {certificate.verificationUrl}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={copyVerificationUrl}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span className="sr-only">Copy verification URL</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      asChild
                    >
                      <a
                        href={certificate.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="sr-only">Open verification URL</span>
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex justify-center">
                <Button asChild variant="link" className="text-sm">
                  <Link
                    to={`/dashboard/student/courses/${certificate.courseId}`}
                  >
                    View Course Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
