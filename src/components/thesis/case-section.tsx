import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { sectionNumber, type CaseSectionId } from "@/components/thesis/outline";

// Text styles shared by the sections of a case study.
//
// Paragraphs avoid a last line of a single word (text-pretty).
//
// Body copy: a shade lighter than ink, in lines of about 75 characters.
export const prose =
  "max-w-[680px] text-[1rem] leading-[1.625rem] text-pretty text-ink/85 md:text-[1.0625rem] md:leading-7";

// The opening paragraph of a section, one step up from the body.
export const lead =
  "max-w-[760px] text-[1.125rem] leading-7 text-pretty text-ink md:text-[1.25rem] md:leading-[1.9375rem]";

// A sentence that carries the argument of a section. As large as the
// section heading but in the regular weight, so that it never reads as a
// second heading when it follows one.
export const statement =
  "max-w-[880px] text-[1.5rem] leading-[1.9375rem] font-normal tracking-[-0.02em] text-balance text-ink md:text-[1.75rem] md:leading-9 lg:text-[2rem] lg:leading-10";

// The title of an item inside a section.
export const subhead =
  "text-[1.0625rem] leading-6 font-medium text-ink md:text-[1.125rem] md:leading-[1.625rem]";

// The body of an item inside a section.
export const itemBody =
  "text-[0.9375rem] leading-6 text-pretty text-ink/80 md:text-[1rem] md:leading-[1.5625rem]";

// One numbered section of a case study. The number repeats the one in the
// contents list, so it is not read out; the heading names the section.
export function CaseSection({
  id,
  children,
  className = "",
}: {
  id: CaseSectionId;
  children: ReactNode;
  className?: string;
}) {
  const t = useTranslations("thesisPage.sections");

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`border-t border-border pt-12 pb-14 first:border-t-0 md:pt-16 md:pb-20 ${className}`}
    >
      <p aria-hidden="true" className="font-mono text-[0.75rem] leading-4 text-muted">
        {sectionNumber(id)}
      </p>
      <h2
        id={`${id}-heading`}
        className="mt-3 max-w-[820px] text-[1.625rem] leading-8 font-semibold tracking-[-0.02em] text-balance text-ink md:text-[2rem] md:leading-[2.375rem]"
      >
        {t(`${id}.title`)}
      </h2>
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}
