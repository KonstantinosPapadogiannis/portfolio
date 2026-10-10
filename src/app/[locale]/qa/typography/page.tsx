import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";

// Internal page for checking English and Greek type side by side. It exists
// only in builds made with ENABLE_QA_ROUTES=1 (the Playwright run); every
// other build answers 404.
const qaEnabled = process.env.ENABLE_QA_ROUTES === "1";

export const metadata: Metadata = {
  title: "Typography QA",
  robots: { index: false, follow: false },
};

type Sample = {
  lang: "en" | "el";
  heading: string;
  eyebrow: string;
  h1: string;
  h2: string;
  h3: string;
  body: string;
  nav: string[];
  primary: string;
  secondary: string;
  disabled: string;
  textLink: string;
  tags: string[];
};

const samples: Sample[] = [
  {
    lang: "en",
    heading: "English",
    eyebrow: "Selected work",
    h1: "Backend systems, distributed software and cloud infrastructure.",
    h2: "I like understanding how the pieces of a system fit together.",
    h3: "Decentralised application for the digital submission of subsidies",
    body: "Built the application layer of a seven-organisation Hyperledger Fabric network: Go chaincodes, backend services and React/TypeScript portals.",
    nav: ["Work", "About", "Résumé", "Contact"],
    primary: "Selected work",
    secondary: "Résumé",
    disabled: "Unavailable",
    textLink: "Read case study",
    tags: ["Hyperledger Fabric", "Go", "React / TypeScript"],
  },
  {
    lang: "el",
    heading: "Ελληνικά",
    eyebrow: "Επιλεγμένα έργα",
    h1: "Συστήματα backend, κατανεμημένο λογισμικό και υποδομές cloud.",
    h2: "Μου αρέσει να καταλαβαίνω πώς ταιριάζουν μεταξύ τους τα κομμάτια ενός συστήματος.",
    h3: "Αποκεντρωμένη εφαρμογή για την ψηφιακή υποβολή επιδοτήσεων",
    body: "Ανέπτυξα το επίπεδο εφαρμογής ενός δικτύου Hyperledger Fabric επτά οργανισμών: chaincodes σε Go, υπηρεσίες backend και πύλες σε React/TypeScript.",
    nav: ["Έργα", "Σχετικά", "Βιογραφικό", "Επικοινωνία"],
    primary: "Επιλεγμένα έργα",
    secondary: "Βιογραφικό",
    disabled: "Μη διαθέσιμο",
    textLink: "Διαβάστε τη μελέτη περίπτωσης",
    tags: ["Hyperledger Fabric", "Go", "React / TypeScript"],
  },
];

const greekCoverage = [
  "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ",
  "αβγδεζηθικλμνξοπρστυφχψω",
  "Ά Έ Ή Ί Ό Ύ Ώ",
  "ά έ ή ί ό ύ ώ",
  "ΐ ΰ",
  "ϊ ϋ",
  "ς",
];

const mixedSentence =
  "Κατανεμημένα συστήματα, υποδομές cloud και ανάπτυξη backend εφαρμογών.";

const coverageStyles = [
  { id: "body", className: "text-[18px] leading-[1.6]" },
  { id: "label", className: "text-[12px] font-medium tracking-[0.08em]" },
  {
    id: "display",
    className: "text-[40px] font-bold leading-[1.06] tracking-[-0.02em] md:text-[64px]",
  },
];

export default async function TypographyQaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if (!qaEnabled) notFound();

  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-12 md:py-16">
      <h1 id="qa-top" lang="en" className="font-label text-[12px] uppercase tracking-[0.08em] text-muted">
        Typography QA
      </h1>

      <div className="mt-8 grid gap-16 md:grid-cols-2 md:gap-12">
        {samples.map((sample) => (
          <section
            key={sample.lang}
            lang={sample.lang}
            data-testid={`qa-${sample.lang}`}
            aria-label={sample.heading}
            className="border-t border-border pt-8"
          >
            <p data-testid="eyebrow" className="font-label text-[12px] uppercase tracking-[0.08em] text-muted">
              {sample.eyebrow}
            </p>
            <p data-testid="h1" className="mt-4 text-[40px] font-bold leading-[1.06] tracking-[-0.02em] text-ink md:text-[64px]">
              {sample.h1}
            </p>
            <p data-testid="body" className="mt-6 max-w-[60ch] text-[17px] leading-[1.6] text-muted md:text-[18px]">
              {sample.body}
            </p>
            <p data-testid="h2" className="mt-10 text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-ink md:text-[40px]">
              {sample.h2}
            </p>
            <p data-testid="h3" className="mt-8 text-[24px] font-semibold leading-[1.2] text-ink md:text-[30px]">
              {sample.h3}
            </p>

            <ul data-testid="nav" className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-[15px] text-ink">
              {sample.nav.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div data-testid="buttons" className="mt-8 flex flex-wrap items-center gap-4">
              <Button variant="primary">{sample.primary}</Button>
              <Button variant="secondary">{sample.secondary}</Button>
              <Button variant="primary" disabled>
                {sample.disabled}
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Button variant="text" href="#qa-top" data-testid="text-link">
                {sample.textLink}
                <ArrowRightIcon size={15} />
              </Button>
              <Button variant="text" href="#qa-top">
                GitHub
                <ArrowUpRightIcon size={15} />
              </Button>
            </div>

            <ul data-testid="tags" className="mt-8 flex flex-wrap gap-2">
              {sample.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-[3px] border border-border px-2.5 py-1 font-mono text-[12px] text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section
        lang="el"
        data-testid="qa-diacritics"
        aria-label="Κάλυψη ελληνικών χαρακτήρων"
        className="mt-16 border-t border-border pt-8"
      >
        {coverageStyles.map((style) => (
          <div
            key={style.id}
            data-testid={`coverage-${style.id}`}
            className={`mb-10 text-ink ${style.className}`}
          >
            {greekCoverage.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ))}

        <p data-testid="mixed" className="max-w-[60ch] text-[18px] leading-[1.6] text-ink">
          {mixedSentence}
        </p>
        <p data-testid="mixed-display" className="mt-6 text-[40px] font-bold leading-[1.06] tracking-[-0.02em] text-ink md:text-[64px]">
          {mixedSentence}
        </p>
        <p data-testid="uppercase" className="mt-6 font-label text-[12px] uppercase tracking-[0.08em] text-muted">
          Επιλεγμένα έργα · Σχετικά · Επικοινωνία · Ύψος · Άρθρο
        </p>
      </section>
    </Container>
  );
}
