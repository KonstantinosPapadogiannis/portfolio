# Deployment

The site is meant for Vercel, at `https://kpapadogiannis.vercel.app` first and
at `https://kpapadogiannis.dev` once that domain is registered and pointed at
the project. Nothing has been deployed from this repository yet. Neither the
domain nor its DNS records exist yet.

## What the build needs

| Setting | Value | Where it is set |
| --- | --- | --- |
| Node.js | 24.x | `engines.node` in `package.json` (Vercel reads it), `.nvmrc` locally |
| pnpm | 12.10.1 | `packageManager` in `package.json`, lockfile `pnpm-lock.yaml` |
| Install | `pnpm install --frozen-lockfile` | pnpm uses a frozen lockfile by default in CI, which Vercel is |
| Build | `pnpm build` (`next build`) | Vercel's Next.js preset |
| Output | `.next` | Vercel's Next.js preset |

No environment variable is required. The build needs nothing outside the
repository: the CV PDF, the share images and the Inter files are committed
under `public/`, and the fonts from `next/font/google` are downloaded at build
time.

After the first deployment, check in the build log that Vercel used Node 24
and pnpm 12.10.1. If it did not, set them in the project's settings rather
than changing the lockfile.

Never set `ENABLE_QA_ROUTES` on Vercel. It adds the internal `/qa/*` pages
that the tests use.

## The canonical address

`src/config/deployment.ts` decides the origin used in canonical links,
hreflang alternates, Open Graph URLs, the sitemap, `robots.txt` and the
structured data. It takes the first of:

1. `SITE_URL`, if set (only its origin is kept);
2. `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel sets in every deployment to
   the project's production domain: `kpapadogiannis.vercel.app` now, the
   shortest custom domain once one is added;
3. `https://kpapadogiannis.vercel.app`, for builds outside Vercel.

Until the custom domain is live, nothing on the site points at
`kpapadogiannis.dev`, and no redirect to it exists. `tests/seo.spec.ts`
checks both.

## Preview deployments

Only the production deployment may be indexed (`isIndexable()`). When
`VERCEL_ENV` is `preview` or `development`:

- every response, the CV included, carries `X-Robots-Tag: noindex, nofollow`;
- every page has `<meta name="robots" content="noindex, nofollow">`;
- `robots.txt` disallows everything and names no sitemap.

Preview pages still give the production address as canonical, so a preview
link shared by mistake points search engines and share cards at the real
site.

## First deployment (manual)

1. On GitHub, create `KonstantinosPapadogiannis/portfolio`, check
   `gh auth status` shows that account, and push `main`.
2. On Vercel, import the repository. Keep the detected Next.js preset and the
   default install, build and output settings. Add no environment variable.
3. Deploy. In the build log, check Node 24 and pnpm 12.10.1.
4. Open `https://kpapadogiannis.vercel.app` and check:
   - `/`, `/el`, `/resume` and the six case studies load, in both themes;
   - `/downloads/konstantinos-papadogiannis-cv.pdf` opens the one-page CV;
   - `view-source:` shows `https://kpapadogiannis.vercel.app` in the
     canonical link and `og:image`;
   - `curl -sI https://kpapadogiannis.vercel.app/` shows the headers in
     `docs/SECURITY.md` and no `X-Robots-Tag`;
   - `curl -sI` on a preview deployment's address shows
     `X-Robots-Tag: noindex, nofollow`.
5. Optionally, add the address to Google Search Console and submit
   `/sitemap.xml`.

## Moving to kpapadogiannis.dev (manual, later)

The site moves to the new domain without a code change; only the last step
edits the code, for builds made outside Vercel. In order:

1. Register `kpapadogiannis.dev`. `.dev` domains are served over HTTPS only;
   Vercel issues the certificate.
2. In the Vercel project, under Domains, add `kpapadogiannis.dev` (and
   `www.kpapadogiannis.dev` if wanted, redirecting to the bare domain).
3. At the registrar, create the DNS records Vercel shows for the domain.
   Copy them from Vercel rather than from this file: they can change.
4. Wait until Vercel shows the domain as valid and its certificate as issued.
5. Redeploy production. `VERCEL_PROJECT_PRODUCTION_URL` is now the custom
   domain, so canonical links, the sitemap, `robots.txt`, the share cards
   and the structured data use it.
6. Only then, under Domains, make `kpapadogiannis.vercel.app` redirect (308)
   to `kpapadogiannis.dev`.
7. Check with `curl -sI` that `https://kpapadogiannis.dev/` answers 200 with
   the security headers, and that a page's canonical link is on the new
   domain. In Search Console, add the new domain.
8. Update `defaultSiteUrl` in `src/config/deployment.ts` and the test in
   `tests/seo.spec.ts` that expects the Vercel address, so builds outside
   Vercel use the new domain too.

## Files that are generated and committed

| File | Made by | When to make it again |
| --- | --- | --- |
| `public/downloads/konstantinos-papadogiannis-cv.pdf` | `cv/build.sh` (`cv/README.md`) | When the CV changes |
| `public/og/en.png`, `public/og/el.png` | `scripts/og-images.mjs`, from the QA page `/qa/og` | When the hero headline, the name or the degree changes |
| `public/fonts/inter-4.001/*` | Inter 4.001 as Google Fonts serves it, one file per script (licence in `OFL.txt`) | When Inter is upgraded |

The Inter files are cached for a year as immutable (`docs/SECURITY.md`). A new
version goes in a new folder, `public/fonts/inter-<version>/`, and the folder
name changes in `src/config/fonts.ts` and in the `@font-face` rules in
`src/styles/globals.css`.

## Fonts and preloads

- Every page preloads Inter's Greek file: the English pages show "ΕΛ" in the
  language switcher. React sends the preload (`src/components/site-document.tsx`).
- Greek pages also preload Inter's Latin file, for the Latin words in Greek
  sentences. `next.config.ts` sends that preload as a `Link` header on
  `/el/*`, only to requests without an `rsc` header: the client router's own
  requests do not get it, so a page already open never gets a second preload
  it cannot use.
- Geist and IBM Plex Mono come through `next/font/google`, which preloads
  them.
