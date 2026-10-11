import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { TextLink } from "@/components/ui/text-link";
import { sectionIds } from "@/config/navigation";
import { vision } from "@/config/work";
import { getPathname } from "@/i18n/navigation";

// The head of the computer vision case study, set as the CUDA one is: the
// way back to the projects, a meta line, the title and the facts of the
// project. From 1024px the facts sit in a column beside the subtitle; below
// that they follow it. The parts come in once on load (data-enter in
// globals.css).
export function VisionHero() {
  const t = useTranslations("visionPage");
  const tProject = useTranslations("projects.vision");
  const locale = useLocale();

  return (
    <Container as="header" className="pt-8 pb-12 md:pt-10 md:pb-16 lg:pb-20">
      <TextLink
        href={`${getPathname({ href: "/", locale })}#${sectionIds.moreWork}`}
        internal
        arrow="left"
        data-enter="1"
        className="text-[0.875rem] text-muted hover:text-ink"
      >
        {t("back")}
      </TextLink>

      <div className="mt-12 md:mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-x-16">
        <div>
          <p
            data-enter="1"
            className="flex flex-wrap items-baseline gap-x-[18px] font-label text-[0.6875rem] leading-5 text-muted uppercase lg:text-[0.8125rem] lg:normal-case"
          >
            <span className="text-ink">{tProject("name")}</span> <span>{t("kind")}</span>{" "}
            <span>{vision.year}</span>
          </p>

          <h1
            id="case-title"
            data-enter="1"
            className="mt-5 max-w-[920px] text-[2.375rem] leading-[2.625rem] font-semibold tracking-[-0.025em] text-balance text-ink sm:text-[3rem] sm:leading-[3.25rem] lg:mt-6 lg:text-[4rem] lg:leading-[4.25rem]"
          >
            {t("title")}
          </h1>

          <p
            data-enter="2"
            className="mt-5 max-w-[680px] text-[1.125rem] leading-[1.6875rem] text-balance text-muted md:text-[1.375rem] md:leading-[1.9375rem] lg:mt-6"
          >
            {t("subtitle")}
          </p>
        </div>

        <dl
          data-enter="3"
          className="mt-10 grid gap-y-4 border-t border-border pt-5 sm:grid-cols-2 sm:gap-x-10 lg:mt-0 lg:grid-cols-1 lg:gap-y-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pb-1 lg:pl-6"
        >
          <div>
            <dt className={`${eyebrowClass} text-muted`}>{t("periodLabel")}</dt>
            <dd className="mt-1.5 text-[0.875rem] leading-[1.375rem] text-ink">{t("period")}</dd>
          </div>
          <div>
            <dt className={`${eyebrowClass} text-muted`}>{t("platformLabel")}</dt>
            <dd className="mt-1.5 text-[0.875rem] leading-[1.375rem] text-balance text-ink">
              {t("platform")}
            </dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <dt className={`${eyebrowClass} text-muted`}>{t("contextLabel")}</dt>
            <dd className="mt-1.5 text-[0.875rem] leading-[1.375rem] text-balance text-ink">
              {t("context")}
            </dd>
          </div>
        </dl>
      </div>
    </Container>
  );
}
