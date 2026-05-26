import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { env } from "@/lib/env";
import {
  navigationSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/utils/structured-data";
import type { Route } from "./+types/root";
import "./app.css";

const GLOBAL_JSON_LD = JSON.stringify([
  organizationSchema(),
  websiteSchema(),
  navigationSchema(),
]);

export const links: Route.LinksFunction = () => [
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "192x192",
    href: "/android-chrome-192x192.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "512x512",
    href: "/android-chrome-512x512.png",
  },
  {
    rel: "manifest",
    href: "/site.webmanifest",
  },
  {
    rel: "icon",
    type: "image/svg+xml",
    href: "/favicon.ico",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: GLOBAL_JSON_LD }}
        />
        {env.VITE_GTAG_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${env.VITE_GTAG_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${env.VITE_GTAG_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
