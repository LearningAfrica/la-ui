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
    route("/inquiry", "routes/inquiry.tsx"),
    route(
      "/email-verification-pending",
      "routes/email-verification-pending.tsx"
    ),
    ...prefix("system", [
      layout("layouts/system-dashboard-layout.tsx", [
        route("dashboard", "routes/system.dashboard.tsx"),
        route("inquiries", "routes/system.dashboard.inquiries.tsx"),
      ]),
    ]),
    ...prefix("client", [
      layout("layouts/client-dashboard-layout.tsx", [
        route("dashboard", "routes/client.dashboard.tsx"),
        route("dashboard/members", "routes/client.dashboard.members.tsx"),
      ]),
    ]),
    route("sitemap.xml", "routes/sitemap.xml.ts"),
    route(
      ".well-known/appspecific/com.chrome.devtools.json",
      "routes/[.]well-known.appspecific.[com.chrome.devtools.json].ts"
    ),
  ]),
] satisfies RouteConfig;
