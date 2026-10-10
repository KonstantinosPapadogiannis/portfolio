import { useTranslations } from "next-intl";
import { CaseSection, lead, prose, statement } from "@/components/thesis/case-section";
import { PlanesFigure } from "@/components/thesis/planes-figure";
import { line } from "@/lib/rich-text";

export function DesignResponse() {
  const t = useTranslations("thesisPage.design");

  return (
    <CaseSection id="design">
      <p className={statement}>{t.rich("principle", { line })}</p>
      <p className={`${prose} mt-8`}>{t("p1")}</p>

      <div className="mt-12 md:mt-14">
        <PlanesFigure />
      </div>

      <p className={`${lead} mt-12 md:mt-14`}>{t("p2")}</p>
    </CaseSection>
  );
}
