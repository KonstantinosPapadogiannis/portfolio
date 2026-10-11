// Where the site is published, read once from the environment of the build.
//
// The canonical origin, used by metadata, the sitemap, robots.txt and the
// structured data, is the first of:
//   1. SITE_URL, set by hand to pin an origin (only the origin is kept);
//   2. VERCEL_PROJECT_PRODUCTION_URL, which Vercel sets in every deployment to
//      the project's production domain: the shortest custom domain once one
//      is added to the project, kpapadogiannis.vercel.app until then;
//   3. the Vercel production address below, for builds outside Vercel.
//
// Moving to a custom domain therefore needs no change here: add the domain to
// the Vercel project once its DNS resolves (docs/DEPLOYMENT.md).

export const defaultSiteUrl = "https://kpapadogiannis.vercel.app";

type Env = Partial<Record<string, string | undefined>>;

export function resolveSiteUrl(env: Env = process.env): string {
  const pinned = env.SITE_URL?.trim();
  if (pinned) return new URL(pinned).origin;
  const production = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return new URL(`https://${production}`).origin;
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
