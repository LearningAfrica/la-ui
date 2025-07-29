import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import { TestimonialCard } from '@/components/testimonial-card';
import { PricingCard } from '@/components/pricing-card';
import { StatsCard } from '@/components/stats-card';
import { CategorySection } from '@/components/category-section';
import { Link } from 'react-router-dom';
import { landingPageData } from '@/lib/data/landing-page-data';

export default function LandingPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="from-primary/10 to-background bg-gradient-to-b pt-16 p-24  ">
        <div className="container flex flex-col items-center gap-8 lg:flex-row mx-auto">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
              Unlock Your Potential with Online Learning
            </h1>
            <p className="text-muted-foreground max-w-2xl text-xl">
              Access over 2,000 courses taught by industry experts and transform
              your life through education.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/courses">Explore Courses</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Join For Free</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <picture className="w-full max-w-md mx-auto">
              <source
                srcSet="/4353655.webp"
                type="image/webp"
              />
              <source
                srcSet="/hero-image.jpg"
                type="image/jpeg"
              />
              <img
                src="/4353655.webp"
                alt="Students learning online"
                className="rounded-lg shadow-xl"
                width={600}
                height={400}
              />
            </picture>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted p-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {landingPageData.stats.map((stat) => (
              <StatsCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Courses</h2>
              <p className="text-muted-foreground">
                Handpicked courses to get you started
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {landingPageData.featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategorySection />

      {/* Testimonials Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {landingPageData.testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Choose Your Learning Plan</h2>
            <p className="text-muted-foreground mt-2">
              Flexible plans to meet your learning needs
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {landingPageData.pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center mx-auto">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Learning?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Join millions of students and start learning today. Access courses
            from top instructors worldwide.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/courses">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-bold">Learning Africa</h3>
              <p className="text-muted-foreground">
                Empowering learners worldwide with quality education and skills
                for the future.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/courses"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/instructors"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Instructors
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/blog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/webinars"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Webinars
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tutorials"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Contact</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">support@learnhub.com</li>
                <li className="text-muted-foreground">+1 (555) 123-4567</li>
                <li className="text-muted-foreground">
                  123 Education St, Learning City
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} Learning Africa. All rights reserved.
            </p>
            <div className="mt-4 flex gap-4 md:mt-0">
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                to="/cookies"
                className="text-muted-foreground hover:text-foreground"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
