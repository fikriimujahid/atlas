"use client";

import SEO from "@/components/seo/SEO";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, FileJson, FastForward, CheckCircle2 } from "lucide-react";
import { TOOLS } from "@/constants/tools";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Format, Validate and Understand JSON with AI" 
        description="The ultimate AI-powered JSON toolkit for developers. Format, validate, convert, and understand JSON data easily."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-20 md:pt-32 md:pb-32 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance leading-tight">
            The Ultimate <span className="text-primary bg-clip-text">JSON Toolkit</span><br/>Supercharged by AI
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
            Format, Validate, Convert, and Understand JSON instantly. Eliminate formatting syntax errors and let AI explain complex payloads.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/tools/json-formatter">
              <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                Start Formatting <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/ai">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8">
                Try AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need for JSON</h2>
            <p className="text-lg text-muted-foreground">Professional-grade tools built for developers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.path} to={tool.path}>
                  <div className="group relative overflow-hidden rounded-xl border bg-card p-6 h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer flex flex-col items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Use our powerful {tool.name.toLowerCase()} to streamline your workflow.
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="py-24 bg-muted/30 px-4 border-y">
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-background mb-2">New Feature</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">AI JSON Assistant</h2>
            <p className="text-lg text-muted-foreground">
              Stuck with thousands of lines of undocumented JSON? Ask our AI to explain it, generate types, or fix broken payloads automatically.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                "Fix broken JSON instantly",
                "Explain complex JSON structures",
                "Generate custom JSON data",
                "Convert JSON to API mock responses"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link to="/ai">
                <Button>Launch AI Assistant</Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="rounded-xl border bg-background shadow-2xl p-4 overflow-hidden relative">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-xs font-mono text-muted-foreground">json-ai.com/ai</div>
              </div>
              <div className="space-y-4 font-mono text-sm">
                <div className="p-3 bg-muted rounded-lg text-foreground w-11/12 ml-auto">
                  Fix this JSON: `{'{ "name": "John", "age": 30, }'}`
                </div>
                <div className="p-3 bg-primary/10 rounded-lg text-foreground w-11/12">
                  <span className="text-primary font-bold mb-2 inline-block">JSON-AI</span><br/>
                  Here is the corrected JSON (removed trailing comma):<br/>
                  <pre className="mt-2 bg-background p-2 rounded border text-xs">
{`{
  "name": "John",
  "age": 30
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
