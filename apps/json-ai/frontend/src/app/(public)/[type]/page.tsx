import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/views/ContentPage";
import {
  getContentRouteMetadata,
  getContentTypeStaticParams,
  isContentType,
} from "@/lib/content-routes";

interface ContentTypePageProps {
  params: Promise<{
    type: string;
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getContentTypeStaticParams();
}

export async function generateMetadata({ params }: ContentTypePageProps): Promise<Metadata> {
  const { type } = await params;

  if (!isContentType(type)) {
    return {};
  }

  return getContentRouteMetadata(type);
}

export default async function ContentTypePage({ params }: ContentTypePageProps) {
  const { type } = await params;

  if (!isContentType(type)) {
    notFound();
  }

  return <ContentPage type={type} />;
}