import { useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  GraduationCap,
  Layers,
  Play,
  Quote,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useAuthModal } from '@/components/auth/auth-modal.context';

const stats = [
  { label: 'Organizations empowered', value: '500+' },
  { label: 'Learner satisfaction rate', value: '98%' },
  { label: 'Time-to-launch acceleration', value: '4x faster' },
];

const heroHighlights = [
  'Adaptive learning journeys shaped around your teams',
  'Immersive, on-brand content crafted by specialist studios',
  'Evidence-backed analytics that prove ROI to leadership',
];

const demoHighlights = [
  'Preview how our inquiry-to-launch framework aligns stakeholders in weeks, not months.',
  'See the creative production workflow that keeps every deliverable on-brand and on-budget.',
  'Understand the analytics command centre leaders use to track adoption and ROI in real time.',
];

const differentiators = [
  {
    title: 'Embedded partnership',
    description:
      'We co-create with your stakeholders from discovery to delivery, translating ambition into actionable learning strategy.',
    icon: Users,
  },
  {
    title: 'Design grounded in evidence',
    description:
      'Our multidisciplinary studios blend pedagogy, storytelling, and technology to craft experiences learners love.',
    icon: ShieldCheck,
  },
  {
    title: 'Impact you can measure',
    description:
      'Live dashboards transform learner behaviour into insights the C-suite can act on, ensuring every initiative lands.',
    icon: BarChart3,
  },
];

type Service = {
  title: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
};

const services: Service[] = [
  {
    title: 'Curriculum Architecture',
    description: 'Strategic blueprints that map competencies to measurable outcomes.',
    highlights: [
      'Needs analysis & vision workshops',
      'Modular, mastery-based journeys',
      'Embedded assessment strategy',
    ],
    icon: Layers,
  },
  {
    title: 'Immersive Content Studios',
    description: 'High-production storytelling, interactive media, and on-brand assets.',
    highlights: [
      'Video, audio, and motion design',
      'Scenario-based simulations',
      'Inclusive & accessible design',
    ],
    icon: Sparkles,
  },
  {
    title: 'Learning Operations',
    description: 'Seamless implementation and governance across your ecosystem.',
    highlights: [
      'LMS configuration & automation',
      'Facilitator enablement suites',
      'Performance dashboards',
    ],
    icon: ShieldCheck,
  },
  {
    title: 'Community & Facilitation',
    description: 'Human-centred activations that sustain engagement.',
    highlights: [
      'Instructor playbooks & scripts',
      'Engagement nudges & comms',
      'Peer learning activations',
    ],
    icon: Users,
  },
  {
    title: 'Assessment Intelligence',
    description: 'Data-informed evaluation to evidence progress and retention.',
    highlights: [
      'Diagnostics & benchmarking',
      'Adaptive check-ins & surveys',
      'Executive-ready insights',
    ],
    icon: BarChart3,
  },
  {
    title: 'Strategic Advisory',
    description: 'Ongoing guidance from leaders who understand your context.',
    highlights: [
      'Operating model design',
      'Capability build & training',
      'Optimisation sprints',
    ],
    icon: GraduationCap,
  },
];

const processSteps = [
  {
    title: 'Discover & Align',
    summary: 'Deep dive workshops to clarify ambition and success metrics.',
    detail: 'We listen, audit, and align to co-create a bold yet achievable vision for your learners.',
  },
  {
    title: 'Co-Design & Prototype',
    summary: 'Experience design led by pedagogy, creativity, and data.',
    detail: 'Rapid prototyping sessions give stakeholders confidence and space to iterate early.',
  },
  {
    title: 'Produce & Orchestrate',
    summary: 'Studios, SMEs, and technologists bring the blueprint to life.',
    detail: 'From narrative scripts to platform automation, every asset is crafted and stress-tested.',
  },
  {
    title: 'Launch & Elevate',
    summary: 'Roll-out support with analytics that illuminate adoption and impact.',
    detail: 'We monitor, optimise, and coach your teams so programmes scale with integrity.',
  },
];

