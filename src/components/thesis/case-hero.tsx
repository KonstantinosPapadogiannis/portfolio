import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { TextLink } from "@/components/ui/text-link";
import { sectionIds } from "@/config/navigation";
import { getPathname } from "@/i18n/navigation";

// The head of the case study: the way back to the work section, the same
// meta line as the project on the homepage, the title and the academic
// context. From 1024px the department and supervisor sit in a column beside
// the subtitle; below that they follow it.
export function CaseHero() {
  const t = useTranslations("thesisPage");
  const locale = useLocale();

  return (
    <Container as="header" className="pt-8 pb-12 md:pt-10 md:pb-16 lg:pb-20">
      <TextLink
        href={`${getPathname({ href: "/", locale })}#${sectionIds.work}`}
        internal
        arrow="left"
        className="text-[14px] text-muted hover:text-ink"
      >
        {t("back")}
      </TextLink>

      <div className="mt-12 md:mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-x-16">
        <div>
          <p className="flex flex-wrap items-baseline gap-x-[18px] font-label text-[11px] leading-5 text-muted uppercase lg:text-[13px] lg:normal-case">
            <span className="text-ink">{t("kind")}</span> <span>2026</span>{" "}
            <span>
              <span className="sr-only">{t("grade")} </span>
              10/10
            </span>
          </p>

          <h1
            id="case-title"
            className="mt-5 max-w-[920px] text-[38px] leading-[42px] font-semibold tracking-[-0.025em] text-balance text-ink sm:text-[48px] sm:leading-[52px] lg:mt-6 lg:text-[64px] lg:leading-[68px]"
          >
            {t("title")}
          </h1>

          <p className="mt-5 max-w-[640px] text-[18px] leading-[27px] text-balance text-muted md:text-[22px] md:leading-[31px] lg:mt-6">
            {t("subtitle")}
          </p>
        </div>

        <dl className="mt-10 grid gap-y-4 border-t border-border pt-5 sm:grid-cols-2 sm:gap-x-10 lg:mt-0 lg:grid-cols-1 lg:gap-y-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pb-1 lg:pl-6">
          <div>
            <dt className={`${eyebrowClass} text-muted`}>{t("departmentLabel")}</dt>
            <dd className="mt-1.5 text-[14px] leading-[22px] text-balance text-ink">{t("department")}</dd>
          </div>
          <div>
            <dt className={`${eyebrowClass} text-muted`}>{t("supervisorLabel")}</dt>
            <dd className="mt-1.5 text-[14px] leading-[22px] text-ink">{t("supervisor")}</dd>
          </div>
        </dl>
      </div>
    </Container>
  );
}
