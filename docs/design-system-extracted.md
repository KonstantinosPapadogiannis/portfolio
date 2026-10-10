# Design System — Extracted from Unified Pass 2 Figma References

Source files:
- `assets/references/homepage-desktop.png` — 1440 × 2930
- `assets/references/homepage-mobile.png` — 390 × 3440

Everything below is read directly off these two PNGs. Where a value could not
be pinned exactly from a flat screenshot (no inspector access), it is marked
**[approx]** and will need confirmation in-browser during implementation.

> **Brand (superseded).** The references show a `KP` mark in the header and
> footer. It is retired. The header reads `K. Papadogiannis`, the footer
> `Konstantinos Papadogiannis`, the metadata uses the full name, and the
> favicon is a separate approved asset. Where §1–§15 mention `KP` they
> describe the references only; §16 describes what is built.

---

## 1. Layout / Grid

**Desktop (1440 canvas)**
- Page gutter: content starts/ends at ~40px from each edge → effective max
  content width ≈ **1360px**, centered.
- Hero and "Selected work" intro blocks sit in that same 1360px band.
- The thesis flagship row (case study text + architecture panel) splits
  roughly **58% / 42%** between the text column and the panel column, with a
  gutter of ~**40px [approx]** between them.
- The About section splits roughly **60% text / 40% portrait**, with the
  portrait column right-aligned to the same 1360px edge.
- "More work" (projects 02–04) is a **3-column grid**, equal width columns,
  separated by thin vertical rule lines (1px, border color) running the full
  height of the row — not just gaps.
- Footer uses a **4-column** layout: brand block (widest, ~2 units), then
  Navigate, Elsewhere, Contact (each ~1 unit), roughly matching the main
  content width/gutters above.

**Mobile (390 canvas)**
- Side gutter: ~**20px** both edges (content width ≈ 350px).
- Everything collapses to a single column, full-width.
- Project grid (02–04) stacks vertically, no vertical rule dividers (would
  need horizontal rules instead — see §12).

## 2. Breakpoints and Responsive Behaviour

Only two states are directly observed (1440 and 390). Treat these as the
confirmed endpoints; intermediate tablet behavior is an **[approx]**
extrapolation, not shown in the source:

- **Desktop ≥ ~1024–1280px [approx]**: multi-column layout as described above
  (2-col hero text/motif, 2-col about, 3-col project grid, 4-col footer).
- **Mobile ≤ ~640px [approx]**: fully single-column, stacked, as in the
  mobile reference.
- A tablet intermediate (e.g. 768–1023px) is not shown in either reference.
  Recommend collapsing to the mobile single-column pattern early (around
  768px) rather than inventing an unverified 2-column tablet layout, since
  nothing in the source confirms one.

## 3. Color Tokens

Matches `docs/ART_DIRECTION.md` palette; confirmed visually against the
screenshots (flat fills, no gradients anywhere):

```css
--background: #F3F1EB; /* warm off-white page background, both breakpoints */
--ink:        #15181D; /* headline / primary text */
--navy:       #263747; /* primary button fill, footer background */
--steel:      #52708A; /* small accent use — sparingly, e.g. possible focus/hover */
--muted:      #6F716F; /* body copy, secondary text, eyebrow labels */
--border:     #D7D3CB; /* hairline dividers, card borders, vertical rules */
--surface:    #FBFAF6; /* slightly lighter-than-background panel fill (thesis architecture card) */
```

Footer background reads as a **deep navy**, close to `--navy` but visually
slightly darker/denser than the button fill — likely the same token at full
opacity against the warm background contrast, or a slightly deeper shade
**[approx, needs eyedropper confirmation in-browser]**.

No purple, no blue-violet, no neon, no gradients of any kind observed on
either screenshot — consistent with the anti-slop rules.

### 3.1 Implemented tokens (foundation)

Defined in `src/styles/globals.css`. The light theme keeps the extracted
palette with one change: `--muted` moved from `#6F716F` to `#696B69`, because
the extracted value measured 4.36:1 on the page background and failed WCAG AA
for body text. The shift is too small to see next to the reference.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | `#F3F1EB` | `#181A1D` | page |
| `--surface` | `#FBFAF6` | `#1F2226` | panels, architecture card |
| `--ink` | `#15181D` | `#EBE8E1` | headings, body, nav |
| `--muted` | `#696B69` | `#A19F99` | secondary text, labels, inactive language |
| `--border` | `#D7D3CB` | `#2F3237` | hairlines, outlines |
| `--steel` | `#52708A` | `#8FA9BF` | text-link hover, selection |
| `--navy` | `#263747` | `#435D76` | primary button fill |
| `--navy-hover` | `#324A60` | `#4B6882` | primary hover |
| `--navy-active` | `#1C2A36` | `#3A5167` | primary pressed |
| `--on-navy` | `#F3F1EB` | `#F3F1EB` | label on navy |
| `--focus-ring` | `#52708A` | `#8FA9BF` | 2px outline, 2px offset |

