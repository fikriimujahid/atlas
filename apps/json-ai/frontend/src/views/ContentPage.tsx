"use client";

import SEO from "@/components/seo/SEO";

interface ContentPageProps {
  type?: string;
  slug?: string;
}

export default function ContentPage({ type, slug }: ContentPageProps) {

  // In a real application, you would fetch the MDX or markdown content from your CMS
  const title = slug ? slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Content Hub";

  return (
    <div className="flex-1 max-w-4xl mx-auto p-8 w-full">
      <SEO title={`${title} | JSON-AI`} description={`Read about ${title} on JSON-AI.`} />
      <div className="prose prose-slate dark:prose-invert lg:prose-lg mx-auto">
        <h1 className="capitalize">{title}</h1>
        <p className="lead">
          This is a placeholder page constructed for programmatic SEO purposes natively within JSON-AI. 
          In a production environment, this route (`/{type}/{slug}`) would dynamically render Markdown 
          or MDX content explaining topics such as JSON Schema, JSON formatting, or general tutorials.
        </p>
        <h2>Overview</h2>
        <p>
          JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write. It is easy for machines to parse and generate.
        </p>
        <p>
          We build tools to help developers deal with JSON payloads faster. Use our navigation menu to explore Formatter, Validator, Minifier, and AI tools.
        </p>
      </div>
    </div>
  );
}
