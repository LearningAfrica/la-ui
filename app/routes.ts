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
    layout("layouts/dashboard-shell-layout.tsx", [
      route("dashboard", "routes/personal.home.tsx"),
      route("dashboard/invitations", "routes/personal.invitations.tsx"),
      route("dashboard/inquiries", "routes/personal.inquiries.tsx"),
      route("dashboard/orgs", "routes/personal.orgs.tsx"),
      route("dashboard/profile", "routes/client.profile.tsx"),
    ]),
    ...prefix("dashboard/org/:orgId", [
      layout("layouts/lesson-reader-layout.tsx", [
        route(
          "courses/:courseId/lessons/:contentId",
          "routes/client.dashboard.courses.$courseId.lessons.$contentId.tsx"
        ),
      ]),
      layout("layouts/org-shell-layout.tsx", [
        index("routes/client.dashboard.tsx"),
        route("members", "routes/client.dashboard.members.tsx"),
        route("courses", "routes/client.dashboard.courses.tsx"),
        route("courses/new", "routes/client.dashboard.courses.new.tsx"),
        route(
          "courses/:courseId/edit",
          "routes/client.dashboard.courses.$courseId.edit.tsx"
        ),
        route(
          "courses/:courseId/modules",
          "routes/client.dashboard.courses.$courseId.modules.tsx"
        ),
        route(
          "courses/:courseId/modules/:moduleId/contents/new",
          "routes/client.dashboard.courses.$courseId.modules.$moduleId.contents.new.tsx"
        ),
        route(
          "courses/:courseId/modules/:moduleId/contents/:contentId/edit",
          "routes/client.dashboard.courses.$courseId.modules.$moduleId.contents.$contentId.edit.tsx"
        ),
        route(
          "courses/:courseId/modules/:moduleId/quizzes/new",
          "routes/client.dashboard.courses.$courseId.modules.$moduleId.quizzes.new.tsx"
        ),
        route(
          "courses/:courseId/modules/:moduleId/quizzes/:quizId/edit",
          "routes/client.dashboard.courses.$courseId.modules.$moduleId.quizzes.$quizId.edit.tsx"
        ),
        route(
          "courses/:courseId/preview",
          "routes/client.dashboard.courses.$courseId.preview.tsx"
        ),
        route("categories", "routes/client.dashboard.categories.tsx"),
        route("my-courses", "routes/client.dashboard.my-courses.tsx"),
        route("my-learning", "routes/client.dashboard.my-learning.tsx"),
        route("certificates", "routes/client.dashboard.certificates.tsx"),
        route(
          "instructor-certificates",
          "routes/client.dashboard.instructor-certificates.tsx"
        ),
        route(
          "organization-certificates",
          "routes/client.dashboard.organization-certificates.tsx"
        ),
        route("org-progress", "routes/client.dashboard.org-progress.tsx"),
        route("invitations", "routes/client.dashboard.invitations.tsx"),
        route("live-sessions", "routes/client.dashboard.live-sessions.tsx"),
        route(
          "live-sessions/:sessionId/join",
          "routes/client.dashboard.live-sessions.$sessionId.join.tsx"
        ),
      ]),
    ]),
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
      layout("layouts/platform-shell-layout.tsx", [
        route("dashboard", "routes/system.dashboard.tsx"),
        route("inquiries", "routes/system.dashboard.inquiries.tsx"),
        route("users", "routes/system.dashboard.users.tsx"),
        route("organizations", "routes/system.dashboard.organizations.tsx"),
        route("profile", "routes/system.profile.tsx"),
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
