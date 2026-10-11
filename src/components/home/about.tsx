import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/home/section-label";
import { sectionIds } from "@/config/navigation";
import { education } from "@/config/education";

// Text in the first two columns of the three-column grid used by the
// projects below, with the degree under it; the portrait at the start of
// the third. The personal story and the course record follow as sections
// of their own. The label, the text and the portrait each come in as one
// block as they scroll into view.
export function About() {
  const t = useTranslations("about");
  const format = useFormatter();
  // Out of ten, in the reader's number format: 7.51 in English, 7,51 in Greek.
  const grade = (value: number) =>
    `${format.number(value, { maximumFractionDigits: 2 })} / 10`;

  return (
    <section id={sectionIds.about} aria-labelledby="about-heading">
      <Reveal>
        <Container className="pt-[51px] pb-14 lg:grid lg:grid-cols-3 lg:pb-[52px]">
          <SectionLabel
            id="about-heading"
            parts={[t("label"), t("labelDetail")]}
            className="lg:col-span-3"
            data-reveal
          />

          <div data-reveal className="mt-[30px] lg:col-span-2 lg:mt-[37px] lg:pr-14">
            <p className="max-w-[660px] text-[1.875rem] leading-[2.1875rem] font-semibold tracking-[-0.02em] text-ink md:text-[2.25rem] md:leading-[2.6875rem] lg:text-[2.625rem] lg:leading-[3.0625rem]">
              {t("statement")}
            </p>

            <div className="mt-6 max-w-[640px] space-y-[22px] text-[0.9375rem] leading-[1.375rem] text-muted md:mt-8 md:space-y-[27px] md:text-[1.0625rem] md:leading-[1.6875rem]">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
            </div>

            <div className="mt-11 max-w-[640px] border-t border-border pt-6 md:grid md:grid-cols-2 md:gap-x-10">
              <Eyebrow as="h3" className="md:col-span-2">
                {t("education.label")}
              </Eyebrow>
              <div className="mt-3">
                <p className="text-[0.9375rem] leading-[1.375rem] font-medium text-ink">
                  {t("education.degree")}
                </p>
                <p className="text-[0.875rem] leading-[1.375rem] text-muted">
                  {t("education.university")}
                  {/* The dot wraps with the years after it, never ends a line,
                      and is read as a comma (globals.css). The padding stands
                      in for the 4px space before it. */}
                  <wbr />
                  <span className="whitespace-nowrap">
                    <span className="separator-dot ps-1">{" "}</span>
                    2022–2026
                  </span>
                </p>
              </div>
              <dl className="mt-4 grid grid-cols-[auto_1fr] content-start gap-x-5 text-[0.875rem] leading-[1.375rem] md:mt-3">
                <dt className="text-muted">{t("education.average")}</dt>
                <dd className="font-mono text-[0.8125rem] text-ink">{grade(education.average)}</dd>
                <dt className="text-muted">{t("education.thesis")}</dt>
                <dd className="font-mono text-[0.8125rem] text-ink">{grade(education.thesis)}</dd>
              </dl>
            </div>
          </div>

          <figure data-reveal className="mt-12 max-w-[390px] lg:col-start-3 lg:row-start-2 lg:mt-[37px]">
            <Image
              src="/images/portrait.jpg"
              alt={t("portraitAlt")}
              width={1003}
              height={1254}
              sizes="(min-width: 434px) 390px, calc(100vw - 44px)"
              className="aspect-[4/5] w-full bg-border/40 object-cover"
            />
            <figcaption className="mt-5 text-[0.75rem] leading-4 text-muted">
              {t("portraitCaption")}
            </figcaption>
          </figure>
        </Container>
      </Reveal>
    </section>
  );
}
