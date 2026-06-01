import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import "../index.css";

export const metadata: Metadata = {
  title: {
    default: "JSON-AI",
    template: "%s | JSON-AI",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  description:
    "The AI-Powered JSON Toolkit. Format, Validate, Minify, Compare, Convert, and Understand JSON with AI.",
  openGraph: {
    title: "JSON-AI",
    description:
      "The AI-Powered JSON Toolkit. Format, Validate, Minify, Compare, Convert, and Understand JSON with AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON-AI",
    description:
      "The AI-Powered JSON Toolkit. Format, Validate, Minify, Compare, Convert, and Understand JSON with AI.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}