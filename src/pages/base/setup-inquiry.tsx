import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Building,
  CheckCircle2,
  Clock,
  Mail,
  PhoneCall,
  Send,
} from 'lucide-react';

import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useApiClient } from '@/lib/api';
import {
  COMPANY_CATEGORIES,
  COMPANY_SIZES,
} from '@/lib/constants/company-types';
import { setupRequisitionSchemaResolver } from '@/lib/validators/setup-requisition-schema';
import { useAuth } from '@/hooks/use-auth';
import { useAuthModal } from '@/components/auth/auth-modal.context';
import { apiErrorMsg } from '@/lib/utils/axios-err';

const inquiryHighlights = [
  'A partnership strategist will review your submission and respond within 24 hours.',
  'We prepare a tailored discovery sprint agenda aligned with your learning goals.',
  'Expect a clear requirements checklist so every working session is productive.',
];

const contactDetails = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@learningafrica.com',
    href: 'mailto:support@learningafrica.com',
  },
  {
    icon: PhoneCall,
    label: 'Call',
    value: '+254(7)--------',
    href: 'tel:+27115552300',
  },
  {
    icon: Clock,
    label: 'Response time',
    value: 'Within 24 hours on business days',
  },
];

export default function SetupInquiry() {
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const { is_authenticated } = useAuth();
  const { openModal } = useAuthModal();
  const form = useForm({
    resolver: setupRequisitionSchemaResolver,
    defaultValues: {
      // first_name: '',
      // last_name: '',
      // contact_email: '',
      company_name: '',
      company_description: '',
      company_category: '',
      company_size: '',
      reason: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (data) => {
    if (!is_authenticated) {
      toast.info('Create an account or log in to send your inquiry.');
      openModal('register');
      return;
    }

    try {
      await apiClient.post('/invite/organization-permission-requests/', data);
      navigate('/thank-you');
    } catch (error) {
      console.error('[v0] Error submitting inquiry:', error);
      toast.error(apiErrorMsg(error, 'Failed to submit inquiry. Please try again.'));
    }
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-0 h-[30rem] w-[30rem] translate-x-1/3 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[26rem] w-[26rem] -translate-x-1/3 bg-secondary/20 blur-3xl" />
      </div>

      <Header
        variant="marketing"
        navItems={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/#services' },
          { label: 'Inquiry Form', href: '#inquiry-form' },
        ]}
        cta={{ label: 'Email our team', href: 'mailto:support@learningafrica.com', external: true }}
      />

      <main className="relative pb-24">
        <section className="pt-12 md:pt-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
              <div className="space-y-8">
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-2 rounded-full border-primary/40 bg-primary/10 px-4 py-1 text-sm font-medium text-primary backdrop-blur"
                >
                  Partnership inquiry
                </Badge>

                <div className="space-y-6">
                  <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                    Let&apos;s build your next learning milestone together
                  </h1>
                  <p className="max-w-xl text-lg text-muted-foreground">
                    Share a little about your organisation and the transformation you&apos;re planning. Our partnerships team will curate the right mix of strategists, designers, and technologists to accelerate your journey.
                  </p>
                </div>

                <div className="rounded-3xl border border-border/60 bg-background/80 p-8 backdrop-blur">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/80">
                      What to expect
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                      {inquiryHighlights.map((highlight) => (
                        <div key={highlight} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-pretty">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {contactDetails.map(({ icon: Icon, label, value, href }) => (
                      <div
                        key={label}
                        className="flex items-start gap-3 rounded-2xl border border-dashed border-primary/25 bg-primary/5 p-4 text-sm text-muted-foreground"
                      >
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-primary/80">{label}</p>
                          {href ? (
                            <a href={href} className="mt-1 block font-medium text-foreground hover:text-primary">
                              {value}
                            </a>
                          ) : (
                            <p className="mt-1 font-medium text-foreground">{value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div id="inquiry-form" className="space-y-6">
                <Card className="border-border/60 bg-background/80 backdrop-blur">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-semibold">Let&apos;s get acquainted</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Provide the details below and we&apos;ll tailor our discovery sprint for your team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={onSubmit} className="space-y-6">
                        <Card className="border border-border/60 bg-background/90">
                          <CardHeader className="space-y-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Building className="h-5 w-5 text-primary" />
                              Company information
                            </CardTitle>
                            <CardDescription>
                              Help us understand who you are and where you&apos;re headed.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                              <FormField
                                control={control}
                                name="company_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company name *</FormLabel>
                                    <FormControl className='w-full'>
                                      <Input placeholder="Enter your company name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={control}
                                name="company_category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company category *</FormLabel>
                                    <FormControl className='w-full'>
                                      <Select onValueChange={field.onChange} value={field.value} >
                                        <SelectTrigger className='w-full'>
                                          <SelectValue placeholder="Select company category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {COMPANY_CATEGORIES.map(({ label, value }) => (
                                            <SelectItem key={value} value={value}>
                                              {label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={control}
                              name="company_size"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company size *</FormLabel>
                                  <FormControl className='w-full'>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select company size" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {COMPANY_SIZES.map(({ label, value }) => (
                                          <SelectItem key={value} value={value}>
                                            {label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={control}
                              name="company_description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company vision & focus *</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Share a quick overview of your organisation, the learners you support, and what success looks like for this initiative."
                                      rows={5}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                               <FormField
                              control={control}
                              name="reason"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company vision & focus *</FormLabel>
                                  <FormControl className='w-full'>
                                    <Textarea
                                      placeholder="Briefly describe your reason for reaching out and what you hope to achieve through our partnership."
                                      rows={5}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>

                        {/* <Card className="border border-border/60 bg-background/90">
                          <CardHeader className="space-y-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Users className="h-5 w-5 text-primary" />
                              Primary contact
                            </CardTitle>
                            <CardDescription>
                              Who should we collaborate with on next steps?
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                              <FormField
                                control={control}
                                name="first_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First name *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter your first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={control}
                                name="last_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last name *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter your last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={control}
                              name="contact_email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Work email *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="your.name@company.com"
                                      autoComplete="email"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card> */}

                        <Card className="border border-border/60 bg-background/90">
                          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                              We respect your time. A tailored response lands in your inbox within one business day.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                              <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                                className="gap-2 px-8 py-6 text-base shadow-lg shadow-primary/25"
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                                    Sending
                                  </>
                                ) : (
                                  <>
                                    Submit inquiry
                                    <Send className="h-4 w-4" />
                                  </>
                                )}
                              </Button>
                              <Button asChild variant="ghost" size="lg" className="px-8 py-6 text-base">
                                <Link to="/">Cancel</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
