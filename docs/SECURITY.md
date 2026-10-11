# Security

The site is static content: no forms, no accounts, no API routes, no
cookies, no analytics and no third-party script, font, image or frame. Every
file it loads comes from its own origin. The headers below are set in
`next.config.ts` (`headers()`) and checked by `tests/security.spec.ts`.

## Response headers

Sent on every response, pages, files and the 404 included:

| Header | Value | Why |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | Files are used only as the type they are sent as. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Other sites see the origin, not the page, when a visitor follows a link out. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()` | The site uses none of these. |
| `Strict-Transport-Security` | `max-age=63072000` | Two years of HTTPS only. No `includeSubDomains` and no `preload`: the site does not decide for other hosts on the domain. Browsers ignore the header over plain HTTP, so local runs are not affected. |
| `Cross-Origin-Opener-Policy` | `same-origin` | A page opened from another site cannot reach this one through `window.opener`. |
| `X-Frame-Options` | `DENY` | No framing, for browsers that do not read `frame-ancestors`. |
| `X-Robots-Tag` | `noindex, nofollow` | Only on Vercel preview and development deployments (`docs/DEPLOYMENT.md`). |

`poweredByHeader: false` removes `X-Powered-By: Next.js`.

## Content security policy

Sent on everything except `/downloads/`:

```text
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none';
base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

- `script-src 'unsafe-inline'`: the pages are prerendered (Cache Components,
  Partial Prerendering), so there is no request in which a nonce could be
  made, and Next.js and the theme script both write inline scripts. This is
  the setup the Next.js guide describes for a policy without nonces. With no
  user input anywhere on the site, there is nothing for an injected inline
  script to come in through. A nonce would make every page dynamic.
- `style-src 'unsafe-inline'`: pages carry `style` attributes: the bar
  lengths in the CUDA and energy figures, the positions in the thesis
  signing flow, and the one `next/image` sets on every image.
- `img-src 'self'`: the portrait, the icons and the share images are all
  files of the site. A `next/image` blur placeholder would need `data:`
  added.
- A development server (`pnpm dev`) adds `'unsafe-eval'` to `script-src` and
  `ws:` to `connect-src` for Fast Refresh. A production build never has them.
- The CV under `/downloads/` gets the other headers but not the policy, so
  no browser's built-in PDF viewer is restricted by rules written for HTML.

`tests/security.spec.ts` checks the policy and loads every page in both
languages with a listener for violation reports; none may appear.

## Caching

`/fonts/:path*` is served `public, max-age=31536000, immutable`. The files
never change under their folder name: a new Inter version goes in a new
folder (`src/config/fonts.ts`). Everything else keeps the Next.js and Vercel
defaults.

## Private details

What the site must never publish (the phone number, the university address,
student numbers, a birth year or age, local paths, the hosts of the course
deployments, repository links) is written as patterns in `tests/privacy.ts`,
never as values. `tests/privacy.spec.ts` checks every page, the 404 page,
`robots.txt`, the sitemap, the scripts and styles the pages load, and every
file in `public/`, including the metadata embedded in the portrait and the
share images. `tests/resume.spec.ts` does the same for the text, links and
document information of the CV.

No source maps are published (`productionBrowserSourceMaps` is off, and the
privacy test checks that no script points at one).

## Dependencies

Checked on 2026-10-11 with pnpm 12.10.1 and Node 24.21.0:

| Command | Result |
| --- | --- |
| `pnpm audit --prod` | No known vulnerabilities |
| `pnpm audit` | 1 high: `braces` ≤ 3.0.3 ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) |

The `braces` advisory is a stack exhaustion on deeply nested brace patterns.
It is reached only through ESLint
(`eslint-config-next > @next/eslint-plugin-next > fast-glob > micromatch > braces`),
which runs on this machine with the patterns in the repository's own
configuration. Nothing of it is in the build or the deployment. The advisory
lists no patched version, so there is nothing to upgrade to. An override to
another major version of `braces` was not made: it would change what
`micromatch` runs on without a fixed release to move to. Check again when
`eslint-config-next` is upgraded.

Run both commands before a release and record the result here.
