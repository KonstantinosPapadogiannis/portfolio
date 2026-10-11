// The one public identity of the site. Production, preview and local builds
// all emit this origin in canonical links, hreflang, Open Graph, the sitemap,
// robots.txt and structured data. Preview deployments remain noindex below.
export const defaultSiteUrl = "https://kpapadogiannis.dev";

type Env = Partial<Record<string, string | undefined>>;

export function resolveSiteUrl(): string {
  return defaultSiteUrl;
}

// Only the production deployment may be indexed. Vercel preview and
// development deployments (VERCEL_ENV "preview" or "development") answer
// noindex everywhere, so a preview address never competes with the real one.
// Builds outside Vercel count as production.
export function isIndexable(env: Env = process.env): boolean {
  return !env.VERCEL_ENV || env.VERCEL_ENV === "production";
}

export const deployment = {
  siteUrl: resolveSiteUrl(),
  indexable: isIndexable(),
} as const;