Dark is deep graphite rather than black, with warm near-white text. Steel
and navy are lifted and desaturated so links, focus rings and the primary
button still read on the dark ground. Navy on dark keeps its role as the one
filled accent; it lightens on hover and darkens on press, as in light.

The footer band (§12) has its own tokens: `--footer` (`#263747` light,
`#1D2834` dark), with `--footer-ink`, `--footer-text`, `--footer-soft`,
`--footer-muted`, `--footer-rule` and `--footer-focus` for the text, rules
and focus ring on it.

**Light canvas, measured.** Sampled with PIL from the reference PNGs (sRGB,
opaque), the page ground is exactly `#F3F1EB`, `rgb(243, 241, 235)`: 67.5% of
`homepage-desktop.png` and 70.3% of `homepage-mobile.png`, the same value at
the header, hero, thesis, About and More Work and in the gaps between them.
The other fills are the footer `#263747` (which settles the eyedropper note
above), the portrait placeholder `#E9E6DF` and the architecture panel
`#FBFAF6`. There is no white anywhere. `html` and `body` both take
`--background`, and every section stays transparent, so the only surfaces
painted over the canvas are the architecture panel, the hairlines, the
primary button and the footer. A Playwright check in `homepage.spec.ts`
holds this at 1440 and 390 in both languages.

### 3.2 Contrast (WCAG 2.2 AA)

Text needs 4.5:1, non-text UI (focus ring) 3:1. Borders are decorative and
carry no information on their own; the disabled button (40% opacity) is an
inactive component and exempt.

| Pairing | Light | Dark |
|---|---|---|
| ink / background | 15.75 | 14.25 |
| ink / surface | 17.04 | 13.05 |
| muted / background | 4.76 | 6.59 |
| muted / surface | 5.15 | 6.03 |
| steel / background (hover text) | 4.60 | 7.14 |
| steel / surface | 4.97 | 6.54 |
| on-navy / navy | 10.81 | 6.06 |
| on-navy / navy-hover | 8.14 | 5.16 |
| on-navy / navy-active | 12.97 | 7.28 |
| ink / secondary hover (steel 10%) | 13.94 | 12.12 |
| ink / secondary active (steel 15%) | 13.13 | 11.03 |
| focus ring / background (3:1) | 4.60 | 7.14 |
| focus ring / surface (3:1) | 4.97 | 6.54 |
| selection: surface / steel | 4.97 | 6.54 |
| border / background (decorative) | 1.32 | 1.36 |

All required pairings pass in both themes.

The theme is stored by `next-themes` in `localStorage` and applied as
`data-theme` on `<html>` before first paint. Switching language replaces the
`[locale]` root layout, and React clears the attributes of `<html>` while
doing so; `ThemeAttributeGuard` (`src/components/theme-provider.tsx`)
restores the attribute in a layout effect so no frame is painted in the
wrong theme. `tests/theme-locale.spec.ts` records `data-theme` on every frame
and fails if a dark page ever paints light.

## 4. Typography

**Primary sans** (headlines, nav, body) — geometric/grotesk modern sans,
consistent with "Geist or equivalent" per ART_DIRECTION.md.

**Monospace** (IBM Plex Mono or equivalent) used sparingly, only for:
- eyebrow/meta labels: `KONSTANTINOS PAPADOGIANNIS / ATHENS, GR`,
  `SELECTED WORK`, `SYSTEM ARCHITECTURE / PROJECT-DERIVED`, `PRIVATE DATA`,
  `TESTING`, `ABOUT / BACKGROUND`, `MORE WORK`, `NAVIGATE`, `ELSEWHERE`,
  `CONTACT`, nav language switcher `EN · EΛ`
- tech-tag pills under the thesis case study (`Hyperledger Fabric`, `Go`,
  `React / TypeScript`, `Web Crypto API`)
- footer micro-copy: `Built with Next.js + TypeScript · Deployed on Vercel`
- the "DISTRIBUTED LEDGER / SYSTEM TOPOLOGY" caption under the hero motif

**Approximate type scale [approx, measured against 1440 canvas]:**

