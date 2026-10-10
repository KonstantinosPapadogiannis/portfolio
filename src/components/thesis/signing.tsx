import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/eyebrow";
import {
  CaseSection,
  itemBody,
  lead,
  prose,
  statement,
  subhead,
} from "@/components/thesis/case-section";
import { SigningFlow } from "@/components/thesis/signing-flow";
import { code, line, nb } from "@/lib/rich-text";

const wallet = ["identity", "keys", "storage", "backup", "leaves"] as const;
const reads = ["challenge", "message", "chain", "identity"] as const;

export function Signing() {
  const t = useTranslations("thesisPage.signing");

  return (
    <CaseSection id="signing">
      <p className={lead}>{t("p1")}</p>

      <div className="mt-8 grid gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-x-16">
        <p className={prose}>{t.rich("p2", { code, nb })}</p>

        <div>
          <Eyebrow as="h3">{t("walletLabel")}</Eyebrow>
          <dl className="mt-3 border-t border-border">
            {wallet.map((key) => (
              <div
                key={key}
                className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-x-4 border-b border-border py-2.5"
              >
                <dt className="text-[13px] leading-[22px] text-muted">{t(`wallet.${key}.label`)}</dt>
                <dd className="text-[14px] leading-[22px] text-pretty text-ink">
                  {t.rich(`wallet.${key}.value`, { nb })}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* The dashed rule is the trust boundary of the flow below. */}
      <p
        className={`${statement} mt-14 border-l border-dashed border-steel pl-5 md:mt-16 md:pl-7`}
      >
        {t.rich("quote", { line })}
      </p>

      <p className={`${prose} mt-8`}>{t("p3")}</p>

      <div className="mt-12 md:mt-14">
        <SigningFlow />
      </div>

      <div className="mt-16 md:mt-20">
        <h3 id="protected-reads" className={subhead}>
          {t("readsTitle")}
        </h3>
        <p className={`${prose} mt-3`}>{t("readsIntro")}</p>
        <ol
          aria-labelledby="protected-reads"
          className="mt-8 grid gap-y-8 md:grid-cols-2 md:gap-x-12 xl:grid-cols-4 xl:gap-x-8"
        >
          {reads.map((key, i) => (
            <li key={key} className="border-t border-border pt-4">
              <span aria-hidden="true" className="font-mono text-[11px] leading-4 text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="mt-3 text-[16px] leading-6 font-medium text-ink">
                {t(`reads.${key}.title`)}
              </h4>
              <p className={`${itemBody} mt-1.5`}>{t(`reads.${key}.body`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </CaseSection>
  );
}
