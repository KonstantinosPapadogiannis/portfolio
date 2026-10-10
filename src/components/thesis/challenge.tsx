import { useTranslations } from "next-intl";
import { CaseSection, itemBody, lead, subhead } from "@/components/thesis/case-section";

const problems = ["history", "signing", "visibility", "policy"] as const;

export function Challenge() {
  const t = useTranslations("thesisPage.challenge");

  return (
    <CaseSection id="challenge">
      <p className={lead}>{t("lead")}</p>

      <ul
        aria-label={t("problemsLabel")}
        className="mt-10 grid gap-y-8 md:mt-12 md:grid-cols-2 md:gap-x-12 md:gap-y-10"
      >
        {problems.map((key) => (
          <li key={key} className="border-t border-border pt-5">
            <h3 className={subhead}>{t(`problems.${key}.title`)}</h3>
            <p className={`${itemBody} mt-2 max-w-[520px]`}>{t(`problems.${key}.body`)}</p>
          </li>
        ))}
      </ul>

      <p className={`${lead} mt-12 md:mt-16`}>{t("goal")}</p>
    </CaseSection>
  );
}
