import { useState, useEffect } from 'react';
import { ArrowLeft, Award, Check, Eye, Upload, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Form schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Certificate name must be at least 3 characters.',
  }),
  description: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']),
  orientation: z.enum(['landscape', 'portrait']),
  showLogo: z.boolean().default(true),
  showSignature: z.boolean().default(true),
  showDate: z.boolean().default(true),
  showQrCode: z.boolean().default(false),
  expiryEnabled: z.boolean().default(false),
  expiryPeriod: z.string().optional(),
  backgroundColor: z.string().default('#ffffff'),
  borderColor: z.string().default('#000000'),
  textColor: z.string().default('#000000'),
  accentColor: z.string().default('#3b82f6'),
});

// Mock certificate template data - in real app, this would come from API
const getCertificateTemplate = (id: string) => {
  const templates = {
    'cert-001': {
      id: 'cert-001',
      name: 'Course Completion',
      description:
        'Standard certificate awarded upon successful course completion',
      status: 'active' as const,
      orientation: 'landscape' as const,
      showLogo: true,
      showSignature: true,
      showDate: true,
      showQrCode: false,
      expiryEnabled: false,
      expiryPeriod: '',
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      textColor: '#000000',
      accentColor: '#3b82f6',
      templateId: 'template1',
      createdAt: '2023-06-15',
      updatedAt: '2023-11-02',
    },
    'cert-002': {
      id: 'cert-002',
      name: 'Professional Certification',
      description: 'Advanced certification for professional-level courses',
      status: 'active' as const,
      orientation: 'landscape' as const,
      showLogo: true,
      showSignature: true,
      showDate: true,
      showQrCode: true,
      expiryEnabled: true,
      expiryPeriod: '2years',
      backgroundColor: '#f8fafc',
      borderColor: '#1e40af',
      textColor: '#1e293b',
      accentColor: '#3b82f6',
      templateId: 'template2',
      createdAt: '2023-07-22',
      updatedAt: '2023-10-18',
    },
  };
  return templates[id as keyof typeof templates] || null;
};

