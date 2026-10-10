# Development Toolchain

The versions below are the ones installed and locked in `pnpm-lock.yaml`.
Update this file whenever a dependency is upgraded.

## Runtime and package manager

| Tool    | Version | Where it is set                                     |
| ------- | ------- | --------------------------------------------------- |
| Node.js | 24 LTS  | `.nvmrc` (`nvm use` picks it up)                    |
| pnpm    | 12.10.1 | `packageManager` in `package.json`                  |

## Application

| Package                   | Version | Role                                             |
| ------------------------- | ------- | ------------------------------------------------ |
| `next`                    | 16.4.0  | App Router, Turbopack, Cache Components          |
| `react`, `react-dom`      | 19.3.0  | UI runtime                                       |
| `next-intl`               | 4.14.9  | English at `/`, Greek at `/el`; routing in `src/proxy.ts` |
| `next-themes`             | 0.4.6   | Light/dark theme through `data-theme` on `<html>` |
| `@next/mdx`               | 16.4.0  | MDX pages (`pageExtensions` in `next.config.ts`) |
| `@mdx-js/loader`          | 3.1.1   | MDX compiler used by `@next/mdx`                 |
| `@mdx-js/react`           | 3.1.1   | MDX component provider                           |
| `@types/mdx`              | 2.0.14  | Types for `.mdx` imports                         |

MDX is configured but no page uses it. The thesis case study is built from
React components in `src/components/thesis/`. A page that does use MDX also
needs an `mdx-components.tsx` at the project root, as the App Router
integration of `@next/mdx` requires.

`next-themes` 0.4.6 carries a local patch, `patches/next-themes@0.4.6.patch`,
applied by pnpm through `patchedDependencies` in `pnpm-workspace.yaml`. The
provider renders its inline theme script only until it has mounted once, so
React does not warn about a script rendered on the client when a navigation
re-renders the provider. No release after 0.4.6 contains a fix (upstream
issue #397, pull request #386). pnpm refuses to install if the version
changes while the patch is listed, so an upgrade must drop or regenerate it
and rerun `pnpm test:e2e`.

Fonts (Geist, Inter, IBM Plex Mono) are loaded through `next/font/google` in
`src/lib/fonts.ts` and self-hosted by Next.js at build time.

## Styling

| Package                  | Version | Role                                                   |
| ------------------------ | ------- | ------------------------------------------------------ |
| `tailwindcss`            | 4.3.3   | Utility classes; design tokens in `src/styles/globals.css` |
| `@tailwindcss/turbopack` | 4.3.3   | Tailwind loader for Turbopack (`turbopack.rules` in `next.config.ts`) |

## Quality

| Package              | Version  | Role                                   |
| -------------------- | -------- | -------------------------------------- |
| `typescript`         | 5.9.3    | Strict mode (`tsconfig.json`)          |
| `eslint`             | 9.39.5   | Flat config in `eslint.config.mjs`     |
| `eslint-config-next` | 16.4.0   | Core Web Vitals and TypeScript rules   |
| `@playwright/test`   | 1.64.0   | End-to-end tests in `tests/`, Chromium |

`pnpm install` warns `deprecated eslint@9.39.5`; the suggested 10.x is
outside the `^9` range in `package.json`. Moving to ESLint 10 is a separate
upgrade and has not been made.

Playwright needs its browser once per machine:

```sh
pnpm exec playwright install chromium
```

## Commands

```sh
nvm use               # Node 24 from .nvmrc
pnpm install
pnpm dev              # development server
pnpm lint
pnpm typecheck
rm -rf .next && pnpm build
rm -rf .next && pnpm test:e2e
```

`pnpm test:e2e` builds the site with `ENABLE_QA_ROUTES=1`, which adds the
internal `/qa/typography` page the typography tests use, and serves it on port 3100.
Stop any server already listening on 3100 first: Playwright reuses it rather
than starting its own. Never deploy a build made with `ENABLE_QA_ROUTES`.

## Deployment

Vercel, at `https://kpapadogiannis.vercel.app` for now. The canonical URL in
metadata is `https://kpapadogiannis.dev`.
