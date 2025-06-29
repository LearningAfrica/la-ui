import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/course-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { PricingCard } from "@/components/pricing-card"
import { StatsCard } from "@/components/stats-card"
import { CategorySection } from "@/components/category-section"

export function LandingPage() {
  // Mock data for featured courses
  const featuredCourses = [
    {
      id: "1",
      title: "Complete Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, React, Node and more!",
      image: "/web-dev-course.jpg",
      instructor: "Dr. Angela Yu",
      rating: 4.8,
      students: 15432,
      price: 89.99,
      category: "Programming",
    },
    {
      id: "2",
      title: "Data Science A-Z",
      description: "Learn Data Science with Python, R, SQL, and Tableau",
      image: "/data-science-course.jpg",
      instructor: "Kirill Eremenko",
      rating: 4.7,
      students: 12345,
      price: 94.99,
      category: "Data Science",
    },
    {
      id: "3",
      title: "Digital Marketing Masterclass",
      description: "Complete guide to SEO, SEM, social media, and more",
      image: "/marketing-course.jpg",
      instructor: "Sarah Johnson",
      rating: 4.9,
      students: 9876,
      price: 79.99,
      category: "Marketing",
    },
  ]

  // Mock data for testimonials
  const testimonials = [
    {
      id: "1",
      name: "Michael Chen",
      role: "Software Developer",
      image: "/testimonial-1.jpg",
      content:
        "The courses on this platform helped me transition from a junior to senior developer in just 6 months. The instructors are knowledgeable and the content is always up-to-date.",
      rating: 5,
    },
    {
      id: "2",
      name: "Sophia Rodriguez",
      role: "UX Designer",
      image: "/testimonial-2.jpg",
      content:
        "I've taken design courses on many platforms, but the quality of instruction here is unmatched. The projects are practical and I was able to build a portfolio that landed me my dream job.",
      rating: 5,
    },
    {
      id: "3",
      name: "James Wilson",
      role: "Marketing Manager",
      image: "/testimonial-3.jpg",
      content:
        "The digital marketing courses provided me with actionable strategies that I could implement immediately. My company's online presence has grown significantly as a result.",
      rating: 4,
    },
  ]

  // Mock data for pricing plans
  const pricingPlans = [
    {
      id: "1",
      name: "Basic",
      price: 9.99,
      interval: "month",
      description: "Perfect for individual learners",
      features: [
        "Access to 100+ courses",
        "New courses monthly",
        "Basic course completion certificates",
        "24/7 support",
      ],
      popular: false,
    },
    {
      id: "2",
      name: "Pro",
      price: 19.99,
      interval: "month",
      description: "Ideal for dedicated students",
      features: [
        "Access to all 1,000+ courses",
        "New courses weekly",
        "Premium certificates",
        "1-on-1 mentor sessions",
        "Offline downloads",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "3",
      name: "Enterprise",
      price: 49.99,
      interval: "month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Custom learning paths",
        "Analytics dashboard",
        "API access",
        "SSO integration",
        "Dedicated account manager",
      ],
      popular: false,
    },
  ]

  // Mock data for stats
  const stats = [
    {
      id: "1",
      value: "1M+",
      label: "Students",
      description: "Learners worldwide",
    },
    {
      id: "2",
      value: "2,000+",
      label: "Courses",
      description: "Across all categories",
    },
    {
      id: "3",
      value: "500+",
      label: "Instructors",
      description: "Expert teachers",
    },
    {
      id: "4",
      value: "4.8",
      label: "Rating",
      description: "From student reviews",
    },
  ]

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-24">
        <div className="container flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Unlock Your Potential with Online Learning
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Access over 2,000 courses taught by industry experts and transform your life through education.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Join For Free</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="/hero-image.jpg"
              alt="Students learning online"
              className="rounded-lg shadow-xl"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <StatsCard key={stat.id} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Courses</h2>
              <p className="text-muted-foreground">Handpicked courses to get you started</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/courses">View All Courses</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategorySection />

      {/* Testimonials Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Choose Your Learning Plan</h2>
            <p className="text-muted-foreground mt-2">Flexible plans to meet your learning needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join millions of students and start learning today. Access courses from top instructors worldwide.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/courses">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">LearnHub</h3>
              <p className="text-muted-foreground">
                Empowering learners worldwide with quality education and skills for the future.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/courses" className="text-muted-foreground hover:text-foreground">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/instructors" className="text-muted-foreground hover:text-foreground">
                    Instructors
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/webinars" className="text-muted-foreground hover:text-foreground">
                    Webinars
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials" className="text-muted-foreground hover:text-foreground">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">support@learnhub.com</li>
                <li className="text-muted-foreground">+1 (555) 123-4567</li>
                <li className="text-muted-foreground">123 Education St, Learning City</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">© 2023 LearnHub. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
