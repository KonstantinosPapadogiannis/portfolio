import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CaseSection, prose, subhead } from "@/components/thesis/case-section";

const results = ["recent", "old"] as const;

export function Performance() {
  const t = useTranslations("thesisPage.performance");

  return (
    <CaseSection id="performance">
      <div className="grid gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-x-16">
        <div className={`${prose} space-y-5`}>
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
        </div>

        <div>
          <Eyebrow as="h3">{t("resultsLabel")}</Eyebrow>
          {/* The values stay in the text face: the Greek "περίπου" has no
              glyphs in Plex Mono. */}
          <dl className="mt-3 border-t border-border">
            {results.map((key) => (
              <div
                key={key}
                className="flex items-baseline justify-between gap-6 border-b border-border py-2.5"
              >
                <dt className="text-[14px] leading-[22px] text-muted">
                  {t(`results.${key}.label`)}
                </dt>
                <dd className="text-[15px] leading-[22px] font-medium text-ink tabular-nums">
                  {t(`results.${key}.value`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-14 md:mt-16">
        <h3 className={subhead}>{t("deploymentTitle")}</h3>
        <p className={`${prose} mt-3`}>{t("deployment")}</p>
      </div>
    </CaseSection>
  );
}
