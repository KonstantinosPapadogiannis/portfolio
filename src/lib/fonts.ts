import { Geist, IBM_Plex_Mono, Inter } from "next/font/google";

// English text and the name in the header and footer. Geist has no Greek alphabet, so it is
// never used to set Greek.
export const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// Greek text, including any Latin words inside Greek sentences, so a
// sentence never switches typeface midway. Only the Greek subset is
// preloaded: English pages need it for the "ΕΛ" switcher label, while the
// Latin subset is fetched through unicode-range on Greek pages.
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["greek"],
});

// Technical metadata and code identifiers in English. No Greek glyphs.
// Regular only: the labels in the design are not set in a heavier weight,
// and every weight listed here is preloaded on every page.
export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: "400",
  subsets: ["latin"],
});

export const fontVariables = [geist.variable, inter.variable, plexMono.variable].join(" ");
