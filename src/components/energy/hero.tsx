import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { TextLink } from "@/components/ui/text-link";
import { sectionIds } from "@/config/navigation";
import { energy } from "@/config/work";
import { getPathname } from "@/i18n/navigation";

const facts = ["period", "team", "context", "tools"] as const;

// The head of the energy data mining case study, set as the computer vision
// one is: the way back to the projects, a meta line, the title and the facts
// of the project, two by two from 640px and in a column beside the subtitle
// from 1024px. The parts come in once on load (data-enter in globals.css).
export function EnergyHero() {
  const t = useTranslations("energyPage");
  const tProject = useTranslations("projects.energy");
  const locale = useLocale();

  return (
    <Container as="header" className="pt-8 pb-12 md:pt-10 md:pb-16 lg:pb-20">
      <TextLink
        href={`${getPathname({ href: "/", locale })}#${sectionIds.moreWork}`}
        internal
        arrow="left"
        data-enter="1"
        className="text-[14px] text-muted hover:text-ink"
      >
        {t("back")}
      </TextLink>

      <div className="mt-12 md:mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-x-16">
        <div>
          <p
            data-enter="1"
            className="flex flex-wrap items-baseline gap-x-[18px] font-label text-[11px] leading-5 text-muted uppercase lg:text-[13px] lg:normal-case"
          >
            <span className="text-ink">{tProject("name")}</span> <span>{t("kind")}</span>{" "}
            <span>{energy.year}</span>
          </p>

          <h1
            id="case-title"
            data-enter="1"
            className="mt-5 max-w-[920px] text-[38px] leading-[42px] font-semibold tracking-[-0.025em] text-balance text-ink sm:text-[48px] sm:leading-[52px] lg:mt-6 lg:text-[64px] lg:leading-[68px]"
          >
            {t("title")}
          </h1>

          <p
            data-enter="2"
            className="mt-5 max-w-[680px] text-[18px] leading-[27px] text-balance text-muted md:text-[22px] md:leading-[31px] lg:mt-6"
          >
            {t("subtitle")}
          </p>
        </div>

        <dl
          data-enter="3"
          className="mt-10 grid gap-y-4 border-t border-border pt-5 sm:grid-cols-2 sm:gap-x-10 lg:mt-0 lg:grid-cols-1 lg:gap-y-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pb-1 lg:pl-6"
        >
          {facts.map((fact) => (
            <div key={fact}>
              <dt className={`${eyebrowClass} text-muted`}>{t(`${fact}Label`)}</dt>
              <dd className="mt-1.5 text-[14px] leading-[22px] text-balance text-ink">
                {t(fact)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Container>
  );
}