export default function EditCertificatePage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [isLoading, setIsLoading] = useState(true);
  const [certificateData, setCertificateData] = useState<any>(null);

  // Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'draft',
      orientation: 'landscape',
      showLogo: true,
      showSignature: true,
      showDate: true,
      showQrCode: false,
      expiryEnabled: false,
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      textColor: '#000000',
      accentColor: '#3b82f6',
    },
  });

  // Load certificate data
  useEffect(() => {
    const loadCertificate = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const data = getCertificateTemplate(params.id!);

        if (!data) {
          //   toast({
          //     title: "Certificate not found",
          //     description: "The requested certificate template could not be found.",
          //     variant: "destructive",
          //   })
          toast.error('Certificate not found', {
            description:
              'The requested certificate template could not be found.',
          });
          navigate('/dashboard/admin/certificates');
          return;
        }

        setCertificateData(data);
        setSelectedTemplate(data.templateId);

        // Reset form with loaded data
        form.reset({
          name: data.name,
          description: data.description,
          status: data.status,
          orientation: data.orientation,
          showLogo: data.showLogo,
          showSignature: data.showSignature,
          showDate: data.showDate,
          showQrCode: data.showQrCode,
          expiryEnabled: data.expiryEnabled,
          expiryPeriod: data.expiryPeriod,
          backgroundColor: data.backgroundColor,
          borderColor: data.borderColor,
          textColor: data.textColor,
          accentColor: data.accentColor,
        });
      } catch (error) {
        // toast({
        //   title: "Error loading certificate",
        //   description: "Failed to load certificate template data.",
        //   variant: "destructive",
        // })
        toast.error('Error loading certificate', {
          description: 'Failed to load certificate template data.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificate();
  }, [params.id, form, navigate]);

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // toast({
    //   title: "Certificate template updated",
    //   description: "Your certificate template has been updated successfully.",
    // })
    toast.success('Certificate template updated', {
      description: 'Your certificate template has been updated successfully.',
    });
    navigate(`/dashboard/admin/certificates/${params.id}`);
  }

  // Certificate templates
  const templates = [
    {
      id: 'template1',
      name: 'Classic',
      image: '/elegant-achievement-certificate.png',
    },
    {
      id: 'template2',
      name: 'Modern',
      image: '/abstract-geometric-certificate.png',
    },
    {
      id: 'template3',
      name: 'Minimalist',
      image: '/clean-achievement-award.png',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-6 md:p-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground">
              Loading certificate template...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!certificateData) {
    return (
      <div className="flex-1 space-y-4 p-6 md:p-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/certificates">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Certificates
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="mb-2 text-xl font-semibold">
              Certificate Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The requested certificate template could not be found.
            </p>
            <Button asChild>
              <Link to="/dashboard/admin/certificates">
                Return to Certificates
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/dashboard/admin/certificates/${params.id}`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Certificate
            </Link>
          </Button>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">Edit Certificate Template</h1>
            <p className="text-muted-foreground">
              Modify the certificate template settings and design
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button type="submit" form="certificate-form">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Left column - Form */}
        <div
          className={`space-y-4 ${previewMode ? 'hidden md:col-span-2 md:block' : 'md:col-span-3'}`}
        >
          <Form {...form}>
            <form
              id="certificate-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Basic Information</h3>
                      <div className="text-muted-foreground text-xs">
                        ID: {certificateData.id}
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certificate Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Course Completion Certificate"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This name will be used for internal reference.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the purpose of this certificate template"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="archived">
                                  Archived
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Only active certificates can be issued.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="orientation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Orientation</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select orientation" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="landscape">
                                  Landscape
                                </SelectItem>
                                <SelectItem value="portrait">
                                  Portrait
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="text-muted-foreground border-t pt-2 text-xs">
                      <div className="flex justify-between">
                        <span>Created: {certificateData.createdAt}</span>
                        <span>Last updated: {certificateData.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Template Selection</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`relative cursor-pointer overflow-hidden rounded-md border-2 transition-all ${
                            selectedTemplate === template.id
                              ? 'border-primary ring-primary/20 ring-2'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <img
                            src={template.image || '/placeholder.svg'}
                            alt={template.name}
                            className="h-32 w-full object-cover"
                          />
                          <div className="p-2 text-center text-sm font-medium">
                            {template.name}
                          </div>
                          {selectedTemplate === template.id && (
                            <div className="bg-primary text-primary-foreground absolute top-2 right-2 rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        className="w-full max-w-xs bg-transparent"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Custom Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Certificate Elements
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="showLogo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Organization Logo</FormLabel>
                              <FormDescription>
                                Display your organization logo on the
                                certificate
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="showSignature"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Signature</FormLabel>
                              <FormDescription>
                                Include instructor or administrator signature
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="showDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Issue Date</FormLabel>
                              <FormDescription>
                                Show the date when the certificate was issued
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="showQrCode"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>QR Code</FormLabel>
                              <FormDescription>
                                Add a QR code for certificate verification
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Expiration Settings</h3>
                    <FormField
                      control={form.control}
                      name="expiryEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Certificate Expiration</FormLabel>
                            <FormDescription>
                              Set whether certificates will expire after a
                              certain period
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {form.watch('expiryEnabled') && (
                      <FormField
                        control={form.control}
                        name="expiryPeriod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Period</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select expiry period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="6months">
                                  6 Months
                                </SelectItem>
                                <SelectItem value="1year">1 Year</SelectItem>
                                <SelectItem value="2years">2 Years</SelectItem>
                                <SelectItem value="3years">3 Years</SelectItem>
                                <SelectItem value="5years">5 Years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Certificates will expire after this period from
                              the issue date.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Design Customization
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="backgroundColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  type="color"
                                  {...field}
                                  className="h-10 w-12 p-1"
                                />
                              </FormControl>
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                className="flex-1"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="borderColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Border Color</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  type="color"
                                  {...field}
                                  className="h-10 w-12 p-1"
                                />
                              </FormControl>
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                className="flex-1"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="textColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Text Color</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  type="color"
                                  {...field}
                                  className="h-10 w-12 p-1"
                                />
                              </FormControl>
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                className="flex-1"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accentColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Accent Color</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  type="color"
                                  {...field}
                                  className="h-10 w-12 p-1"
                                />
                              </FormControl>
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                className="flex-1"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>

        {/* Right column - Preview */}
        <div
          className={`${previewMode ? 'md:col-span-3' : 'hidden md:col-span-2 md:block'}`}
        >
          <div className="sticky top-4 space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Live Preview</h3>
                  <p className="text-muted-foreground text-sm">
                    Changes are reflected in real-time as you edit.
                  </p>
                  <div className="bg-background relative aspect-[1.414/1] w-full overflow-hidden rounded-md border">
                    <div
                      className="absolute inset-4 flex flex-col items-center justify-center border-8 p-8 text-center"
                      style={{
                        backgroundColor: form.watch('backgroundColor'),
                        borderColor: form.watch('borderColor'),
                        color: form.watch('textColor'),
                      }}
                    >
                      {form.watch('showLogo') && (
                        <div className="mb-4">
                          <Award
                            className="h-16 w-16"
                            style={{ color: form.watch('accentColor') }}
                          />
                        </div>
                      )}
                      <h1 className="mb-2 text-2xl font-bold">
                        Certificate of Completion
                      </h1>
                      <p className="mb-6 text-lg">This certifies that</p>
                      <p
                        className="mb-1 text-xl font-bold"
                        style={{ color: form.watch('accentColor') }}
                      >
                        Student Name
                      </p>
                      <div
                        className="mb-6 h-0.5 w-48"
                        style={{ backgroundColor: form.watch('accentColor') }}
                      ></div>
                      <p className="mb-1 text-lg">has successfully completed</p>
                      <p className="mb-6 text-xl font-bold">Course Title</p>

                      <div className="mt-auto flex w-full items-end justify-between">
                        {form.watch('showDate') && (
                          <div className="text-sm">
                            <p>Issue Date</p>
                            <p>April 20, 2025</p>
                          </div>
                        )}

                        {form.watch('showSignature') && (
                          <div className="text-sm">
                            <div className="mb-2 flex h-12 w-32 items-end justify-center">
                              <img
                                src="/personal-authentication.png"
                                alt="Signature"
                                className="h-full object-contain"
                              />
                            </div>
                            <div
                              className="mb-1 h-0.5 w-32"
                              style={{
                                backgroundColor: form.watch('textColor'),
                              }}
                            ></div>
                            <p>Instructor Name</p>
                          </div>
                        )}

                        {form.watch('showQrCode') && (
                          <div className="text-sm">
                            <div className="mb-1 h-16 w-16 bg-white p-1">
                              <img
                                src="/abstract-qr-code.png"
                                alt="QR Code"
                                className="h-full w-full"
                              />
                            </div>
                            <p>Verify</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Template Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Template ID:
                      </span>
                      <span className="font-medium">{certificateData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Current Status:
                      </span>
                      <span className="font-medium capitalize">
                        {certificateData.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Certificates Issued:
                      </span>
                      <span className="font-medium">1,458</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Courses Using:
                      </span>
                      <span className="font-medium">24</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
