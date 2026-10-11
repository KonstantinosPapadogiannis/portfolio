import { Geist, IBM_Plex_Mono } from "next/font/google";

// English text and the name in the header and footer. Geist has no Greek alphabet, so it is
// never used to set Greek.
export const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// Greek text, including any Latin words inside Greek sentences, so a
// sentence never switches typeface midway, is set in Inter. Inter is declared
// in globals.css and not through next/font, which preloads per route and not
// per language (src/config/fonts.ts).

// Technical metadata and code identifiers in English. No Greek glyphs.
// Regular only: the labels in the design are not set in a heavier weight,
// and every weight listed here is preloaded on every page.
export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: "400",
  subsets: ["latin"],
});

export const fontVariables = [geist.variable, plexMono.variable].join(" ");
