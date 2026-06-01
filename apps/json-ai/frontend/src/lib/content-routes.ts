import type { Metadata } from "next";
import { CONTENT_SLUGS } from "@/constants/content";
import type { ContentType } from "@/types/content";

function formatTitle(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function isContentType(value: string): value is ContentType {
  return value in CONTENT_SLUGS;
}

export function isContentRoute(slug: string[]) {
  if (slug.length === 1) {
    return isContentType(slug[0]);
  }

  if (slug.length === 2) {
    return isContentType(slug[0]) && CONTENT_SLUGS[slug[0]].includes(slug[1] as never);
  }

  return false;
}

export function isKnownContentSlug(type: ContentType, slug: string) {
  return CONTENT_SLUGS[type].includes(slug as never);
}

export function getContentTypeStaticParams() {
  return Object.keys(CONTENT_SLUGS).map((type) => ({ type }));
}

export function getContentSlugStaticParams() {
  return Object.entries(CONTENT_SLUGS).flatMap(([type, slugs]) =>
    slugs.map((slug) => ({ type, slug })),
  );
}

export function getContentRouteMetadata(type: ContentType, slug?: string): Metadata {
  const title = formatTitle(slug ?? type);

  if (!slug) {
    return {
      title,
      description: `Browse ${title} guides and articles on JSON-AI.`,
    };
  }

  return {
    title,
    description: `Read about ${title} on JSON-AI.`,
  };
}