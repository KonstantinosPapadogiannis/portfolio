# Components and Interaction Rules

## Buttons

Build real reusable components, never exported button images.

Variants:
- Primary
- Secondary
- Text/Tertiary
- Icon

States:
- default
- hover
- focus-visible
- active/pressed
- disabled where applicable

### Primary

- navy background
- warm off-white text
- ~44px desktop height
- subtle 2–4px radius
- no large shadow
- hover: slightly lighter/steel-tinted navy
- active: slightly darker
- visible accessible focus ring
- no scale/bounce gimmick

### Secondary

- transparent / warm surface
- 1px stone border
- navy text
- subtle steel-blue tinted hover

### Text link

- no box
- subtle underline or arrow motion
- 2–3px arrow movement max
- 140–200ms transition

### Icon button

- compact
- proper 44px-ish hit area
- understated border/circle/square depending context

## Header

Desktop:
- `K. Papadogiannis` left
- Work
- About
- Résumé
- Contact
- globe + `EN · ΕΛ`
- theme toggle

Keep it quiet and precise.

## Footer

A compact deep-navy band: two parts above one hairline rule, then a
utility row.

Left:
- `Konstantinos Papadogiannis`
- `Backend systems, distributed software, and cloud infrastructure.`
- Athens, Greece

Right, three labelled rows:
- NAVIGATE: Work, About, Résumé, Contact
- ELSEWHERE: GitHub, LinkedIn, ORCID (icon + label)
- CONTACT: the email address, then one availability line

Below the rule:
- dynamic year
- `Built with Next.js + TypeScript`
- `Deployed on Vercel`
- `EN · ΕΛ`
- Back to top

The full name appears once in the footer, as the signature. No `KP`. The
address is shown once.

Use brand-faithful icons (official SVG or reputable icon source).

All links must be accessible and functional.

## Carousel / slideshow

Use only where it naturally helps.

Correct place:
- project case studies with at least two real visuals

Examples:
- architecture diagram
- signing flow
- real UI screenshot
- deployment topology
- performance visual

Do not add a homepage carousel merely for decoration.

Requirements:
- no autoplay
- previous/next
- keyboard arrows
- visible slide number e.g. `01 / 04`
- restrained pagination indicators
- proper captions
- accessible labels
- mobile swipe if practical
- reduced-motion support
- do not force a carousel when there is only one useful visual

## Implementation notes (homepage)

- `Button` (`src/components/ui/button.tsx`): primary and secondary are 44px
  tall with a 3px radius; hover and pressed change colour only. Renders an
  `<a>` when given `href`.
- `TextLink` (`src/components/ui/text-link.tsx`): underline on hover, arrow
  moves 2px, 150ms. External links use the diagonal arrow, in-page links
  the right arrow.
- `IconButton`: 44 × 44px hit area for the theme toggle and the menu.
- Focus: every focusable element shows a 2px outline, offset 2px, in
  `--focus-ring`; the footer switches it to `--footer-focus` so it reads on
  navy.
- Header: as specified. The name reads "K. Papadogiannis"; the earlier
  "KP" mark is retired. Below 1024px the four links move into a menu
  panel; language and theme stay beside the menu button. On phones the name
  scales with the screen (15px to 24px) and the globe is hidden below 360px,
  so the bar never wraps or scrolls.
