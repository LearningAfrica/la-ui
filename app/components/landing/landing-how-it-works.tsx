import { CircleCheck, FileText, ZapIcon, type LucideIcon } from "lucide-react";

type StepType = {
  number: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

const steps: StepType[] = [
  {
    number: "01",
    title: "Submit Your Inquiry",
    description:
      "Fill out a simple form with your organization details. Our team reviews all applications to ensure quality.",
    Icon: FileText,
  },
  {
    number: "02",
    title: "Get Approved & Set Up",
    description:
      "Once approved, create your workspace, customize your branding, and invite your team members.",
    Icon: CircleCheck,
  },
  {
    number: "03",
    title: "Create & Launch Courses",
    description:
      "Build engaging courses with our intuitive tools, add quizzes, and publish them for your learners.",
    Icon: ZapIcon,
  },
];

export default function LandingHowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-amber-50 py-24">
      {/* African-inspired decorative elements */}
      <div className="absolute top-20 left-10 h-64 w-64 opacity-5">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="currentColor"
            strokeWidth="2"
            className="text-amber-600"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="currentColor"
            strokeWidth="2"
            className="text-amber-600"
          />
          <circle
            cx="50"
            cy="50"
            r="22"
            stroke="currentColor"
            strokeWidth="2"
            className="text-amber-600"
          />
          <path
            d="M50 2v96M2 50h96M14.6 14.6l70.8 70.8M85.4 14.6L14.6 85.4"
            stroke="currentColor"
            strokeWidth="1"
            className="text-amber-600"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
            How It Works
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Get Started in
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              {" "}
              Three Simple Steps
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            From application to launching your first course - we make it simple
            for organizations to start their learning journey.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 right-0 left-0 hidden h-1 -translate-y-1/2 bg-gradient-to-r from-amber-200 via-orange-200 to-red-200 lg:block" />

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="relative z-10 rounded-2xl border border-amber-100 bg-white p-8 shadow-lg shadow-amber-100/50">
                  {/* Step Number */}
                  <div className="absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-lg font-bold text-white shadow-lg shadow-amber-500/30">
                    {step.number}
                  </div>

                  <div className="pt-6">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                      {<step.Icon className="h-8 w-8" />}
                    </div>

                    <h3 className="mb-3 text-xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-6 z-20 hidden lg:block">
                    <svg
                      className="h-12 w-12 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