const testimonials = [
  {
    quote:
      'Learning Africa transformed our employee training. Engagement lifted by 60% and our leadership finally has clarity on impact.',
    name: 'Sarah Johnson',
    role: 'HR Director',
    company: 'TechCorp Solutions',
  },
  {
    quote:
      'Their collaborative approach and attention to detail exceeded expectations. Our members can feel the craftsmanship in every module.',
    name: 'Michael Chen',
    role: 'Learning & Development Manager',
    company: 'Global Finance Inc.',
  },
  {
    quote:
      'Professional, efficient, and relentlessly strategic. We launched a world-class academy in record time with measurable results.',
    name: 'Emily Rodriguez',
    role: 'Chief Operations Officer',
    company: 'Healthcare Partners',
  },
];

const trustedBy = [
  'TechCorp Solutions',
  'Global Finance Inc.',
  'Healthcare Partners',
  'EduFuture Africa',
];

export default function LandingPage() {
  const { is_authenticated } = useAuth();
  const { openModal } = useAuthModal();
  const navigate = useNavigate();

  const handleStartInquiry = useCallback(() => {
    if (is_authenticated) {
      navigate('/inquiry');
    } else {
      openModal('register');
    }
  }, [is_authenticated, navigate, openModal]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] translate-x-1/3 bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[28rem] w-[28rem] -translate-x-1/2 bg-muted/30 blur-3xl" />
      </div>

      <Header
        variant="marketing"
        navItems={[
          { label: 'About', href: '#about' },
          { label: 'Services', href: '#services' },
          { label: 'Demo', href: '#demo' },
          { label: 'Approach', href: '#process' },
          { label: 'Impact', href: '#testimonials' },
          { label: 'Contact', href: '#contact' },
        ]}
        cta={{ label: 'Start an Inquiry', href: '/inquiry' }}
      />

      <main className="relative">
        <section className="pt-16 pb-24 md:pt-24 md:pb-32 lg:pb-36">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
              <div className="space-y-10">
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-2 rounded-full border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur"
                >
                  <Sparkles className="h-4 w-4" />
                  Learning experiences reimagined
                </Badge>

                <div className="space-y-6">
                  <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                    Crafting high-impact learning ecosystems for the organisations building Africa&apos;s future
                  </h1>
                  <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                    Learning Africa partners with ambitious teams to design, produce, and operationalise premium learning journeys that energise talent and move the metrics that matter.
                  </p>
                </div>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Button
                    size="lg"
                    className="gap-2 px-8 py-6 text-base shadow-lg shadow-primary/20"
                    onClick={handleStartInquiry}
                  >
                    <Rocket className="h-5 w-5" />
                    Start an Inquiry
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-primary/30 bg-background/80 px-8 py-6 text-base backdrop-blur hover:bg-primary/10"
                  >
                    <a href="#services">Explore services</a>
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    {stats.map((stat) => (
                      <div key={stat.label} className="min-w-[10rem] rounded-2xl border border-border/60 bg-background/80 px-6 py-4 backdrop-blur">
                        <div className="text-2xl font-semibold text-primary">{stat.value}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 text-sm text-muted-foreground">
                    {heroHighlights.map((highlight) => (
                      <div key={highlight} className="flex items-start gap-3">
                        <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <p className="max-w-xl text-pretty">{highlight}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
                      Trusted by teams across the continent
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground/90">
                      {trustedBy.map((partner) => (
                        <span key={partner} className="whitespace-nowrap">
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-x-8 -top-12 -z-10 h-40 rounded-full bg-primary/20 blur-3xl" />
                <Card className="overflow-hidden border-border/50 bg-background/80 backdrop-blur">
                  <CardHeader className="gap-3">
                    <div className="flex items-center gap-3 text-primary">
                      <div className="rounded-full bg-primary/15 p-3">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                          Signature engagements
                        </p>
                        <CardTitle className="text-xl">Enterprise Learning Accelerators</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-pretty">
                      Cohort-based, hybrid, or self-paced programmes engineered with precision—from instructional design to automation and analytics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {heroHighlights.map((highlight) => (
                        <div key={`feature-${highlight}`} className="flex gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
                          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <p className="text-sm text-muted-foreground text-pretty">{highlight}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-3xl border border-primary/40 bg-primary/10 p-6 text-primary-foreground">
                      <p className="text-xs font-medium uppercase tracking-[0.35em] text-primary/80">
                        Most requested package
                      </p>
                      <p className="mt-3 text-lg font-semibold text-primary">
                        Launch-ready microlearning series in just 6 weeks
                      </p>
                      <p className="mt-2 text-sm text-primary/80">
                        Strategy, creative production, change enablement, and performance analytics included.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="relative py-20">
          <div className="absolute inset-x-0 top-1/2 -z-10 h-[38rem] -translate-y-1/2 bg-gradient-to-r from-primary/10 via-background to-secondary/10 blur-3xl" />
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
              <div className="space-y-8">
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-2 rounded-full border-primary/40 bg-primary/10 px-4 py-1 text-sm font-medium text-primary backdrop-blur"
                >
                  Immersive preview
                </Badge>
                <div className="space-y-4">
                  <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Experience a client onboarding in under three minutes
                  </h2>
                  <p className="max-w-xl text-lg text-muted-foreground">
                    This guided tour reveals how Learning Africa designs, produces, and launches learning ecosystems that stay ahead of stakeholder expectations.
                  </p>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {demoHighlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-pretty">{highlight}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="gap-2 px-7 py-5 text-base shadow-lg shadow-primary/20"
                    onClick={handleStartInquiry}
                  >
                    Continue to inquiry
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" asChild className="border-primary/30 px-7 py-5 text-base">
                    <a href="#contact">Talk to our team</a>
                  </Button>
                </div>
              </div>

              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      aria-label="Play Learning Africa demo video"
                      className="group relative block w-full overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/15 via-background to-secondary/15 shadow-xl shadow-primary/15"
                    >
                      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                        <div className="absolute inset-0">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)]" />
                          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(12,20,52,0.75),rgba(24,30,68,0.55))] mix-blend-overlay" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center text-primary-foreground">
                            <div className="relative flex items-center justify-center">
                              <span className="absolute inline-flex h-36 w-36 rounded-full bg-primary/20 blur-3xl" aria-hidden />
                              <span className="absolute inline-flex h-24 w-24 rounded-full bg-primary/40 opacity-75 animate-ping" aria-hidden />
                              <span className="absolute inline-flex h-28 w-28 rounded-full bg-primary/20" aria-hidden />
                              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_15px_45px_rgba(12,20,52,0.35)] transition-transform duration-300 group-hover:scale-105">
                                <Play className="h-8 w-8" />
                              </span>
                            </div>
                            <div className="space-y-2 px-6">
                              <p className="text-lg font-semibold text-white">
                                Play the demo video
                              </p>
                              <p className="text-sm text-white/75">
                                Discover the lifecycle from inquiry intake to post-launch analytics.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent p-8 text-left text-sm text-white/80">
                          <p className="font-medium tracking-wide">Learning Africa Platform Walkthrough</p>
                          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Duration: 02:42</p>
                        </div>
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl overflow-hidden border-border/60 bg-background/95 p-0">
                    <div className="aspect-video w-full">
                      <iframe
                        title="Learning Africa Demo"
                        src="https://www.youtube.com/embed/5MgBikgcWnY?rel=0"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Why organisations choose Learning Africa
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our teams blend pedagogy, creative studios, and data science to deliver programmes that delight learners and satisfy the boardroom.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:max-w-3xl md:mx-auto lg:max-w-none">
              {differentiators.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    className="h-full border-border/60 bg-background/80 transition-transform duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <CardHeader className="space-y-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription className="text-pretty text-sm text-muted-foreground">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="services" className="relative bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl space-y-6">
                <Badge variant="secondary" className="rounded-full bg-secondary/20 px-4 py-1 text-secondary">
                  Our services
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  A full-suite partner from strategy to sustained operations
                </h2>
                <p className="text-lg text-muted-foreground">
                  Engage the capabilities you need, when you need them. We assemble cross-functional squads who embed with your teams and deliver outcomes—not handovers.
                </p>
              </div>

              <div className="grid flex-1 gap-6 sm:grid-cols-2 md:max-w-3xl md:mx-auto lg:mx-0 lg:max-w-none">
                {services.map((service) => {
                  const Icon = service.icon;

                  return (
                    <Card key={service.title} className="h-full border-border/60 bg-background/80 backdrop-blur">
                      <CardHeader className="space-y-3">
                        <div className="flex items-center gap-3 text-primary">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Icon className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-lg">{service.title}</CardTitle>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground text-pretty">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {service.highlights.map((highlight) => (
                          <div key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                            <span className="text-pretty">{highlight}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How we partner with you</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  A transparent, collaborative approach keeps stakeholders aligned and momentum high from day one.
                </p>
              </div>
              <Button variant="outline" asChild className="border-primary/30">
                <a href="#contact" className="flex items-center gap-2">
                  Discuss your roadmap
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4 md:max-w-4xl md:mx-auto xl:max-w-none">
              {processSteps.map((step, index) => (
                <Card
                  key={step.title}
                  className="relative h-full border-border/60 bg-background/80 px-6 py-8 text-left transition-transform duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                >
                  <span className="text-sm font-medium uppercase tracking-[0.3em] text-primary/80">Step {index + 1}</span>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-3 text-sm font-medium text-primary">{step.summary}</p>
                  <p className="mt-4 text-sm text-muted-foreground text-pretty">{step.detail}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="relative bg-muted/25 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Stories from teams we&apos;ve partnered with
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From multinationals to agile scale-ups, leaders trust us to deliver learning that elevates performance and pride.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3 md:max-w-4xl md:mx-auto xl:max-w-none">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="h-full border-border/60 bg-background/85 backdrop-blur">
                  <CardContent className="flex h-full flex-col gap-6 p-8">
                    <Quote className="h-8 w-8 text-primary" />
                    <p className="flex-1 text-sm text-muted-foreground text-pretty">
                      “{testimonial.quote}”
                    </p>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-primary">{testimonial.role}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/15 via-background to-secondary/10 p-10 md:p-16">
              <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] md:items-center">
                <div className="space-y-6">
                  <Badge variant="outline" className="rounded-full border-primary/50 bg-primary/10 px-4 py-1 text-primary">
                    Let&apos;s build together
                  </Badge>
                  <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Ready to accelerate your learning transformation?
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Share your goals and we&apos;ll curate a discovery sprint with the right strategists, designers, and technologists to get you moving.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center md:justify-end">
                  <Button
                    size="lg"
                    className="gap-2 px-8 py-6 text-base shadow-lg shadow-primary/25"
                    onClick={handleStartInquiry}
                  >
                    Start an Inquiry
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-primary/40 bg-background/80 px-8 py-6 text-base backdrop-blur hover:bg-primary/10"
                  >
                    <a href="mailto:support@learningafrica.com">Email our team</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/90">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <img src="/la-logo.png" alt="Learning Africa" className="h-10 w-10 rounded-full border border-primary/40" />
                <span className="text-lg font-semibold">Learning Africa</span>
              </Link>
              <p className="max-w-md text-sm text-muted-foreground text-pretty">
                Empowering organisations through crafted learning experiences that inspire, upskill, and deliver measurable value across the continent.
              </p>
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Contact</p>
                <p>support@learningafrica.com</p>
                <p>+254(7)--------</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="space-y-3">
                <p className="font-semibold text-foreground">Services</p>
                <a href="#services" className="block hover:text-foreground">Curriculum Architecture</a>
                <a href="#services" className="block hover:text-foreground">Content Studios</a>
                <a href="#services" className="block hover:text-foreground">Learning Operations</a>
                <a href="#services" className="block hover:text-foreground">Advisory</a>
              </div>
              <div className="space-y-3">
                <p className="font-semibold text-foreground">Company</p>
                <a href="#about" className="block hover:text-foreground">About</a>
                <a href="#testimonials" className="block hover:text-foreground">Impact</a>
                <Link to="/login" className="block hover:text-foreground">Client login</Link>
                <Link to="/inquiry" className="block hover:text-foreground">Start an inquiry</Link>
              </div>
              <div className="space-y-3">
                <p className="font-semibold text-foreground">Resources</p>
                <a href="#process" className="block hover:text-foreground">Our approach</a>
                <a href="mailto:support@learningafrica.com" className="block hover:text-foreground">Book a call</a>
                <a href="#contact" className="block hover:text-foreground">Contact</a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-border/60 pt-6 text-xs text-muted-foreground/80">
            <p>&copy; {new Date().getFullYear()} Learning Africa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
