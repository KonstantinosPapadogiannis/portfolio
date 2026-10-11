# Accessibility

The target is WCAG 2.2 level AA. This file lists what the tests check, the
conventions that keep the site usable at any text size, and what still has
to be checked by hand. No screen reader test has been done yet: the manual
checklist below is open.

## Automated checks

`tests/accessibility.spec.ts` runs on every page in both languages (the
homepage, the résumé page and the six case studies) and on two not-found
addresses:

| Check | Conditions |
| --- | --- |
| axe-core (`@axe-core/playwright`), rules tagged WCAG 2.0, 2.1 and 2.2 A and AA | Light and dark theme, reduced motion so every section is in its final state |
| Reflow (WCAG 1.4.10): no sideways scrolling, the page heading visible | 200% and 400% browser zoom of a 1280 × 900 window (640 and 320 CSS pixels) |
| Larger default text size (browser setting, not zoom): no sideways scrolling, the page heading visible, the menu button inside the window | 1280px wide at 24px and 32px, 390px wide at 24px and 32px (150% and 200% of 16px); Chromium only, through the DevTools protocol |

axe finds only part of what WCAG asks for, and a test that passes is not a
claim of conformance.

Other specs cover, in Chromium on every run and in Firefox and WebKit with
`pnpm test:e2e:browsers` (except the checks that read data only Chromium
gives):

- the skip link, and keyboard order with a visible focus ring at each stop on
  the homepage (`foundation.spec.ts`, `homepage.spec.ts`);
- the mobile menu: Escape closes it and focus goes back to its button
  (`navigation.spec.ts`); without JavaScript, its inert button is hidden and
  primary navigation is shown directly (`foundation.spec.ts`);
- the thesis data gallery: arrow keys, previous and next, hidden slides
  inert, each change announced (`thesis.spec.ts`);
- the theme toggle's name and its state in `aria-pressed`;
- every figure named by its caption, and charts said in text, with their bars
  hidden from assistive technology (the case study specs);
- everything shown at once under reduced motion and without JavaScript;
- no overflow at 320 and 390px, and no figure text under 11px at 320, 390
  and 640px;
- `lang="el"` on Greek text, so screen readers and fonts switch language
  (`typography.spec.ts`).

## Sizes in rem

Font sizes and breakpoints are in rem, so they follow the reader's default
text size as well as zoom. Tailwind's breakpoints are in rem already, and the
site's own are written as `min-[24rem]:`-style variants.

Three adjustments at 360px stay in pixels, because they make room for the
header name, whose size is in pixels, or fit the narrowest phones: the globe
of the language switcher, the gap between the hero's links and the size of
the address in the footer.

Lengths that are not text stay in pixels: column widths, gutters, borders,
radii, the 44px touch targets of the icon buttons and the offsets that line
them up with the text column. They scale with zoom, which is what WCAG 1.4.4
(Resize Text) and 1.4.10 (Reflow) are tested with.

Two font sizes stay in pixels:

- the name in the header, which grows with the window from 15px to 24px
  (30px from 1024px) so it always leaves room for the controls beside it;
- the share card page `/qa/og`, which is drawn at exactly 1200 × 630 for the
  images in `public/og/` and is not part of the site.

With a larger default text size on a phone, three things give way rather
than push the page sideways: the footer name stops growing at 11vw, the role
of each organisation in the homepage's architecture figure moves under its
name, and the labels of the thesis test counts break a word that no longer
fits. The computer vision results table scrolls inside its frame. None of
this changes the page at the default text size.

## Manual checklist

Not done yet. Each item needs a person and the named setup; record the date,
browser and result next to it when done.

Screen readers:

- [ ] NVDA with Firefox and with Chrome, Windows: the homepage, one case
      study and the résumé page in both languages.
- [ ] VoiceOver with Safari, macOS: the same pages.
- [ ] VoiceOver with Safari, iOS: the homepage, the mobile menu, a case study.
- [ ] TalkBack with Chrome, Android: the same as iOS.
- [ ] Orca with Firefox, Linux: the homepage.

For each: the page title and the language are announced; headings make an
outline (one `h1`, no skipped levels); the skip link moves to the content;
landmarks (banner, navigation, main, contentinfo) are named; the language
switcher reads as a group with "English" and "Ελληνικά", the current one
marked; the theme toggle reads its name and pressed state; each figure reads
its caption and its text description, never the drawn bars; Greek text is
read with a Greek voice; the thesis gallery announces each slide; the CV link
says it is a PDF.

Keyboard and display:

- [ ] Keyboard only, every page: every link and control reached in reading
      order, the focus ring always visible, nothing reached that is hidden.
- [ ] Windows High Contrast (forced colours): focus rings, rules, figure
      lines and the theme toggle still visible.
- [ ] Text spacing (WCAG 1.4.12) with a bookmarklet that sets line height
      1.5, paragraph spacing 2, letter spacing 0.12 and word spacing 0.16:
      no text cut off or overlapping.
- [ ] Pinch zoom on a phone up to 500%: nothing fixed covers the content.
- [ ] Reduced motion set in the operating system: no section moves in.
- [ ] Safari with a larger default text size on a phone: the computer vision
      results table, which then scrolls inside its frame, can be scrolled
      from the keyboard.
