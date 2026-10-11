# Konstantinos Papadogiannis — Portfolio

Personal engineering portfolio. Backend engineering, distributed systems, and cloud infrastructure, documented through academic project work including a Hyperledger Fabric thesis.

## Stack

- Next.js 16 (App Router)
- React 19, TypeScript (strict)
- Tailwind CSS 4
- next-intl (English default at `/`, Greek at `/el`)
- next-themes (light default, restrained dark mode)
- MDX for long-form case studies
- Playwright for smoke/E2E testing
- pnpm

## Requirements

- Node 24 (see `.nvmrc`)
- pnpm 12

```bash
nvm use
```

## Development

```bash
pnpm install
pnpm dev
```

```bash
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
pnpm build         # production build
pnpm test:e2e      # Playwright
```

`pnpm test:e2e` builds the site and serves it on port 3100 (an already
running server on that port is reused outside CI). Install the browser once
with `pnpm exec playwright install chromium`; no system packages are needed
on the development machine.

### QA routes

`/qa/typography` and `/el/qa/typography` show every text role in both
languages, the full Greek character set and button states. They exist only
when the site is built with `ENABLE_QA_ROUTES=1` (the Playwright config sets
it) and return 404 in a normal build. They are `noindex` and not in the
sitemap.

```bash
ENABLE_QA_ROUTES=1 pnpm build && pnpm start
```

## Fonts

Loaded with `next/font/google` and self-hosted at build time:

- Geist: English text and the name in the header and footer
- Inter: Greek text and labels (Geist has no Greek)
- IBM Plex Mono, regular: English labels, code and tech tags

The typeface follows the element's `lang` attribute, so Greek must always be
marked `lang="el"`. Details in `docs/design-system-extracted.md` §4.1 and
`docs/I18N.md`.

## Notes

- `next build` prints `Experiments: ⨯ optimisticRouting`. That is the
  intentional opt-out explained in `next.config.ts` and `docs/I18N.md`.
- The language comes from the URL only: no browser-language redirect, no
  locale cookie.

## Structure

```text
src/
  app/[locale]/   routes (locale-prefixed, English unprefixed)
  components/     shared UI and layout components
  config/         central site config (contact links, URLs) and navigation
  i18n/           next-intl routing, navigation, request config
  lib/            font loading
  styles/         global CSS and design tokens
  proxy.ts        locale routing (Next.js proxy, formerly middleware)

tests/            Playwright specs and shared fixtures

cv/               LaTeX source of the public CV PDF and its build script

content/
  en/             English UI strings and case study content
  el/             Greek UI strings and case study content

assets/           source/reference material (Figma exports, portrait, thesis diagrams, CV)
public/           production-ready static assets served by the app

docs/             design and engineering reference documents
```

`assets/` holds original reference material and is not served directly; production copies are placed under `public/` as needed.