| Role | Size | Weight | Line height | Notes |
|---|---|---|---|---|
| H1 / Hero headline | ~64–68px | Bold/700 | ~1.05–1.1, tight | 4 lines, large measure, nearly fills the 1360 column at that weight |
| H2 / Section headline (About: "I like understanding…") | ~40–44px | Bold/700 | ~1.15 | 2-line wrap |
| H3 / Project title (thesis, 02–04) | ~28–32px | Bold/semibold | ~1.2 | thesis title larger (~32) than 02–04 titles (~24–26) — flagship gets a size bump |
| Body / paragraph | ~17–18px | Regular | ~1.5–1.6 | muted color, measure capped (see §5) |
| Eyebrow / monospace label | ~11–12px | Regular, letter-spaced | ~1.4 | uppercase, tracked out noticeably (~0.05–0.08em) |
| Nav links | ~15px | Regular/medium | — | |
| Button label | ~15–16px | Medium | — | |
| Footer brand "KP" | ~28–32px | Bold | — | smaller than hero KP in header (header KP ~20–22px) |

Mobile headline drops to roughly **~40–44px** (still bold, still tight
leading) — this is the main typographic delta between breakpoints; body copy
size stays close to desktop (~16–17px).

### 4.1 Implemented typefaces per language (foundation)

Geist and IBM Plex Mono have no Greek alphabet. Checked against the font
files' character maps with a 69-character test set (capitals, lower case,
tonos, dialytika with and without tonos, final sigma): Geist has 6 of them
(`Λ Ω λ μ π ω`, kept as maths symbols), Plex Mono 1 (`π`), Inter all 69.
That is true of both Geist on Google Fonts and the `geist` npm package
(v1.8, evaluated and removed). Using Geist for Greek is therefore not
possible, and a browser fallback (Arial, system-ui) would mix two unrelated
designs in one line.

Greek is set in **Inter**: a neo-grotesk close to Geist, with a complete
Greek design. Vertical proportions are nearly the
same, so mixed lines and the two language versions keep the same rhythm:

| Font | Cap height | x-height | x / cap |
|---|---|---|---|
| Geist | 0.710 | 0.530 | 0.746 |
| Inter | 0.728 | 0.546 | 0.750 |

All three families are served by `next/font/google` (self-hosted at build
time, no request to Google at runtime, size-adjusted fallbacks):

| Family | Variable | Subsets | Weights |
|---|---|---|---|
| Geist | `--font-geist` | latin | variable |
| Inter | `--font-inter` | greek (preloaded); latin loads on demand through `unicode-range` | variable |
| IBM Plex Mono | `--font-plex-mono` | latin | 400 only (no other weight is used, and every listed weight is preloaded) |

Mapping, applied through `[lang]` rules in `globals.css`:

| Role | Tailwind | `lang="en"` | `lang="el"` |
|---|---|---|---|
| Headings, body, nav, buttons | `font-sans` (default) | Geist | Inter |
| Eyebrow / meta labels | `font-label` | IBM Plex Mono | Inter |
| Code, tech tags | `font-mono` | IBM Plex Mono | IBM Plex Mono |
| Brand name (header and footer) | `font-brand` | Geist | Geist |

Rules:
- Greek text must always sit inside an element with `lang="el"`, including
  a Greek fragment on an English page. The `lang` attribute selects the
  typeface; Greek without it is drawn in a fallback.
- No monospace for Greek prose. Greek labels use Inter with the same size,
  case and tracking as the English Plex Mono labels; the line boxes match
  within 1px (tested).
- Uppercase Greek labels use `text-transform: uppercase` with `lang="el"`;
  the browser then drops the tonos (`Επιλεγμένα έργα` → `ΕΠΙΛΕΓΜΕΝΑ ΕΡΓΑ`), as
  Greek orthography requires. Never type Greek capitals by hand.
- Tech tags (`Hyperledger Fabric`, `Go`) stay in Plex Mono on Greek pages:
  they are identifiers, not prose.
- **Deviation from the reference:** the language switcher (`EN · ΕΛ`) is set
  in each language's sans, not monospace. Plex Mono has no `Λ`, and one
  control should not be drawn in two unrelated typefaces.
- Arrows (→, ↗) are inline SVG (`src/components/icons.tsx`), not glyphs; the
  arrow characters are not in the web subsets and would fall back.
- `overflow-wrap: break-word` on `body`: a long Greek word at display size
  (the 40px mobile headline) wraps instead of widening the page at 390px.

Verification: `tests/typography.spec.ts` asks Chromium (DevTools
`CSS.getPlatformFontsForNode`) which font actually drew each text run on
`/`, `/el` and the QA pages. Every run must be drawn by exactly one web font
matching its language; any Greek run must be Inter. The QA page
(`/qa/typography`, `/el/qa/typography`, only built with
`ENABLE_QA_ROUTES=1`, `noindex`) shows every text role side by side in both
languages, the Greek coverage set at 18px, 12px label and 64px display size,
and the mixed sentence.