- Footer: as specified, with these decisions:
  - The brand line is the full name, "Konstantinos Papadogiannis", in
    Geist in both languages.
  - ORCID links to the public record,
    `https://orcid.org/0009-0008-9445-2484`, never the `my-orcid?orcid=`
    address. The icon is ORCID's own green iD icon (Brand Library,
    Authenticated iD Icons / Default, vector), unchanged in
    `public/images/ORCID-iD_icon_vector.svg`; ORCID's guidelines forbid
    redrawing or recolouring it. It is shown at 18px, the size of the
    GitHub and LinkedIn marks. The link is named "ORCID profile —
    0009-0008-9445-2484" ("Προφίλ ORCID — …" in Greek); the icon has
    empty alt text.
  - GitHub, LinkedIn and ORCID carry `rel="me"` and open in the same tab.
    The address under Contact is the only mail link and has no `rel`.
  - The profiles are 20px apart, as the links in the row above, so all
    three share one line from 390px up, and beside the narrower label
    column at 1024px. Below 390px ORCID takes a second line.
  - The language control repeats the header's (`EN · ΕΛ`, same page in the
    other language) without the globe.
  - From 1024px the two parts sit on the two columns of Selected work: the
    name, line and city on the left; the labelled rows start where the
    right column starts, with the labels in a column of their own.
  - 768–1023px: the name and line on top, the labelled rows below them.
  - Below 768px everything stacks, labels above their links. Below 480px
    the name sets on two lines, "Konstantinos / Papadogiannis", at 28px.
  - Below 1024px every footer link is at least 44px tall; from 1024px links
    take the height of their line.
  - Measured height at 1440: 309px (447px for the earlier four-column
    footer).
  - The colophon (©, built with, deployed on) is a list of three items, so
    each is read on its own; the dot between the last two is decorative.
- `Separator` (`src/components/ui/separator.tsx`): the slash in labels such
  as "About / Background". The glyph is CSS generated content whose
  alternative text is a comma (`.separator-slash` in `globals.css`), so the
  label is read "About, Background". Never put hidden punctuation next to a
  visible separator: browsers add a space before it ("About , Background").
  `.separator-dot` does the same for the dot before the years in About.
- About (`src/components/home/about.tsx`, data in `src/config/education.ts`):
  the professional summary. Statement and three paragraphs in the first two
  grid columns, the degree under them (degree, university and years, then
  average and thesis grade as a definition list), the portrait at the start
  of the third column. Numbers go through next-intl's formatter, so the
  average reads 7.51 in English and 7,51 in Greek.
- Story (`src/components/home/story.tsx`, copy in `story` in the messages):
  the personal story, a section of its own after About. A statement, then
  three numbered chapters (Curiosity, Depth, Direction), each ruled across
  the page: number and title in the first grid column (a 176px rail from
  768px, a line above the prose on phones), prose in a reading measure of
  at most 640px. The pull statement is set apart by size and space only; the
  last line answers the question the story opens with. Type only: no images,
  icons, cards or timeline.
- `Reveal` (`src/components/ui/reveal.tsx`): the one scroll motion on the
  site. Fades each `[data-reveal]` child in (opacity, translateY 12px,
  520ms, 80ms apart, at most four steps) when it reaches the viewport, once.
  The server renders everything visible; the script only hides items still
  below the viewport when it runs, and does nothing under reduced motion or
  without IntersectionObserver. One observer for the whole page, shared by
  every Reveal, created when the first item waits and disconnected once
  every item is shown. Styles at the end of `globals.css`.
  Where it is used, from the most movement to the least:
  - Story: each paragraph, the richest motion on the site;
  - Selected work, About, Academic highlights, Interests, More work and
    Technologies: a few blocks each, the section label first (then, for
    example, the thesis meta, title, text and figure; the About text and
    the portrait; each group of courses; each project);
  - the ErgoHub, OpenStack, CUDA, computer vision and energy data mining
    case studies: each section as one block, nothing inside it (the
    OpenStack diagram, the CUDA benchmark figure, the computer vision
    results table and the energy forecast figure come in with their
    sections; no number counts up).
  The header and the footer never move. A block is put around a link or a
  button, never on the control itself, so its hover and focus transitions
  are left alone.
- Entrance on load (`[data-enter]`, `globals.css`): the hero of the
  homepage and of the ErgoHub, OpenStack, CUDA, computer vision and energy
  data mining case studies come in once as the page is painted, in up to three steps 80ms
  apart (opacity and translateY 10px, 500ms). CSS only: no script, nothing waits for hydration, and under
  reduced motion it is over at once.
- Academic highlights (`src/components/home/academic-highlights.tsx`): a
  section of its own after Story. A one-line note in the first grid column;
  four groups by field across the other two, in two columns of eight
  courses. Each course is a ruled row: name in body text, grade in 12px muted
  mono, the mark padded to two digits so the slashes line up. No badges,
  bars, charts or grade colours.
- Interests (`src/components/home/interests.tsx`): between Academic
  highlights and More work. Fields followed and studied, kept apart from
  Technologies, which lists only tools used in the projects. Five themes as
  ruled rows, with no numbers, icons or logos: name and description side by
  side from 1024px, stacked below.
