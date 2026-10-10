# Art Direction

## Core direction

**Modern Engineering Editorial**

The site should feel:
- human-designed
- precise
- technical
- restrained
- premium
- serious
- personal

Not:
- SaaS landing page
- Web3 marketing page
- cyberpunk/hacker site
- generic AI portfolio template

## Visual source of truth

Use the exported Figma **Unified Pass 2** desktop and mobile images as the primary visual reference.

Match:
- content width
- spacing
- hierarchy
- section rhythm
- line lengths
- borders/dividers
- button proportions
- project layout
- portrait placement
- footer composition
- mobile reflow

The implementation should be recognizably the same site.

## Palette

Start from:

```css
--background: #F3F1EB;
--ink:        #15181D;
--navy:       #263747;
--steel:      #52708A;
--muted:      #6F716F;
--border:     #D7D3CB;
--surface:    #FBFAF6;
```

Small optical/accessibility adjustments are allowed.

No purple.
No neon.
No rainbow gradients.

## Typography

Primary:
- Geist or visually equivalent high-quality modern sans

Technical metadata:
- IBM Plex Mono

Use monospace sparingly.

Do not add decorative serif typography unless the Figma reference clearly calls for it.

## Identity repetition

Approved (final):

Header:
- `K. Papadogiannis`

Hero:
- one small line: `Konstantinos Papadogiannis / Athens, GR`

About:
- portrait without repeating the full name beneath it

Footer:
- `Konstantinos Papadogiannis`, once, as the signature

Metadata and SEO:
- the full name

Favicon:
- a separate approved asset; it does not have to match the header

The identity is typographic. The `KP` mark from the Figma references is
retired: do not bring it back, and do not replace it with a monogram,
symbol or icon.

Do not repeat the full name several times on one page.

## Hero

Headline:

> Backend systems,  
> distributed software,  
> and cloud infrastructure.

Supporting copy should remain concise and factual.

Primary action:
- Selected work

Secondary:
- Résumé
- GitHub
- LinkedIn

No "Hi, I'm..." hero.
No waving hand.
No typewriter.
No "Hire me".

## Hero systems motif

Recreate the restrained systems/distributed-ledger motif as SVG/React.

It is atmospheric, not a literal architecture diagram.

Characteristics:
- low contrast
- symmetrical
- structural
- simple
- around 8–12 meaningful nodes
- integrated into whitespace

Do not make it crypto clipart.

## About

Desktop:
- text left
- portrait right

Mobile:
- text first
- portrait below

Portrait:
- real user portrait only
- rectangular editorial crop
- around 4:5
- subtle/no radius
- no circular avatar
- no gradient border
- no "available" badge

## Project hierarchy

Flagship:
- Thesis

Primary:
- ErgoHub
- OpenStack
- CUDA

Secondary:
- Computer Vision
- Household Energy Data Mining

Do not give all projects identical card treatment.

## Dark mode

Light mode is the approved/default visual target.

Dark mode should preserve the same identity:
- deep graphite background
- warm off-white text
- desaturated steel-blue accent
- no cyberpunk/neon look
