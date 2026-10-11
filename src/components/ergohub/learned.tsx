import { useLocale, useTranslations } from "next-intl";
import { TextLink } from "@/components/ui/text-link";
import { itemBody, lead } from "@/components/thesis/case-section";
import { ErgoSection } from "@/components/ergohub/case-section";
import { sectionIds } from "@/config/navigation";
import { getPathname } from "@/i18n/navigation";

const rows = ["health", "config", "limits", "written"] as const;

export function Learned() {
  const t = useTranslations("ergohubPage.learned");
  const locale = useLocale();

  return (
    <ErgoSection id="learned">
      <p className={lead}>{t("lead")}</p>

      <ul className="mt-10 grid gap-y-10 md:mt-12 md:grid-cols-2 md:gap-x-12">
        {rows.map((key) => (
          <li key={key} className="border-t border-border pt-4">
            <h3 className="text-[1.25rem] leading-7 font-semibold tracking-[-0.01em] text-ink md:text-[1.375rem] md:leading-[1.875rem]">
              {t(`rows.${key}.title`)}
            </h3>
            <p className={`${itemBody} mt-2 max-w-[520px]`}>{t(`rows.${key}.body`)}</p>
          </li>
        ))}
      </ul>

      <TextLink
        href={`${getPathname({ href: "/", locale })}#${sectionIds.moreWork}`}
        internal
        arrow="left"
        className="mt-12 text-[0.9375rem] text-ink hover:text-steel md:mt-14"
      >
        {t("back")}
      </TextLink>
    </ErgoSection>
  );
}
