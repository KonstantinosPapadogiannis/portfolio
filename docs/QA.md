# QA and Acceptance

## Required local checks

Run:
- lint
- TypeScript typecheck
- production build
- Playwright tests

No browser console errors.

## Playwright coverage

At minimum:
- homepage renders
- English is default
- `/el` renders Greek
- language switch preserves current route
- desktop nav
- mobile nav
- theme toggle
- thesis case study opens
- project routes
- GitHub link
- LinkedIn link
- email mailto
- carousel controls
- carousel keyboard navigation
- resume route
- internal links
- reduced-motion behavior where practical

## Visual sizes

Capture:
- 1440 × 900
- 1728 × 1117
- 768 × 1024
- 390 × 844

Compare desktop/mobile against local Figma exports.

## Three mandatory visual passes

### Pass 1 — Structure
Check:
- page width
- section position
- hero proportion
- project hierarchy
- portrait
- footer
- mobile order

### Pass 2 — Typography
Check:
- font size
- weight
- line height
- line breaks
- metadata
- text measure
- overlap
- contrast

### Pass 3 — Human polish
Ask:
- does anything look AI-generated?
- too many cards?
- too much radius?
- too many tiny labels?
- too much monospace?
- too many arrows?
- too much decoration?
- does the footer look like a real site?
- is the architecture diagram integrated?
- does mobile look deliberately designed?

Fix issues after each pass.

## Acceptance checklist

- [ ] visually faithful to desktop Figma reference
- [ ] visually faithful to mobile Figma reference
- [ ] known Figma text collisions fixed
- [ ] repeated full-name labels removed
- [ ] English default
- [ ] complete Greek version
- [ ] route-preserving locale switch
- [ ] real portrait
- [ ] no fake experience
- [ ] no fake publication
- [ ] correct thesis attribution
- [ ] real thesis facts
- [ ] architecture redrawn, not old PNG pasted
- [ ] social icons clickable
- [ ] ORCID not invented
- [ ] polished button states
- [ ] carousel only where useful
- [ ] no autoplay carousel
- [ ] no broken links
- [ ] no lorem ipsum
- [ ] no AI marketing language
- [ ] no generic gradient hero
- [ ] no fake terminal
- [ ] no skill meters
- [ ] responsive 390/768/1440/1728
- [ ] keyboard accessible
- [ ] reduced motion
- [ ] SEO
- [ ] hreflang/canonical correct
- [ ] lint
- [ ] typecheck
- [ ] build
- [ ] Playwright
- [ ] README

## Homepage phase status

Commands (Node from `.nvmrc`):

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
```

`pnpm test:e2e` builds with `ENABLE_QA_ROUTES=1` and serves on port 3100.
Every test also fails on a console error or warning, an uncaught
exception, an HTTP error or a failed request (`tests/fixtures.ts`). With
JavaScript turned off, the scripts the browser declines to load are not
failures.

| Spec | Covers |
|---|---|
| `foundation.spec.ts` | English default, `/el`, skip link, language switcher markup, canonical and hreflang on the production domain, no locale redirect or cookie, résumé page and PDF, theme toggle, `noindex` on QA routes, the thesis case study indexable, sitemap |
| `homepage.spec.ts` | hero actions (Selected work, Résumé PDF, GitHub, LinkedIn), full name in the hero and the footer but not the header, brand (`K. Papadogiannis` in the header, the full name in the footer and the metadata, no visible `KP` on the homepage or the thesis page), architecture figure, portrait load and ratio, six projects, thesis link, the education record (average `7.51 / 10` in English, `7,51 / 10` in Greek, thesis `10 / 10`; no `7.45`, "Very Good", "Λίαν Καλώς", course counts or ECTS anywhere in the page or its metadata), Academic highlights as a section of its own (four groups, the sixteen verified courses with their grades, no thesis row, no graphics), Academic highlights at 320px and 390px (no overflow, names never under their grade, grades in one column), My story (a section of its own after About: statement, three chapters, the verified facts including Peristeri, PlayStation 2, W3Schools, DevOps, Computer Architecture and Anastasia Zerva, the collaboration as research-oriented and never institutional, the pull statement and the closing line, no clichés, no images, not repeated in About), no year of birth or age (nor any year before 2000) on the homepage, the thesis page or the résumé page (text, metadata, JSON-LD), the scroll reveal (hidden below the fold, shown on scroll, never hidden again, no change in height), everything shown at once under reduced motion and without JavaScript, the story at 320px, 390px and 640px (a 1280px window at 200% zoom: one column, no overflow), section order (Selected work, About, My story, Academic highlights, Interests, More work, Technologies), footer links (navigation as in the header; GitHub, LinkedIn and ORCID under Elsewhere with `rel="me"` in the same tab; one ORCID link, to the public record, named with the iD; one mail link showing the address once) and Back to top, the footer at 320px and 390px (no overflow, links at least 44px tall), the three profiles on one line from 390px up, no phone number, keyboard order with a visible focus ring at each stop |
| `navigation.spec.ts` | desktop and mobile navigation in both languages, Escape and focus return, links from another page, no horizontal overflow at 390/768/1440/1728 on every page |
| `theme-locale.spec.ts` | language switch keeps the route and the theme (header and footer), no light frame after dark, keyboard language links, clean loads in both themes |
| `thesis.spec.ts` | both languages: title, canonical, hreflang and CreativeWork JSON-LD, unique ids, links back to the work section, thirteen sections in the contents list, disclaimer and attribution, seven actors, nine signing steps, evidence counts and timings, five limitations, the data gallery (no autoplay, previous/next with wrap-around, arrow keys, indicators, inert hidden slides, announcement), dark theme kept across a language switch |
| `typography.spec.ts` | every text run drawn by its language's web font, Greek coverage, uppercase Greek without tonos, equal line boxes |

Deferred to later phases (no such pages yet): the other project routes.

Note for Playwright: after a reload or a second navigation in the same
page, do not wait for `networkidle`. Chromium serves cached route
prefetches and revalidates them in the background, and those requests
never report as finished. Wait for `load` and `document.fonts.ready`.
