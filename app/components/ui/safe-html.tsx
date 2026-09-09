import { useMemo } from "react";
import { cn } from "@/lib/utils";

const BLOCKED_ELEMENTS =
  "script,style,iframe,object,embed,form,input,button,textarea,select,option,link,meta,base,svg,math";

function safeUrl(value: string, attribute: "href" | "src"): boolean {
  const normalized = value.trim().toLowerCase();

  if (
    normalized.startsWith("/") ||
    normalized.startsWith("./") ||
    normalized.startsWith("../") ||
    normalized.startsWith("#")
  ) {
    return true;
  }

  if (
    attribute === "src" &&
    /^data:image\/(?:png|jpe?g|gif|webp);base64,/i.test(normalized)
  ) {
    return true;
  }

  try {
    const protocol = new URL(value, "https://learningafrica.invalid").protocol;
    const allowed =
      attribute === "href"
        ? ["http:", "https:", "mailto:", "tel:"]
        : ["http:", "https:"];

    return allowed.includes(protocol);
  } catch {
    return false;
  }
}

function slugHeading(text: string, index: number, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `section-${index}`;
  let candidate = base;
  let suffix = 2;

  while (used.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  used.add(candidate);

  return candidate;
}

export function sanitizeRichHtml(html: string): string {
  // Never emit untrusted HTML during server rendering. The browser performs
  // sanitization before the first client-side injection.
  if (typeof DOMParser === "undefined") return "";

  const document = new DOMParser().parseFromString(html, "text/html");

  document.querySelectorAll(BLOCKED_ELEMENTS).forEach((element) => {
    element.remove();
  });

  document.body.querySelectorAll("*").forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();

      if (
        name.startsWith("on") ||
        name === "style" ||
        name === "srcdoc" ||
        ((name === "href" || name === "src") && !safeUrl(attribute.value, name))
      ) {
        element.removeAttribute(attribute.name);
      }
    }

    if (
      element.tagName === "A" &&
      element.getAttribute("target") === "_blank"
    ) {
      element.setAttribute("rel", "noopener noreferrer");
    }
  });

  const usedHeadings = new Set<string>();

  document.body.querySelectorAll("h2, h3").forEach((heading, index) => {
    heading.id = slugHeading(
      heading.textContent?.trim() ?? "",
      index,
      usedHeadings
    );
  });

  return document.body.innerHTML;
}

export function SafeHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const sanitized = useMemo(() => sanitizeRichHtml(html), [html]);

  return (
    <div
      className={cn(className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      suppressHydrationWarning
    />
  );
}
