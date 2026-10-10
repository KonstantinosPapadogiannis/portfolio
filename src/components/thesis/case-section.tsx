import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { sectionNumber, type CaseSectionId } from "@/components/thesis/outline";

// Text styles shared by the sections of a case study.
//
// Paragraphs avoid a last line of a single word (text-pretty).
//
// Body copy: a shade lighter than ink, in lines of about 75 characters.
export const prose =
  "max-w-[680px] text-[16px] leading-[26px] text-pretty text-ink/85 md:text-[17px] md:leading-7";

// The opening paragraph of a section, one step up from the body.
export const lead =
  "max-w-[760px] text-[18px] leading-7 text-pretty text-ink md:text-[20px] md:leading-[31px]";

// A sentence that carries the argument of a section. As large as the
// section heading but in the regular weight, so that it never reads as a
// second heading when it follows one.
export const statement =
  "max-w-[880px] text-[24px] leading-[31px] font-normal tracking-[-0.02em] text-balance text-ink md:text-[28px] md:leading-9 lg:text-[32px] lg:leading-10";

// The title of an item inside a section.
export const subhead =
  "text-[17px] leading-6 font-medium text-ink md:text-[18px] md:leading-[26px]";

// The body of an item inside a section.
export const itemBody =
  "text-[15px] leading-6 text-pretty text-ink/80 md:text-[16px] md:leading-[25px]";

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
      <p aria-hidden="true" className="font-mono text-[12px] leading-4 text-muted">
        {sectionNumber(id)}
      </p>
      <h2
        id={`${id}-heading`}
        className="mt-3 max-w-[820px] text-[26px] leading-8 font-semibold tracking-[-0.02em] text-balance text-ink md:text-[32px] md:leading-[38px]"
      >
        {t(`${id}.title`)}
      </h2>
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}
