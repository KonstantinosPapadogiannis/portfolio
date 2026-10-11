# Engineering Requirements

## Stack

Preferred:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- MDX
- next-intl
- next-themes
- Playwright
- pnpm
- next/font

Do not use a heavyweight UI framework.

Do not turn the project into a shadcn showcase.

Use Server Components by default; Client Components only where needed.

## Safe initialization

The project directory already contains user files.

Do not blindly scaffold over the current directory.

Preserve:
- `PORTFOLIO_CASE_STUDY.md`
- assets
- portrait
- Figma exports
- architecture source
- user ZIPs

Scaffold safely in place or merge from a temporary directory.

## Suggested structure

```text
src/
  app/
  components/
  config/
  data/
  i18n/
  lib/
  styles/

content/
  en/work/
  el/work/

public/
  images/
  diagrams/
  downloads/

assets/
  [source/reference material]
```

## Central config

Keep:
- canonical site URL
- email
- GitHub
- LinkedIn
- ORCID
- location
- future domain

in one central config.

Canonical:
`https://kpapadogiannis.dev`

A temporary `vercel.app` preview address must not replace the canonical
identity in metadata.

No DNS/domain changes now.

## Resume

Search locally for the actual English CV PDF.

If found:
- preserve it
- expose View/Download
- do not regenerate it

If missing:
- make `/resume` work without a broken PDF link
- record a TODO

## Social links

GitHub:
`https://github.com/KonstantinosPapadogiannis`

LinkedIn:
`https://www.linkedin.com/in/konstantinos-papadogiannis/`

Email:
`mailto:konstantinospapadogiannis.dev@gmail.com`

ORCID:
only when exact URL is known.

External links:
- target blank where appropriate
- `rel="noopener noreferrer"`
- accessible labels

## Accessibility

Required:
- semantic HTML
- logical headings
- skip-to-content
- keyboard navigation
- visible focus
- good contrast
- alt text
- proper aria labels
- reduced-motion
- accessible carousel
- accessible language switcher
- touch-friendly controls
- correct locale `lang`

## SEO

Required:
- title templates
- descriptions
- canonical URLs
- Open Graph
- social metadata
- sitemap
- robots
- favicon
- structured data where appropriate
- localized hreflang/canonical behavior

No fake credentials.

## Performance

Prefer:
- small JS
- `next/image`
- `next/font`
- CSS transitions
- programmatic SVG

Avoid:
- huge animation libraries
- unnecessary third-party scripts
- oversized images
- client components without need

## Motion

Good:
- 140–200ms link/button transition
- small arrow movement
- theme transition
- carousel transition

Bad:
- section fade-ups everywhere
- floating loops
- bouncing controls
- scroll-jacking
- particle backgrounds
- parallax hero

## Git / deployment

Before push:
`gh auth status`

Required account:
`KonstantinosPapadogiannis`

Do not push if wrong account is authenticated.

Do not deploy until:
- lint passes
- typecheck passes
- build passes
- tests pass
- visual QA passes

Ask user before first push/deployment.
