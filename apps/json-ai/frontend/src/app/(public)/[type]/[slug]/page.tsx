import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/views/ContentPage";
import {
  getContentRouteMetadata,
  getContentSlugStaticParams,
  isContentType,
  isKnownContentSlug,
} from "@/lib/content-routes";

interface ContentSlugPageProps {
  params: Promise<{
    type: string;
    slug: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getContentSlugStaticParams();
}

export async function generateMetadata({ params }: ContentSlugPageProps): Promise<Metadata> {
  const { type, slug } = await params;

  if (!isContentType(type) || !isKnownContentSlug(type, slug)) {
    return {};
  }

  return getContentRouteMetadata(type, slug);
}

export default async function ContentSlugPage({ params }: ContentSlugPageProps) {
  const { type, slug } = await params;

  if (!isContentType(type) || !isKnownContentSlug(type, slug)) {
    notFound();
  }

  return <ContentPage type={type} slug={slug} />;
}