import { useTranslations } from "next-intl";
import { CaseSection, itemBody, lead, prose, subhead } from "@/components/thesis/case-section";
import { code } from "@/lib/rich-text";

const chaincodes = ["policy", "entitlement", "subsidy"] as const;
const guards = ["state", "caller", "time", "duplicate", "amount"] as const;

export function Policy() {
  const t = useTranslations("thesisPage.policy");

  return (
    <CaseSection id="policy">
      <p className={lead}>{t("p1")}</p>

      <dl className="mt-8 border-t border-border">
        {chaincodes.map((key) => (
          <div
            key={key}
            className="grid gap-y-1 border-b border-border py-4 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-x-8"
          >
            <dt className="font-mono text-[13px] leading-6 text-ink">{key}-chaincode</dt>
            <dd className={`${itemBody} max-w-[640px]`}>{t(`chaincodes.${key}`)}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 grid gap-y-10 md:mt-14 lg:grid-cols-2 lg:gap-x-16">
        <div className={`${prose} space-y-5`}>
          <p>{t.rich("testPolicy", { code })}</p>
          <p>{t("p2")}</p>
        </div>

        <div>
          <h3 id="policy-guards" className={subhead}>
            {t("guardsLabel")}
          </h3>
          <ul aria-labelledby="policy-guards" className="mt-3 border-t border-border">
            {guards.map((key) => (
              <li
                key={key}
                className="border-b border-border py-2.5 text-[15px] leading-6 text-ink/85 md:text-[16px]"
              >
                {t(`guards.${key}`)}
              </li>
            ))}
          </ul>
          <p className={`${itemBody} mt-5`}>{t("timestamps")}</p>
        </div>
      </div>
    </CaseSection>
  );
}