## 5. Spacing Rhythm

- Section-to-section vertical rhythm on desktop is large and consistent:
  roughly **~96–120px [approx]** between major sections (hero → selected
  work → about → more work → footer), each preceded by a full-width 1px
  divider rule.
- Divider rule + eyebrow label pattern repeats at the top of every section:
  thin horizontal line, then a small gap (~32–40px), then the monospace
  eyebrow, then a smaller gap (~16px) before the headline.
- Hero internal spacing: headline block → supporting paragraph (~24px) →
  button row (~32–40px).
- Card/panel internal padding (thesis architecture panel): generous, ~32px
  **[approx]**, consistent with "generous whitespace" direction.
- Mobile compresses vertical rhythm significantly — sections are closer
  together proportionally (~48–64px **[approx]**) to avoid excessive
  scrolling, but the divider+eyebrow+headline pattern is preserved.

## 6. Header

- Fixed pattern, not sticky-elevated in the screenshot (flat, no shadow) —
  whether it's sticky on scroll is unverifiable from a static image
  **[approx, implementation decision]**.
- Desktop: `KP` wordmark far left; nav cluster (`Work`, `About`, `Résumé`,
  `Contact`) centered-right; far right: globe icon + `EN · EΛ` text switcher,
  then a circular theme toggle icon.
- Thin 1px bottom border separates header from hero, full width.
- Mobile: `KP` left, globe + `EN · EΛ` + a hamburger icon right. Nav links
  collapse behind the hamburger (menu contents not shown open in the
  reference — **ambiguity**, see §15).
- Header height **[approx]** ~80–88px desktop, ~64px mobile.

### 6.1 Implemented navigation (foundation)

