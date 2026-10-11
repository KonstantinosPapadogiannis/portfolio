import { useLocale, useTranslations } from "next-intl";
import { TextLink } from "@/components/ui/text-link";
import { CaseSection, lead } from "@/components/thesis/case-section";
import { sectionIds } from "@/config/navigation";
import { getPathname } from "@/i18n/navigation";

export function Outcome() {
  const t = useTranslations("thesisPage.outcome");
  const locale = useLocale();

  return (
    <CaseSection id="outcome">
      <p className={lead}>{t("p1")}</p>

      <TextLink
        href={`${getPathname({ href: "/", locale })}#${sectionIds.work}`}
        internal
        arrow="left"
        className="mt-10 text-[0.9375rem] text-ink hover:text-steel md:mt-12"
      >
        {t("back")}
      </TextLink>
    </CaseSection>
  );
}
