import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          The page you requested does not exist in the current static route map.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Back home
          </Link>
          <Link
            href="/tools/json-formatter"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
          >
            Open formatter
          </Link>
        </div>
      </div>
    </div>
  );
}