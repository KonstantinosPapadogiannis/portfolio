import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { TextLink } from "@/components/ui/text-link";
import { SectionLabel } from "@/components/home/section-label";
import { collaboratorConfig } from "@/config/site";

const paragraph = "mt-4 first:mt-0 md:mt-5";

// The personal story, after the professional About: a statement, then three
// chapters in order. Each chapter is ruled across the page, its number and
// title in the first column of the grid and the prose in a reading measure
// from the second, as the project text below is. Type only, no images; one
// line set larger as the pull statement, and the last line answering the
// question the story starts with.
export function Story() {
  const t = useTranslations("story");

  return (
    <section id="story" aria-labelledby="story-heading">
      <Container className="pt-[51px] pb-14 lg:pb-16">
        <SectionLabel id="story-heading" parts={[t("label")]} />

        <Reveal>
          <p
            data-reveal
            className="mt-[30px] max-w-[820px] text-[1.875rem] leading-[2.1875rem] font-semibold tracking-[-0.02em] text-balance text-ink md:text-[2.25rem] md:leading-[2.6875rem] lg:mt-[37px] lg:text-[2.625rem] lg:leading-[3.0625rem]"
          >
            {t("statement")}
          </p>

          <div className="mt-10 md:mt-12 lg:mt-14">
            <Chapter number="01" title={t("curiosity.title")}>
              <p data-reveal className={paragraph}>
                {t("curiosity.p1")}
              </p>
              <p data-reveal className={paragraph}>
                {t("curiosity.p2")}
              </p>
              <p data-reveal className={paragraph}>
                {t("curiosity.p3")}
              </p>
            </Chapter>

            <Chapter number="02" title={t("depth.title")}>
              <p data-reveal className={paragraph}>
                {t("depth.p1")}
              </p>
              <p data-reveal className={paragraph}>
                {t("depth.p2")}
              </p>
              {/* Set apart by size and space only: no quotation marks, no
                  rule, no box. It is his own line, not a quotation. */}
              <p
                data-reveal
                className="mt-8 mb-8 max-w-[520px] text-[1.4375rem] leading-[1.8125rem] font-semibold tracking-[-0.015em] text-balance text-ink md:mt-10 md:mb-10 md:text-[1.6875rem] md:leading-[2.125rem]"
              >
                {t("depth.pull")}
              </p>
              <p data-reveal>{t("depth.p3")}</p>
              <p data-reveal className={paragraph}>
                {t.rich("depth.p4", {
                  anastasia: (chunks) => (
                    <TextLink
                      href={collaboratorConfig.anastasiaZerva.linkedin}
                      arrow="none"
                    >
                      {chunks}
                    </TextLink>
                  ),
                })}
              </p>
            </Chapter>

            <Chapter number="03" title={t("direction.title")}>
              <p data-reveal className={paragraph}>
                {t("direction.p1")}
              </p>
              <p data-reveal className={paragraph}>
                {t("direction.p2")}
              </p>
              <div data-reveal className="mt-8 md:mt-10">
                <p>{t("direction.callbackLead")}</p>
                <p className="mt-2 max-w-[560px] text-[1.1875rem] leading-[1.6875rem] font-medium tracking-[-0.01em] text-balance text-ink md:text-[1.3125rem] md:leading-[1.875rem]">
                  {t("direction.callback")}
                </p>
              </div>
            </Chapter>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

// One chapter: on phones the number and title share a line above the prose;
// from 768px they sit in a rail beside it, from 1024px in the first column.
function Chapter({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-border pt-5 pb-10 last:pb-0 md:grid md:grid-cols-[176px_minmax(0,1fr)] md:gap-x-10 md:pt-6 md:pb-12 lg:grid-cols-3 lg:gap-x-0 lg:pb-14">
      <h3
        data-reveal
        className="text-[1.1875rem] leading-[1.625rem] font-medium tracking-[-0.01em] text-ink lg:pr-14 lg:text-[1.25rem] lg:leading-7"
      >
        <span className="me-3 font-label text-[0.75rem] leading-4 tracking-[0.04em] text-muted md:mb-2 md:block">
          {number}
        </span>{" "}
        {/* A run of its own, so the number's face never counts as part of
            the title's text. */}
        <span>{title}</span>
      </h3>
      <div className="mt-4 max-w-[640px] text-[1rem] leading-[1.625rem] text-muted md:mt-0 md:text-[1.0625rem] md:leading-[1.75rem] lg:col-span-2">
        {children}
      </div>
    </div>
  );
}
