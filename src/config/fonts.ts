// Inter, for Greek text, is served from public/ and declared in globals.css.
// Its files are cached as immutable, so a new version goes in a new folder.
const interFolder = "/fonts/inter-4.001";

// Preloaded on every page: English pages need it for the "ΕΛ" label of the
// language switcher.
export const interGreek = `${interFolder}/greek.woff2`;

// Preloaded on Greek pages as well, or "backend" and "cloud" in the Greek
// headline would arrive after the first paint and move the lines below them.
// It is sent in a header of the page's own response (next.config.ts).
export const interLatin = `${interFolder}/latin.woff2`;
