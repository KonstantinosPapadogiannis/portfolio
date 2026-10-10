import { useTranslations } from "next-intl";
import { CaseSection, prose } from "@/components/thesis/case-section";
import { ArchitectureDiagram } from "@/components/thesis/architecture-diagram";
import { code } from "@/lib/rich-text";

export function Architecture() {
  const t = useTranslations("thesisPage.architecture");

  return (
    <CaseSection id="architecture">
      <div className="grid gap-y-5 lg:grid-cols-2 lg:gap-x-16">
        <p className={prose}>{t.rich("p1", { code })}</p>
        <p className={prose}>{t("p2")}</p>
      </div>

      <div className="mt-12 md:mt-14">
        <ArchitectureDiagram />
      </div>
    </CaseSection>
  );
}
