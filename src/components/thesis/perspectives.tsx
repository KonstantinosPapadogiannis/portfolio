import { useTranslations } from "next-intl";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { CaseSection, itemBody, prose } from "@/components/thesis/case-section";
import { organisations } from "@/components/thesis/consortium";

// One row per portal. The two that differ in kind, the farmer's (with the
// wallet) and the observer's (read-only), carry a note under the name.
export function Perspectives() {
  const t = useTranslations("thesisPage.perspectives");

  return (
    <CaseSection id="perspectives">
      <div className="grid gap-y-5 lg:grid-cols-2 lg:gap-x-16">
        <p className={prose}>{t("p1")}</p>
        <p className={prose}>{t("p2")}</p>
      </div>

      <ul aria-label={t("listLabel")} className="mt-10 border-t border-border md:mt-12">
        {organisations.map((id) => (
          <li
            key={id}
            className="grid gap-y-1.5 border-b border-border py-4 md:grid-cols-[13rem_minmax(0,1fr)] md:items-baseline md:gap-x-10"
          >
            <div>
              <h3 className="text-[1rem] leading-6 font-medium text-ink">{t(`rows.${id}.name`)}</h3>
              {t.has(`rows.${id}.tag`) && (
                <p className={`${eyebrowClass} mt-0.5 text-steel`}>{t(`rows.${id}.tag`)}</p>
              )}
            </div>
            <p className={`${itemBody} max-w-[620px]`}>{t(`rows.${id}.body`)}</p>
          </li>
        ))}
      </ul>
    </CaseSection>
  );
}
