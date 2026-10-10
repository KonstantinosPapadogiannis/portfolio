import { useTranslations } from "next-intl";
import { CaseSection, prose, statement } from "@/components/thesis/case-section";
import { DataPlacement } from "@/components/thesis/data-placement";
import { line } from "@/lib/rich-text";

export function Privacy() {
  const t = useTranslations("thesisPage.privacy");

  return (
    <CaseSection id="privacy">
      <div className="grid gap-y-5 lg:grid-cols-2 lg:gap-x-16">
        <p className={prose}>{t("p1")}</p>
        <div className={`${prose} space-y-5`}>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
      </div>

      <p className={`${statement} mt-14 md:mt-16`}>{t.rich("statement", { line })}</p>

      <div className="mt-12 md:mt-14">
        <DataPlacement />
      </div>
    </CaseSection>
  );
}