- No carousel on the homepage. It is for case studies with two or more
  real visuals.
- `ProjectGallery` (`src/components/ui/project-gallery.tsx`): the case-study
  carousel, used once on the thesis page for the four data-placement views.
  Nothing moves on its own; previous/next buttons, arrow keys while a control
  has focus, indicators and a horizontal swipe. Hidden slides are inert, and
  a polite live region names the new slide only after the reader changes it.
- Thesis case study (`src/components/thesis/`): one component per section,
  in the order of `outline.ts`, which also numbers the sections and builds
  the contents list (from 1280px). The diagrams (three planes, the channel,
  the signing flow, data placement) are HTML and CSS drawn from the thesis,
  not images.
- ErgoHub case study (`src/components/ergohub/`): laid out as the thesis
  one, with seven sections in the order of `outline.ts` and the shared
  section text styles of `thesis/case-section.tsx`. Facts drawn on the page
  (pipeline stages, the three ways to deploy, the Deployments, the Ingress
  routes) are in `facts.ts`, named as in the project's code. The figures
  (the two paths through the project, the project workflow, the pipeline
  stages, the cluster) are HTML and CSS, each named by its caption; `Track`
  draws an ordered list of steps on a line, across from 52rem of container
  width and down below that.
- OpenStack case study (`src/components/openstack/`): a focused case study,
  laid out as the ErgoHub one, with six sections in the order of
  `outline.ts`. One diagram (`network-figure.tsx`), HTML and CSS: the
  layers inside the Google Cloud VM as boxes inside boxes, each hop on the
  way out marked by a steel square on a line down the left edge, the two
  things added on the host in dashed boxes (said in words to assistive
  technology too), then the outbound path and the test path as text. It is
  named by its caption and described by the paths; one column inside its
  container below 36rem, the host's additions beside each interface from
  44rem. No addresses on it.
- CUDA case study (`src/components/cuda/`): a focused technical case study,
  laid out as the OpenStack one, with four sections in the order of
  `outline.ts`. The three measured times live in `cuda` in
  `src/config/work.ts`; every other number on the page is computed from
  them and formatted for the reader's language. Under each change, the
  times before and after sit on a line of their own, apart from the
  explanation. One figure (`benchmark-figure.tsx`): an ordered list of the
  three kernels, each with its name, time, a one-line note and its ratio to
  the first kernel written out, and a bar on one scale (the first kernel's
  time is the full width). The bars are hidden from assistive technology;
  the text carries every value, so the figure reads without colour. Named
  by its caption and described by its note.
- Computer vision case study (`src/components/vision/`): a compact
  technical case study, laid out as the CUDA one and lighter, with four
  sections in the order of `outline.ts`. Its figures live in `vision` in
  `src/config/work.ts`; the gap and the time ratio on the page are computed
  from them and formatted for the reader's language. Each ResNet18 run, the
  segmentation and the detection have their measured value on a line of
  its own, with the metric named. One figure (`results-table.tsx`): a table
  of the two CIFAR-10 models with test accuracy after 5 and 10 epochs and
  the time per epoch, model names as row headers, named by its caption and
  described by its note. A table and not bars: accuracies three points
  apart would only look different on a cut axis. No images.
- Energy data mining case study (`src/components/energy/`): the most
  compact case study, laid out as the computer vision one and lighter:
  three sections in the order of `outline.ts`, in one column with no
  contents list. Its figures live in `energy` in `src/config/work.ts`; the
  shares, gaps, ranges and distances from the baseline on the page are
  computed from them and formatted for the reader's language. The
  classifier's three test metrics sit in one ruled row, each under its own
  name, with the model and the split beside them. One figure
  (`forecast-figure.tsx`): an ordered list of the persistence baseline,
  Random Forest and the LSTM, each with its name, test RMSE, a one-line
  note and its distance from the baseline written out, and a bar on one
  scale from zero (the baseline is the full width), so errors 0.02 kWh
  apart look the same. The bars are hidden from assistive technology; the
  text carries every value, so the figure reads without colour. Named by
  its caption and described by its note. No ROC curve, no images.
