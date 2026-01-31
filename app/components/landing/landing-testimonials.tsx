import { useState } from "react";

const testimonials = [
  {
    quote:
      "Learning Africa has transformed how we train our employees across multiple locations. The platform is intuitive and our completion rates have increased by 60%.",
    author: "James Gichuru",
    role: "HR Director",
    organization: "Tumani Group",
    avatar: "JG",
    country: "Kenya",
  },
  {
    quote:
      "The certificate verification feature has added credibility to our training programs. Our learners love sharing their achievements on LinkedIn.",
    author: "David Mwangi",
    role: "Training Manager",
    organization: "Safaricom Academy",
    avatar: "DM",
    country: "Kenya",
  },
  {
    quote:
      "We onboarded 500 learners in our first month. The support team was incredibly helpful and the platform exceeded our expectations.",
    author: "Jane Onyango",
    role: "Education Lead",
    organization: "Cairo Learning Hub",
    avatar: "JO",
    country: "Kenya",
  },
  {
    quote:
      "As an NGO, we needed an affordable yet powerful LMS. Learning Africa delivered exactly what we needed to train community health workers.",
    author: "Ken Wainaina",
    role: "Program Director",
    organization: "Ubuntu Health Initiative",
    avatar: "KW",
    country: "Kenya",
  },
];

export default function LandingTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-gray-950">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="testimonial-pattern"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 0L80 40L40 80L0 40Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-amber-600"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonial-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            Testimonials
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            Trusted by Organizations
            <span className="block bg-linear-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Across Africa
            </span>
          </h2>
        </div>

        {/* Featured Testimonial */}
        <div key={activeIndex} className="mx-auto mb-12 max-w-4xl">
          <div className="relative rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 to-orange-50 p-8 sm:p-12 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 text-amber-200">
              <svg
                className="h-16 w-16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            <div className="relative z-10">
              <p className="mb-8 pt-8 text-xl leading-relaxed text-gray-700 sm:text-2xl dark:text-gray-200">
                &ldquo;{testimonials[activeIndex].quote}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-amber-500 to-orange-600 text-lg font-bold text-white">
                  {testimonials[activeIndex].avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {testimonials[activeIndex].author}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {testimonials[activeIndex].role}
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    {testimonials[activeIndex].organization} •{" "}
                    {testimonials[activeIndex].country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Navigation */}
        <div className="flex justify-center gap-3">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "scale-110 bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-gray-800 dark:text-amber-300 dark:hover:bg-gray-700"
              }`}
            >
              {testimonial.avatar}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
