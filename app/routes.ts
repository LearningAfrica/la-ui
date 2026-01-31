import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/app-layout.tsx", [
    index("routes/home.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("inquiries", "routes/inquiries.tsx"),
    route("sitemap.xml", "routes/sitemap.xml.ts"),
    route(
      ".well-known/appspecific/com.chrome.devtools.json",
      "routes/[.]well-known.appspecific.[com.chrome.devtools.json].ts"
    ),
  ]),
] satisfies RouteConfig;
