import { useTranslations } from "next-intl";
import { CaseSection, itemBody, lead, prose, statement } from "@/components/thesis/case-section";

const questions = ["know", "decide", "sign", "prove"] as const;

export function Learned() {
  const t = useTranslations("thesisPage.learned");

  return (
    <CaseSection id="learned">
      <p className={lead}>{t("lead")}</p>
      <p className={`${statement} mt-6`}>{t("statement")}</p>
      <p className={`${prose} mt-8`}>{t("intro")}</p>

      <ul className="mt-10 grid gap-y-10 md:mt-12 md:grid-cols-2 md:gap-x-12">
        {questions.map((key) => (
          <li key={key} className="border-t border-border pt-4">
            <h3 className="text-[1.25rem] leading-7 font-semibold tracking-[-0.01em] text-ink md:text-[1.375rem] md:leading-[1.875rem]">
              {t(`rows.${key}.title`)}
            </h3>
            <p className={`${itemBody} mt-2 max-w-[520px]`}>{t(`rows.${key}.body`)}</p>
          </li>
        ))}
      </ul>
    </CaseSection>
  );
}
