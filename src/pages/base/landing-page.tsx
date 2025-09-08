import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {  ArrowRight, CheckCircle, Cpu, Rocket, Star, Target, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  return (
  <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 rounded-2xl border border-border/50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2 hover:scale-105 transition-transform">
              <Zap className="h-8 w-8 text-primary animate-pulse" />
              <span className="text-xl font-bold text-primary">Learning Africa</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="#about" className="text-muted-foreground hover:text-primary transition-all duration-300">
                About
              </Link>
              <Link to="#services" className="text-muted-foreground hover:text-primary transition-all duration-300">
                Services
              </Link>
              <Link
                to="#testimonials"
                className="text-muted-foreground hover:text-primary transition-all duration-300"
              >
                Testimonials
              </Link>
              <Link to="/inquiry">
                <Button className="bg-primary hover:bg-primary/90 hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
                  <Rocket className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="md:hidden">
              <Link to="/inquiry">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Start
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge
              variant="secondary"
              className="mb-6 bg-secondary/20 text-secondary border-secondary/30 backdrop-blur-sm px-6 py-2 rounded-full"
            >
              <Cpu className="w-4 h-4 mr-2" />
              Trusted by 500+ Organizations
            </Badge>

            <h1 className="text-4xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
              Empowering Learning Through <span className="text-primary relative">Innovation</span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
              We help organizations create exceptional learning materials that engage, educate, and inspire their
              members to achieve their full potential through cutting-edge technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/inquiry">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 hover:scale-105 transition-transform text-lg px-8 py-4"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary/30 hover:border-primary/60 bg-background/50 backdrop-blur-sm text-lg px-8 py-4 hover:bg-primary/5 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-primary">Why Organizations Choose Us</h2>
            <p className="text-lg lg:text-xl text-muted-foreground text-pretty leading-relaxed">
              With over a decade of experience in educational content development, we understand what makes learning
              materials truly effective in the digital age.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center group hover:scale-105 transition-all duration-300 border-border/50 backdrop-blur-sm bg-card/50">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl lg:text-2xl">Expert Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  Our team of learning specialists brings years of experience in curriculum design and educational
                  psychology, enhanced by AI-driven insights.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:scale-105 transition-all duration-300 border-border/50 backdrop-blur-sm bg-card/50">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl lg:text-2xl">Collaborative Process</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  We work closely with your team using advanced collaboration tools to ensure the learning materials
                  align perfectly with your organization's goals.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:scale-105 transition-all duration-300 border-border/50 backdrop-blur-sm bg-card/50">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl lg:text-2xl">Proven Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  Our materials have helped organizations achieve 40% higher engagement rates and improved learning
                  outcomes through data-driven optimization.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-primary">Our Services</h2>
            <p className="text-lg lg:text-xl text-muted-foreground text-pretty leading-relaxed">
              Comprehensive learning material development tailored to your organization's unique needs using
              cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Curriculum Development",
                description: "Custom learning paths designed to meet your specific objectives and learner needs.",
                features: ["Learning objectives mapping", "Progressive skill building", "Assessment integration"],
              },
              {
                title: "Interactive Content Creation",
                description: "Engaging multimedia content that keeps learners motivated and involved.",
                features: ["Video production", "Interactive simulations", "Gamification elements"],
              },
              {
                title: "Training Program Design",
                description: "Comprehensive training programs for employee development and skill enhancement.",
                features: ["Onboarding programs", "Leadership development", "Technical skill training"],
              },
              {
                title: "Assessment & Evaluation",
                description: "Robust assessment tools to measure learning effectiveness and progress.",
                features: ["Knowledge checks", "Performance metrics", "Progress tracking"],
              },
              {
                title: "Learning Management",
                description: "Complete LMS setup and management for seamless learning delivery.",
                features: ["Platform setup", "User management", "Analytics & reporting"],
              },
              {
                title: "Consultation Services",
                description: "Expert advice on learning strategy and educational best practices.",
                features: ["Learning audits", "Strategy development", "Implementation support"],
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="group hover:scale-105 transition-all duration-300 border-border/50 backdrop-blur-sm bg-card/50"
              >
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-secondary mr-3 flex-shrink-0 group-hover:text-primary transition-colors duration-300" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/20 relative">
        <div className="absolute top-10 right-20 w-80 h-80 bg-secondary/12 rounded-full blur-3xl animate-pulse"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-primary">What Our Partners Say</h2>
            <p className="text-lg lg:text-xl text-muted-foreground text-pretty leading-relaxed">
              Hear from organizations that have transformed their learning programs with our innovative approach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                quote:
                  "Learning Africa transformed our employee training program. The engagement rates increased by 60% and our team retention improved significantly.",
                author: "Sarah Johnson",
                role: "HR Director",
                company: "TechCorp Solutions",
              },
              {
                quote:
                  "The collaborative approach and attention to detail exceeded our expectations. Our members love the new learning materials.",
                author: "Michael Chen",
                role: "Learning & Development Manager",
                company: "Global Finance Inc.",
              },
              {
                quote:
                  "Professional, efficient, and results-driven. Learning Africa helped us create a world-class training program that our competitors envy.",
                author: "Emily Rodriguez",
                role: "Chief Operations Officer",
                company: "Healthcare Partners",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="group hover:scale-105 transition-all duration-300 border-border/50 backdrop-blur-sm bg-card/50"
              >
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-secondary text-secondary transition-all duration-300" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6 text-pretty leading-relaxed text-base">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t border-border/50 pt-4">
                    <div className="font-semibold text-foreground text-lg">{testimonial.author}</div>
                    <div className="text-sm text-primary">{testimonial.role}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-6xl font-bold mb-6 text-balance">
              Ready to Transform Your <span className="text-primary">Learning Materials?</span>
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed max-w-2xl mx-auto">
              Join hundreds of organizations that have already elevated their learning programs. Submit an inquiry to
              get started on your transformation journey.
            </p>
            <Link to="/inquiry">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 hover:scale-105 transition-transform text-xl px-12 py-6"
              >
                <Rocket className="mr-3 h-6 w-6" />
                Submit Inquiry
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border/50 backdrop-blur-sm relative">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-primary">Learning Africa</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering organizations through exceptional learning material development and innovative technology
                solutions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">Curriculum Development</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Content Creation</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Training Programs</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Assessment Tools</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Our Team</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Case Studies</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-primary transition-colors">hello@Learning Africa.com</li>
                <li className="hover:text-primary transition-colors">+1 (555) 123-4567</li>
                <li className="hover:text-primary transition-colors">San Francisco, CA</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Learning Africa. All rights reserved. | Powered by Innovation</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
