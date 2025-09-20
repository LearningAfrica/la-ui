import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Mail,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const nextSteps = [
  {
    title: 'Review & alignment',
    description:
      'Our partnerships strategist is reviewing your inquiry and aligning the right specialists for your goals.',
    icon: Sparkles,
  },
  {
    title: 'Intro conversation',
    description:
      'Expect a follow-up email with proposed times for a 30-minute discovery sprint within one business day.',
    icon: CalendarDays,
  },
  {
    title: 'Preparation pack',
    description:
      'We will share an agenda and a lightweight preparation kit so every minute together delivers value.',
    icon: CheckCircle2,
  },
];

const supportChannels = [
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
];

export default function SetupInquiryThankYou() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/3 bg-secondary/20 blur-3xl" />
      </div>

      <Header
        variant="marketing"
        navItems={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/#services' },
          { label: 'Contact', href: '/#contact' },
        ]}
        cta={{ label: 'Start another inquiry', href: '/inquiry' }}
      />

      <main className="relative pb-24">
        <section className="pt-12 md:pt-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary"
              >
                <CheckCircle2 className="h-12 w-12" />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mt-10 space-y-4"
              >
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/40 bg-primary/10 px-4 py-1 text-primary"
                >
                  Thank you for reaching out
                </Badge>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  We&apos;ve received your inquiry and we&apos;re excited to collaborate
                </h1>
                <p className="text-lg text-muted-foreground">
                  A confirmation email is on its way. We&apos;ll be in touch within one business day to schedule your discovery sprint and outline the next steps.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto mt-16 grid gap-8 lg:max-w-4xl"
            >
              <Card className="border-border/60 bg-background/85 backdrop-blur">
                <CardContent className="p-8">
                  <div className="grid gap-6 md:grid-cols-3">
                    {nextSteps.map(({ title, description, icon: Icon }) => (
                      <div key={title} className="text-left">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-base font-semibold text-foreground">{title}</p>
                        <p className="mt-2 text-sm text-muted-foreground text-pretty">{description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-background/85 backdrop-blur">
                <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground/80">
                      Need something sooner?
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Reach out through the channels below and we&apos;ll prioritise your inquiry.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
                    {supportChannels.map(({ icon: Icon, label, value, href }) => (
                      <div key={label} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        {href ? (
                          <a href={href} className="font-medium text-foreground hover:text-primary">
                            {value}
                          </a>
                        ) : (
                          <span className="font-medium text-foreground">{value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mx-auto mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button size="lg" asChild className="gap-2 px-8 py-6 text-base shadow-lg shadow-primary/25">
                <Link to="/">
                  Return home
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-primary/40 bg-background/80 px-8 py-6 text-base backdrop-blur hover:bg-primary/10"
              >
                <Link to="/#services">Explore services</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
