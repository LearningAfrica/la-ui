import {
  BookOpen,
  Building2,
  GraduationCapIcon,
  PencilIcon,
  ShieldIcon,
  TvMinimal,
  Workflow,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  FeatureIcon: LucideIcon;
  color: string;
};

const features: Feature[] = [
  {
    title: "Dedicated Workspaces",
    description:
      "Each organization gets an isolated workspace with full control over content, users, and learning paths.",
    FeatureIcon: Building2,

    color: "from-amber-400 to-orange-500",
  },
  {
    title: "Course Builder",
    description:
      "Intuitive tools to create structured courses with modules, materials, quizzes, and assessments.",
    FeatureIcon: BookOpen,
    color: "from-green-400 to-emerald-500",
  },
  {
    title: "Progress Tracking",
    description:
      "Real-time tracking of learner progress, completion rates, and performance analytics.",
    FeatureIcon: Workflow,
    color: "from-blue-400 to-indigo-500",
  },
  {
    title: "Quiz & Assessments",
    description:
      "Create quizzes with multiple question types, automatic grading, and detailed result analysis.",
    FeatureIcon: PencilIcon,
    color: "from-purple-400 to-violet-500",
  },
  {
    title: "Live Sessions",
    description:
      "Integrate live video sessions to enhance learning with real-time interaction.",
    FeatureIcon: TvMinimal,
    color: "from-amber-400 to-orange-500",
  },
  {
    title: "Digital Certificates",
    description:
      "Automatically issue verifiable digital certificates upon course completion.",
    FeatureIcon: GraduationCapIcon,
    color: "from-pink-400 to-rose-500",
  },
  {
    title: "Role-Based Access",
    description:
      "Granular access control with distinct roles for admins, instructors, and learners.",
    FeatureIcon: ShieldIcon,
    color: "from-cyan-400 to-teal-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-gray-950">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 h-full w-1/3 opacity-5">
        <svg
          className="h-full w-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            className="text-amber-600"
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29,72.4,40.9C63.4,52.8,51,62.2,37.4,68.3C23.8,74.4,9,77.3,-5.8,79.5C-20.6,81.7,-35.5,83.2,-48.6,78.3C-61.8,73.4,-73.3,62.1,-80.2,48.5C-87.1,34.9,-89.4,19,-88.1,3.8C-86.8,-11.4,-82,-22.4,-74.9,-32.3C-67.8,-42.2,-58.3,-51,-47.1,-59.3C-35.8,-67.6,-22.8,-75.5,-8.2,-78.8C6.4,-82.1,30.5,-83.6,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            Features
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            Everything You Need to
            <span className="block bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Deliver Exceptional Learning
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Powerful tools designed specifically for African organizations to
            create, manage, and deliver impactful learning experiences.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:border-amber-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:shadow-gray-900/50 dark:hover:border-amber-800"
            >
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} mb-6 text-white transition-transform duration-300 group-hover:scale-110`}
              >
                {<feature.FeatureIcon className="h-7 w-7" />}
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>

              {/* Decorative corner */}
              <div className="absolute top-4 right-4 h-8 w-8 opacity-10">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 0L32 16L16 32L0 16L16 0Z"
                    fill="currentColor"
                    className="text-amber-600"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
