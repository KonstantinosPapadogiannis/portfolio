import type { ReactNode } from "react";

// Tags for messages rendered with t.rich().
//
// <nb>: keeps a term on one line. Browsers break after a hyphen, which splits
// names such as "Faster R-CNN" or "ROC-AUC" across lines.
export const nb = (chunks: ReactNode) => <span className="whitespace-nowrap">{chunks}</span>;

// <br>: a set line break. The space before it keeps the words apart in the
// page text (copy, search, reader view); at the end of a line it is not drawn.
export const br = () => (
  <>
    {" "}
    <br />
  </>
);

// <line>: a sentence that starts on a new line and is wrapped on its own, so
// that a balanced statement balances each sentence rather than the whole. Put
// a space between two lines: it stays in the page text but is not drawn.
export const line = (chunks: ReactNode) => <span className="block">{chunks}</span>;

// <code>: an identifier such as a channel, MSP or policy name, set in IBM
// Plex Mono and kept on one line.
export const code = (chunks: ReactNode) => (
  <code className="font-mono text-[0.92em] whitespace-nowrap">{chunks}</code>
);
