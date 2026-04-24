import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/app-layout.tsx", [
    index("routes/home.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("/sign-in", "routes/sign-in.tsx"),
    route("/sign-up", "routes/sign-up.tsx"),
    route("/verify-email", "routes/verify-email.tsx"),
    route("/forgot-password", "routes/auth.forgot-password.tsx"),
    route(
      "/reset-password-confirmation",
      "routes/auth.reset-password-confirmation.tsx"
    ),
    route("/inquiry", "routes/inquiry.tsx"),
    route(
      "/email-verification-pending",
      "routes/email-verification-pending.tsx"
    ),
    ...prefix("system", [
      layout("layouts/system-dashboard-layout.tsx", [
        route("dashboard", "routes/system.dashboard.tsx"),
        route("inquiries", "routes/system.dashboard.inquiries.tsx"),
        route("users", "routes/system.dashboard.users.tsx"),
        route("organizations", "routes/system.dashboard.organizations.tsx"),
        route("profile", "routes/system.profile.tsx"),
      ]),
    ]),
    ...prefix("client", [
      layout("layouts/lesson-reader-layout.tsx", [
        route(
          "dashboard/courses/:courseId/lessons/:contentId",
          "routes/client.dashboard.courses.$courseId.lessons.$contentId.tsx"
        ),
      ]),
      layout("layouts/client-dashboard-layout.tsx", [
        route("dashboard", "routes/client.dashboard.tsx"),
        route("dashboard/members", "routes/client.dashboard.members.tsx"),
        route("dashboard/courses", "routes/client.dashboard.courses.tsx"),
        route(
          "dashboard/courses/new",
          "routes/client.dashboard.courses.new.tsx"
        ),
        route(
          "dashboard/courses/:courseId/edit",
          "routes/client.dashboard.courses.$courseId.edit.tsx"
        ),
        route(
          "dashboard/courses/:courseId/modules",
          "routes/client.dashboard.courses.$courseId.modules.tsx"
        ),
        route(
          "dashboard/courses/:courseId/modules/:moduleId/contents/new",
          "routes/client.dashboard.courses.$courseId.modules.$moduleId.contents.new.tsx"
        ),
        route(
          "dashboard/courses/:courseId/modules/:moduleId/contents/:contentId/edit",
          "routes/client.dashboard.courses.$courseId.modules.$moduleId.contents.$contentId.edit.tsx"
        ),
        route(
          "dashboard/courses/:courseId/modules/:moduleId/quizzes/new",
          "routes/client.dashboard.courses.$courseId.modules.$moduleId.quizzes.new.tsx"
        ),
        route(
          "dashboard/courses/:courseId/modules/:moduleId/quizzes/:quizId/edit",
          "routes/client.dashboard.courses.$courseId.modules.$moduleId.quizzes.$quizId.edit.tsx"
        ),
        route(
          "dashboard/courses/:courseId/preview",
          "routes/client.dashboard.courses.$courseId.preview.tsx"
        ),
        route("dashboard/categories", "routes/client.dashboard.categories.tsx"),
        route("dashboard/my-courses", "routes/client.dashboard.my-courses.tsx"),
        route(
          "dashboard/my-learning",
          "routes/client.dashboard.my-learning.tsx"
        ),
        route(
          "dashboard/certificates",
          "routes/client.dashboard.certificates.tsx"
        ),
        route(
          "dashboard/invitations",
          "routes/client.dashboard.invitations.tsx"
        ),
        route(
          "dashboard/live-sessions",
          "routes/client.dashboard.live-sessions.tsx"
        ),
        route("profile", "routes/client.profile.tsx"),
      ]),
    ]),
    route("*", "routes/catch-all.tsx"),
    route("sitemap.xml", "routes/sitemap.xml.ts"),
    route("robots.txt", "routes/robots.txt.ts"),
    route(
      ".well-known/appspecific/com.chrome.devtools.json",
      "routes/[.]well-known.appspecific.[com.chrome.devtools.json].ts"
    ),
  ]),
] satisfies RouteConfig;