- Header: 96px from 1024px up, 80px from 768px, 62px on phones; static (not
  sticky), 1px bottom border. `K. Papadogiannis` links home with the
  accessible name "K. Papadogiannis, home" ("K. Papadogiannis, αρχική
  σελίδα" on `/el`).
- Targets. `Work`, `About` and `Contact` are sections of the homepage;
  `Résumé` is a page.

  | Link | English | Greek |
  |---|---|---|
  | Work | `/#work` | `/el#work` |
  | About | `/#about` | `/el#about` |
  | Contact | `/#contact` | `/el#contact` |
  | Résumé | `/resume` | `/el/resume` |

  The ids live in `src/config/navigation.ts` (`sectionIds`); the homepage
  must keep a `<section>` with each id. `#work` is Selected work, `#about`
  is About, `#contact` is the Contact row of the footer.
- Section links are plain `<a href>`, not router links, so the browser
  performs the fragment navigation: the section scrolls into view (with
  `scroll-margin-top: 1.5rem`) and the next Tab continues from it. From
  another page they load the homepage and land on the section.
- Mobile (below 768px): the four links move behind a menu button (44 × 44px,
  `aria-expanded`, `aria-controls`). The menu opens as a full-width panel
  under the header with one link per row (48px rows, hairline separators).
  It closes on link click, on Escape (focus returns to the button) and on a
  language switch. Language and theme stay visible next to the button.
- Language switcher: globe, then `EN · ΕΛ`, as a labelled group. The current
  language has `aria-current="true"` and ink colour; the other is muted. Each
  link points at the same page in the other language (`/resume` ↔
  `/el/resume`) and carries `lang` and `hreflang`.

## 7. Hero

- Eyebrow line above headline: `KONSTANTINOS PAPADOGIANNIS / ATHENS, GR` in
  tracked monospace, muted color — this is the ONE place the full name
  appears per ART_DIRECTION.md's "identity repetition" rule.
- 4-line bold headline, left-aligned, occupies left ~55% of the content
  width on desktop.
- Supporting paragraph directly below, narrower measure than the headline
  (roughly matches headline column width, ~540–580px).
- **Known collision (desktop):** headline's 4th line "infrastructure." visibly
  overlaps the supporting paragraph's first line — fixed-height text block
  bug, one of the brief's "known prototype issues." Must be fixed with natural
  flow spacing in implementation.
- **Known collision (mobile):** same issue, worse — "infrastructure." overlaps
  "...focused on backend engineering, distributed systems and..." directly.
  Confirms this is a systemic fixed-height-container bug in the Figma
  export, not an intentional overlap effect.
- Button row: one primary (`Selected work`, filled navy) + three text links
  (`Résumé ↗`, `GitHub ↗`, `LinkedIn ↗`) inline, left-aligned under the
  paragraph.
- Right side (desktop only): the systems/ledger motif, roughly centered in
  the remaining ~45% column, vertically centered against the headline block.
  Caption below it: `DISTRIBUTED LEDGER / SYSTEM TOPOLOGY` in tracked
  monospace, centered under the motif.
- Mobile: motif moves below the button row, centered, scaled down
  significantly (~180–200px wide vs. desktop's ~260–280px), caption appears
  to be dropped/not visible in the mobile crop **[approx — may just be
  below the fold of the captured export; treat caption as present unless
  contradicted]**.

## 8. Button System

**Primary** (`Selected work`):
- Navy fill (`--navy`), warm off-white label.
- Desktop height ~44px, horizontal padding ~24–28px.
- Small radius, ~**2–4px** — matches COMPONENTS.md spec exactly, not
  pill-shaped, not sharp-square.
- No visible shadow.

**Text link** (`Résumé ↗`, `GitHub ↗`, `LinkedIn ↗`, `Read case study →`):
- No border/box, just label + arrow glyph, ink/navy color.
- Arrow glyph is part of the label (↗ for external links, → for in-page
  navigation like "Read case study").
- Spacing between the three hero text links ~24–32px.

**Tech tag pills** (under thesis case study: `Hyperledger Fabric`, `Go`,
etc.) — distinct from the button system:
- Outlined only (1px border, `--border` color), transparent/surface fill,
  small text, generous horizontal padding, small radius matching the button
  radius. These read as metadata chips, not interactive buttons.

No secondary (outlined navy) button variant is visibly used on the homepage
in either screenshot — COMPONENTS.md defines one, but the homepage only
exercises primary + text-link. Secondary variant styling is therefore
**[not directly observed — build per COMPONENTS.md spec, verify once a
page that uses it exists]**.

## 9. Project Section Patterns

Four projects total, explicitly NOT uniform treatment (per
ART_DIRECTION.md's "do not give all projects identical card treatment"):

**01 — Thesis (flagship)**
- Full-width-of-content row, two columns (text ~58%, panel ~42%).
- Eyebrow: `SELECTED WORK` above the whole section; a second small eyebrow
  pair `01 Bachelor's Thesis · 2026 · 10/10` sits directly above the title
  (grade shown — real fact from PORTFOLIO_CASE_STUDY.md, not fabricated).
- Larger headline than 02–04 (3-line title vs 2-line).
- Body paragraph, then a row of 4 outlined tech-tag pills.
- `Read case study →` text link below the tags.
- Right column: the architecture panel — bordered card, eyebrow label
  `SYSTEM ARCHITECTURE / PROJECT-DERIVED` above it, placeholder body copy
  inside explicitly stating it's a placeholder ("This panel will be redrawn
  from the real thesis architecture...") — **this is the explicit
  known-placeholder** called out in the project brief, confirmed directly in the
  image text itself, not just inferred.
- Below the panel: two small monospace stat lines (`PRIVATE DATA` — "5
  collections · IBAN kept off-ledger · role/state enforcement"; `TESTING` —
  "165 role/state tests · 313 Vitest tests · 23 Playwright E2E specs").
  These read as real engineering facts (test counts), not fake KPIs —
  consistent with PORTFOLIO_CASE_STUDY.md being the source of truth for
  these numbers. **Superseded:** the case study gives different counts
  (157 top-level chaincode test functions, more than 300 frontend unit-test
  declarations), so the homepage states what the tests check instead of a
  count. See §16.

**02–04 — ErgoHub, OpenStack, CUDA (secondary row, "More work")**
- 3-column equal grid, divided by full-height vertical rules.
- Each: small `0N` index + `NAME` + year on one line, short meta line
  (team/individual + year), 2-line headline, 2–3 line body paragraph,
  `Read case study →` link. No tech-tag pills at this tier — visually
  lighter/denser than the thesis treatment, confirming the hierarchy.
- Mobile: same content, stacked full-width, separated by horizontal rules
  instead of vertical ones; index + name collapse to one compact meta line
  (`02 / ERGOHUB / 2025`).

Note: ART_DIRECTION.md's project hierarchy also lists Computer Vision and
Household Energy Data Mining as "Secondary" projects, but neither appears
on this homepage — the homepage only surfaces 4 of the 6 known projects
(Thesis + 3 "more work" slots). The two secondary projects are presumably
reachable elsewhere (a full work/projects listing page) rather than the
homepage. **Resolved:** the homepage lists both under "Additional work",
below the three primary projects. See §16.

## 10. About / Portrait Treatment

- Eyebrow: `ABOUT / BACKGROUND`.
- Desktop: text column left (~60%), portrait right (~40%), as specified.
- Headline: "I like understanding how the pieces of a system fit together."
  — 2 lines, same bold weight as other H2s.
- **Known collision (mobile):** the wrapped headline's last line
  "together." overlaps the body paragraph below it — same fixed-height-block
  bug as the hero, confirmed a second time, reinforcing this is systemic
  across all headline+paragraph pairs in the export, not hero-specific.
- Three body paragraphs below the headline (bio, interests, current
  status/availability for roles) — all muted color, capped measure.
- Portrait: currently a **flat empty placeholder rectangle** (no image
  rendered in the reference — solid `--surface`-ish fill, no portrait
  content shown), roughly **4:5 aspect ratio**, rectangular, no radius, no
  border visible. Matches ART_DIRECTION.md's intended real-portrait
  treatment spec exactly (rectangular editorial crop, ~4:5, subtle/no
  radius) — the box is correctly proportioned, just not yet filled with
  `assets/portrait/professional-portrait.jpg` in the Figma export.
- Small caption line below the portrait: `Athens, Greece · B.Sc. Informatics
  & Telematics · 2026`.
- Mobile: text first (headline + all 3 paragraphs), portrait placeholder
  below, full width, same ~4:5 ratio, caption beneath.

## 11. Thesis Visual Treatment

Covered mostly in §9. Additional notes:
- The architecture panel uses a **bordered card** (1px `--border`), fill
  slightly lighter than the page background (`--surface`), NOT the page
  background itself — gives it a subtle "elevated paper" feel without any
  shadow.
- Panel content is explicitly placeholder text (confirmed in-image), to be
  replaced by a real redrawn SVG of `seven-actors-architecture-source.svg`
  per the project brief and `docs/ART_DIRECTION.md` — homepage version should be
  **simplified**, full detail reserved for the case study page.
- Mobile shows a *different, denser* placeholder: a 4-box row (`VI`,
  `WALLET`, `GOV`, `FABRIC`, `CC` — 5 boxes visible, abbreviated labels)
  rather than the desktop's prose placeholder panel. This suggests the
  mobile Figma pass already sketched a rough node-row layout intention for
  the simplified diagram, distinct from desktop's text-only placeholder.
  Worth treating as a loose directional hint for the simplified homepage
  diagram's shape (a compact horizontal row of labeled nodes), not a
  literal spec.

## 12. Footer

- Full-bleed deep navy background, breaks out of the warm off-white page.
- Desktop 4-column layout (see §1): Brand / Navigate / Elsewhere / Contact.
  - Brand: `KP` (large, bold, off-white) + tagline "Backend systems,
    distributed software, and cloud infrastructure." + "Athens, Greece".
  - Navigate: `NAVIGATE` eyebrow + Work / About / Résumé / Contact links.
  - Elsewhere: `ELSEWHERE` eyebrow + GitHub/LinkedIn/Email rows, each with a
    small brand icon + label; ORCID row present but shown as disabled/muted
    placeholder text `ORCID — verified link to be added` (confirms
    the "do not invent ORCID" rule in `docs/CONTENT_AND_VOICE.md` is already reflected in
    the design itself).
  - Contact: email address as plain text + short availability statement
    ("Open to graduate and junior roles in backend, distributed systems,
    cloud and DevOps.").
- Bottom bar below a thin divider: `© 2026`, `Built with Next.js + TypeScript
  · Deployed on Vercel`, `EN · EΛ`, `Back to top ↑` — spread across the row,
  small monospace/muted text.
- Mobile: single column, same content blocks stacked in the same order
  (Brand → icon-row social links → bottom bar), icons shown inline with
  labels rather than in a separate "Elsewhere" heading block.
- Superseded: the footer shows the full name once, as its signature, and
  no `KP`; ORCID is a working link, not a placeholder row (see §16).

## 13. Mobile-Specific Behaviour

Summarized from points above, consolidated:
- Header collapses nav into a hamburger icon (contents not shown expanded —
  ambiguity, §15).
- Hero motif drops below the CTA row and shrinks.
- Hero headline collapses from ~64–68px to ~40–44px.
- Thesis architecture panel becomes a compact 5-node horizontal strip
  instead of the desktop prose placeholder card.
- Tech-tag pills reduce from 4 to 3 visible (`Hyperledger Fabric`, `Go`,
  `TypeScript` — `React /` prefix dropped, `Web Crypto API` tag dropped)
  **[approx — may just be a cropped/truncated export rather than an
  intentional reduction; implementation should keep all 4 tags and let them
  wrap rather than silently drop content]**.
- 3-column project grid stacks to single column with horizontal dividers.
- Footer collapses 4 columns to 1, icon+label rows for social links.
- Overall side gutter shrinks from 40px to ~20px.

## 14. Visual Anti-Patterns That Must Not Be Introduced

Directly confirmed ABSENT from both reference screenshots (consistent with
the project's list of forbidden visual tropes — noting this because implementation must keep it
that way, not because the Figma shows an example to copy):

- No gradients anywhere (buttons, text, backgrounds, borders all flat fill).
- No glow/blur shadows on any element.
- No glassmorphism/translucency.
- No pill-shaped nav or oversized rounded containers — radius throughout is
  small/subtle (buttons, tags, panel).
- No bento-style mixed-size card grid — the 3-project grid is strictly
  equal-width columns.
- No floating/decorative tech icons scattered in whitespace — the only
  "icon" motif is the single deliberate hero ledger/systems diagram.
- No fake terminal windows, no monospace "code block" decoration anywhere
  outside the legitimate metadata labels.
- No skill bars / progress meters for languages or tools.
- No testimonial, client logo, or "trusted by" section — homepage goes
  straight from About into More Work into Footer.
- No stock photography — the only photographic asset is the (currently
  empty) real-portrait placeholder.
- No circular avatar treatment — portrait is explicitly rectangular.

The systems motif itself (§7) is the one deliberately decorative element,
and it's already restrained: thin 1px strokes, symmetric radial node
layout, low visual weight relative to the headline. It should be rebuilt
as-is in SVG/React, not amplified into something flashier.

## 15. Ambiguities / Could Not Confidently Infer

- **Mobile hamburger menu contents**: not shown open in the reference. Link
  order/grouping inside it should follow the desktop nav order (Work,
  About, Résumé, Contact) absent other guidance.
- **Exact pixel values** for type scale, spacing, and panel padding are
  estimated from a flat raster at known canvas dimensions, not extracted
  from a Figma inspector or design tokens file — all marked **[approx]**
  above and should be verified/adjusted against the live browser render at
  1440 and 390 per the art-direction skill's QA step, not treated as final.
- **Footer navy exact hex**: reads visually close to but possibly distinct
  from `--navy` (#263747) used on the primary button — could be the same
  token or a dedicated darker footer token. Needs eyedropper confirmation
  during implementation.
- **Header sticky behavior on scroll**: unverifiable from a static export.
- **Mobile hero caption** (`DISTRIBUTED LEDGER / SYSTEM TOPOLOGY`): not
  visible in the captured mobile crop under the motif — unclear if omitted
  by design on mobile or simply below/adjacent to the capture boundary.
- **Mobile tech-tag count** (3 vs desktop's 4): unclear if intentional
  content reduction or an export crop artifact (see §13).
- **Tablet/intermediate breakpoint**: no reference provided between 390 and
  1440; behavior in that range is unspecified by source material.

## 16. Implemented homepage (Unified Pass 2)

Measured in the browser against both references at 1440 and 390, and
checked at 768 and 1728. Values here are the implemented ones; where they
differ from §1–§15, these win.

**Grid.** 1328px content column with 56px gutters at 1440 (`Container`),
40px at 768, 22px on phones. Wider screens keep the 1440 frame centred
(content starts at x = 200 on a 1728 screen). From 1024px the page uses
the three equal columns of the More work row, and every block lines up on
them: About text in columns 1–2 with the portrait at the start of column
3. The footer follows the two columns of Selected work.

**Breakpoints.** Phones up to 767px: one column. Below 1024px the header
links sit in a menu. 768–1023px: two-column technologies, footer rows
with their labels in a column of their own, everything else one column.
1024px and up: the reference layout.

**Hero.** Eyebrow `KONSTANTINOS PAPADOGIANNIS / ATHENS, GR` (the full
name appears once more, as the footer's signature). Headline 68/72px at desktop, 52/56px from
640px, 40/43px on phones, with the reference's line breaks. The intro and
the actions follow the headline in normal flow, so the reference's
headline/intro collision cannot happen. Actions: `Selected work` (primary,
to `#work`), then `Résumé (PDF)`, `GitHub`, `LinkedIn` as text links with
arrows. The motif is static SVG with its caption: right column on
desktop, centred under the actions below 1024px.

**Buttons.** Primary 44px tall, 3px radius, navy fill; hover lightens,
active darkens, no movement. Text links underline on hover and move the
arrow 2px. Every focusable element shows a 2px outline offset by 2px in
`--focus-ring`; on the footer band the ring switches to `--footer-focus`.

**Thesis.** `01  Bachelor's Thesis  2026  10/10` as in the reference (the
grade is labelled for screen readers), title on the
reference's three lines, body, four tags, `Read case study` to
`/work/thesis`, the full case study (indexable, in the sitemap). The two facts under the panel
are written as sentences: private data (five collections, IBAN off the
ledger) and what the tests check. No test counts on the homepage.

**Architecture panel.** `ThesisArchitecture`, built from HTML lists and
CSS rules rather than an image, so screen readers read it in order and it
reflows. Seven organisations with their role, the `subsidychannel` block
with the three chaincodes, world state per namespace and five private
data collections, and a legend for the two ways of signing (Keycloak for
staff, a self-held key in the browser for farmers). Wide panels join the
organisations to the channel with a bus; narrow panels (phones) with a
spine, close to the mobile reference's node strip. The layout follows the
panel's own width (container queries), not the screen's.

**About.** Statement heading and three paragraphs in columns 1–2, the
degree under them (degree, university and years, average, thesis grade),
the portrait at the start of column 3. Measured About height (English):
724px at 1440, 1374px at 390.
Portrait: `next/image`, 4:5, 390px wide at desktop, full width on phones,
lazy loaded, caption without the name.

**My story.** A section of its own after About: the statement
"Curiosity came before code." (42/49px at desktop, 30/35px on phones),
then three chapters, 01 Curiosity, 02 Depth, 03 Direction, each under a
full-width hairline. From 1024px the number and title sit in column 1 and
the prose runs from column 2 at 17/28px, at most 640px wide; 768–1023px
in a 176px rail; on phones the number and title share a line above the
prose. One pull statement set larger (27/34px) and the closing line at
21/30px; no quotation marks, boxes, images or icons. Paragraphs fade in
once as they reach the viewport (opacity and 12px, 520ms, 80ms apart);
without JavaScript or with reduced motion everything is simply shown.
Measured (English): 1846px at 1440, 2544px at 390.

**Academic highlights.** A section of its own after the story: a short
note in column 1, sixteen courses with grades in four groups by field
across columns 2–3, in two columns of eight. Course names lead; grades
follow in small muted mono, right-aligned in one column. Ruled rows only:
no badges, bars or colour for grades. 768–1023px: the note above two
columns of courses; phones: everything stacks and long names wrap beside
their grade. Measured (English): 550px at 1440, 1001px at 390.

**More work.** ErgoHub, OpenStack and CUDA in the three-column row with
hairlines between columns (horizontal rules on phones). Below them,
"Additional work": Computer Vision and Energy Data Mining with smaller
titles and no column rules. Six projects in all, the thesis first.

**Technologies.** Typographic groups, no icons or levels.

**Footer.** Compact navy band. Left: `Konstantinos Papadogiannis`, the
line, Athens. Right: three labelled rows, Navigate (Work, About, Résumé,
Contact), Elsewhere (GitHub, LinkedIn, ORCID) and Contact (the address,
the only mail link, and one availability line). One hairline rule, then
the dynamic year, "Built with Next.js + TypeScript · Deployed on Vercel",
the language switcher and Back to top. From 1024px the two parts sit on
the columns of Selected work; 768–1023px the rows sit under the name;
stacked on phones, with the name on two lines below 480px. Measured:
309px tall at 1440 and 1024, 592px at 390 (English).

**Dark mode.** Same structure; tokens in `src/styles/globals.css`. The
footer becomes a darker navy so it still reads as a separate band.

### 16.1 Deliberate differences from the references

| Reference | Implemented | Why |
|---|---|---|
| Headline overlaps the intro (desktop and mobile) | Normal flow | Known prototype bug |
| About headline overlaps its paragraph (mobile) | Normal flow | Same bug |
| Architecture panel holds placeholder text | Real simplified diagram | Known placeholder |
| Test counts under the panel | Sentence about what the tests check | Counts conflict with the case study |
| Four projects | Six, two as "Additional work" | All real projects shown, hierarchy kept |
| No education or technologies blocks | Added, compact and typographic | Requested content |
| No academic record | Average, thesis grade and grouped course highlights in a section after the story | Requested content; typographic, no grade graphics |
| No personal story | "My story" after About, in three chapters | Requested content; type only, one subtle reveal |
| ORCID row with placeholder text | Working ORCID link with ORCID's own iD icon | iD supplied by the owner; no dead rows |
| Header and footer clusters float | Aligned to the content grid | Consistency |
| Tall empty band at the bottom of the footer | Removed | Export artefact |
| `KP` in the header and footer | `K. Papadogiannis` in the header, `Konstantinos Papadogiannis` in the footer | Approved branding |
| Four footer columns, the email shown twice | Two parts with labelled rows; the address once | Approved compact footer |
| Mobile hero without LinkedIn | LinkedIn kept | Same actions on every screen |
| Mobile header without theme toggle | Toggle kept beside the menu | Feature parity |
| Mobile tags cut to three | All four, wrapping | Do not drop content |
| Greek | Not in the references | Lines set for Greek separately (headline six lines on phones) |
