import { notFound } from "next/navigation";

// Any path the routes above do not match, so that it gets the localized
// not-found page inside the site layout instead of the bare framework one.
// The first request for a path nobody asked for before (/downloads/old.pdf
// reaches this route with "downloads" as the locale) waits for the complete
// render, so it is answered 404 rather than with a 200 fallback shell.
export const ensureStatic = "navigation";

// The level above needs every parameter listed; one path per locale is
// prerendered, and the rest are rendered on their first request.
export function generateStaticParams() {
  return [{ rest: ["not-found"] }];
}

export default function CatchAllPage() {
  notFound();
}
