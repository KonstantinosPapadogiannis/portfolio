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
| `foundation.spec.ts` | English default, `/el`, skip link, language switcher markup, canonical and hreflang on the production domain, no locale redirect or cookie, résumé page and PDF, theme toggle, `noindex` on QA routes, the case studies indexable, sitemap (with `/work/ergohub`, `/el/work/ergohub`, `/work/openstack`, `/el/work/openstack`, `/work/cuda`, `/el/work/cuda`, `/work/computer-vision` and `/el/work/computer-vision`) |
| `homepage.spec.ts` | hero actions (Selected work, Résumé PDF, GitHub, LinkedIn), full name in the hero and the footer but not the header, brand (`K. Papadogiannis` in the header, the full name in the footer and the metadata, no visible `KP` on the homepage or any case study, CUDA and computer vision included), architecture figure, portrait load and ratio, six projects with the thesis first, thesis link (scoped to the thesis entry), the ErgoHub entry in More work (year, team of two, `6 Jenkins pipeline definitions` (`6 ορισμοί Jenkins pipeline` in Greek), Docker, ACR and AKS, a description of two to four sentences, 45–80 words with the title and the signals, `Read case study: ErgoHub` to the case study in the reader's language), the OpenStack entry in More work (2026, its three signals, a description of two to four sentences, 45–70 words in English with the title and the signals, `Read case study: OpenStack` to the case study in the reader's language), the CUDA entry in More work (2026, the T4, `4096 × 4096`, tiling and register blocking in the description, the result `306 ms → 86 ms`, `3.6× speedup` (`επιτάχυνση 3,6×` in Greek) drawn and said as one sentence, never `× faster` to assistive technology, a description of two to four sentences, 40–65 words in English with the title and the result, `Read case study: CUDA` to the case study in the reader's language), the computer vision entry in Additional work (2026, image classification, semantic segmentation and object detection in a description of two or three sentences of 40–60 words, test accuracy for ViT-B/16 and VGG16-BN on CIFAR-10 and ResNet18 on Oxford-IIIT Pet with the metric named, no mAP, IoU or 93.18, `Read case study: Computer vision` to the case study in the reader's language), the education record (average `7.51 / 10` in English, `7,51 / 10` in Greek, thesis `10 / 10`; no `7.45`, "Very Good", "Λίαν Καλώς", course counts or ECTS anywhere in the page or its metadata), Academic highlights as a section of its own (four groups, the sixteen verified courses with their grades, no thesis row, no graphics), Academic highlights at 320px and 390px (no overflow, names never under their grade, grades in one column), My story (a section of its own after About: statement, three chapters, the verified facts including Peristeri, PlayStation 2, W3Schools, DevOps, Computer Architecture and Anastasia Zerva, the collaboration as research-oriented and never institutional, the pull statement and the closing line, no clichés, no images, not repeated in About), no year of birth or age (nor any year before 2000) on the homepage, the case studies (computer vision included) or the résumé page (text, metadata, JSON-LD), the story's scroll reveal (hidden below the fold, shown on scroll, never hidden again, no change in height), everything shown at once under reduced motion and without JavaScript, the hero entrance (CSS, 0.5s, once, ends visible), the section reveal (blocks in Selected work, About, Academic highlights, Interests, More work and Technologies; nothing on screen hidden; each block shown as it is reached and never hidden again; one observer for the page, disconnected once everything is shown; no change in height; layout shift under 0.01; nothing in the footer moves), all blocks and the hero shown under reduced motion and without JavaScript, the story at 320px, 390px and 640px (a 1280px window at 200% zoom: one column, no overflow), section order (Selected work, About, My story, Academic highlights, Interests, More work, Technologies), footer links (navigation as in the header; GitHub, LinkedIn and ORCID under Elsewhere with `rel="me"` in the same tab; one ORCID link, to the public record, named with the iD; one mail link showing the address once) and Back to top, the footer at 320px and 390px (no overflow, links at least 44px tall), the three profiles on one line from 390px up, no phone number, keyboard order with a visible focus ring at each stop |
| `navigation.spec.ts` | desktop and mobile navigation in both languages, Escape and focus return, links from another page, no horizontal overflow at 390/768/1440/1728 on every page (the ErgoHub, OpenStack, CUDA and computer vision case studies included) |
| `ergohub.spec.ts` | both languages: title (`ErgoHub: …`), canonical, hreflang with x-default, Open Graph article, CreativeWork JSON-LD, unique ids; 2025 and the team of two in the head; both links back to More work; seven sections in the contents list; every tool of the stack; six Jenkinsfiles named as in the repository and the stage numbers running on across phases; the five Deployments; four figures, each named by its caption, no images; no unsupported claims (production-ready, enterprise-grade, highly scalable, robust, seamless, percentages, SLA, user counts, live demo, RS256, React 18, payments, ratings, real-time or WebSockets, password reset, scores) and no private details (years before 2000, student numbers, the university mail domain, the course hostnames, the public repository); each section shown once as it is reached with no change in height; everything shown under reduced motion and without JavaScript; no overflow at 320 and 390px |
| `openstack.spec.ts` | both languages: title (`OpenStack: …`), description, canonical, hreflang with x-default, Open Graph article, CreativeWork JSON-LD, unique ids; an individual academic project of 2026, June 2026 in the head; both links back to More work; six sections in the contents list; the components the project used (Keystone, Glance, Nova and Neutron, 24 systemd units, `ens4`, `br-ex`, iptables, `brex-setup.service`, `vm-app`, `vm-db`, PostgreSQL 14, tcpdump, MASQUERADE, iptables-persistent); one figure, named by its caption and described by the paths, no images, the host's additions said in words, the outbound path in order; no unsupported claims (production, enterprise, a company or client, real-time, high availability, multi-node, Kubernetes, services not deployed, uptime, percentages, public access) and no private details (addresses, project IDs, student numbers, the university mail domain, the course code, cloud project and VM names, written-out passwords, email addresses in the article); 600–900 words in English (at most 1050 in Greek); each section shown once as it is reached, the diagram with it, no change in height; everything shown under reduced motion and without JavaScript; no overflow and no diagram text under 11px at 320, 390 and 640px (200% zoom) |
| `cuda.spec.ts` | both languages: title (`CUDA: …`), description, canonical, hreflang with x-default, Open Graph article, CreativeWork JSON-LD, unique ids; an individual academic project of 2026, June 2026 and the NVIDIA Tesla T4 in the head; both links back to More work; four sections in the contents list; `N = 4096`, `gettimeofday` and `cudaDeviceSynchronize` in the baseline, the 8,192 global loads in the bottleneck; Tiling and Register blocking, each with its times before and after on a line of its own (306.0 → 190.7 ms, 1.6× speedup; 190.7 → 86.1 ms, 2.2× speedup); the result (a 3.6× speedup, never `× faster` anywhere on the page, 3.2× to 5.8× across sizes, the checksum as agreement between kernels and not a reference check); one figure, named by its caption and described by its note, no images, the three kernels in order with their times and ratios written out, bars hidden from assistive technology and drawn on one scale; no unsupported claims (FLOPS, bandwidth, occupancy, cache, latency, utilisation, throughput, profiler names, averages, a cause for the first launch, production, industry, publication, hype words, percentages) and no private details (student numbers, the university mail domain, a course code, teaching staff, file, notebook and folder names); 500–700 words in English (at most 820 in Greek); each section shown once as it is reached, the figure with it, no change in its text or the page height; everything shown under reduced motion and without JavaScript; no overflow and no figure text under 11px at 320, 390 and 640px (200% zoom) |
| `computer-vision.spec.ts` | both languages: title (`Computer Vision: …` / `Όραση υπολογιστών: …`), description starting with the kind of project, canonical, hreflang with x-default, Open Graph article, CreativeWork JSON-LD, unique ids; an individual academic project of 2026, February 2026, PyTorch and the course in the head; both links back to More work; four sections in the contents list; trained from scratch, fine-tuned and pretrained said in words; the CIFAR-100 CNN (30.62% to 42.13%) and the three ResNet18 runs, each with its test accuracy on a line of its own (87.24%, 90.32%, 88.28%); the comparison with its setup, its gap (2.4 to 3.0 points), its time ratio (2.7) and its limit; segmentation (75.79% pixel accuracy) and detection (training loss 0.644 → 0.161, said with a word) with the counts and what was not measured (no mAP, no IoU); the limits of the runs in What I learned; one figure, a table named by its caption and described by its note, with column and row headers and the six values, no images; no unsupported claims (general rankings of architectures, state of the art, robustness, production, real time, attention, quadratic cost, publication, hype words, an mAP or IoU figure, figures from unsubmitted runs) and no private details (student numbers, the university mail domain, a course code, teaching staff, notebook, folder and storage names); 350–600 words in English (at most 660 in Greek); each section shown once as it is reached, the table with it; everything shown under reduced motion and without JavaScript; no overflow and no figure text under 11px at 320, 390 and 640px (200% zoom) |
| `theme-locale.spec.ts` | language switch keeps the route and the theme (header and footer), no light frame after dark, keyboard language links, clean loads in both themes |
| `thesis.spec.ts` | both languages: title, canonical, hreflang and CreativeWork JSON-LD, unique ids, links back to the work section, thirteen sections in the contents list, disclaimer and attribution, seven actors, nine signing steps, evidence counts and timings, five limitations, the data gallery (no autoplay, previous/next with wrap-around, arrow keys, indicators, inert hidden slides, announcement), dark theme kept across a language switch |
| `typography.spec.ts` | every text run drawn by its language's web font (the QA page, the homepage and the ErgoHub, OpenStack, CUDA and computer vision case studies in both languages; Plex Mono inside a run only for inline code), Greek coverage, uppercase Greek without tonos, equal line boxes |

Note for Playwright: after a reload or a second navigation in the same
page, do not wait for `networkidle`. Chromium serves cached route
prefetches and revalidates them in the background, and those requests
never report as finished. Wait for `load` and `document.fonts.ready`.
