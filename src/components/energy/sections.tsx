import { useFormatter, useLocale, useTranslations } from "next-intl";
import { TextLink } from "@/components/ui/text-link";
import { lead, prose } from "@/components/thesis/case-section";
import { EnergySection } from "@/components/energy/case-section";
import { ForecastFigure } from "@/components/energy/forecast-figure";
import { sectionIds } from "@/config/navigation";
import { energy } from "@/config/work";
import { getPathname } from "@/i18n/navigation";
import { nb } from "@/lib/rich-text";

// The three sections of the energy data mining case study: classification,
// forecasting, and what the comparison showed. Every figure is reported with
// its metric and the split it was measured on (docs/CONTENT_AND_VOICE.md);
// the shares, gaps and ranges in the text are worked out from the figures in
// `energy` and formatted for the reader's language.

function useFigures() {
  const format = useFormatter();
  return {
    percent: (value: number, digits = 1) =>
      `${format.number(value, { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`,
    kwh: (value: number) =>
      format.number(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    count: (value: number) => format.number(value),
  };
}

// The metric names are the same in both languages.
const metrics = [
  { key: "accuracy", name: "Accuracy" },
  { key: "f1", name: "F1" },
  { key: "rocAuc", name: "ROC-AUC" },
] as const;

export function Classification() {
  const t = useTranslations("energyPage.classification");
  const { percent, kwh, count } = useFigures();
  const { threshold, testDays, testHigh, gradientBoosting, randomForest, logisticRegression } =
    energy.classification;

  return (
    <EnergySection id="classification">
      <p className={lead}>
        {t.rich("lead", {
          nb,
          threshold: kwh(threshold),
          days: count(energy.days),
          test: count(testDays),
        })}
      </p>
      <p className={`${prose} mt-5`}>{t.rich("p2", { nb })}</p>

      {/* The model, its split, then its three test metrics, each named. Only
          the figures are in Plex Mono. */}
      <div className="mt-8 max-w-[880px] border-y border-border py-4 md:mt-10 md:grid md:grid-cols-[11rem_minmax(0,1fr)] md:items-baseline md:gap-x-10">
        <p className="text-[0.9375rem] leading-6 md:text-[1rem] md:leading-[1.5625rem]">
          <span lang="en" className="font-medium text-ink">
            Gradient Boosting
          </span>{" "}
          <span className="block text-[0.8125rem] leading-5 text-muted">
            {t("split", { days: count(testDays) })}
          </span>
        </p>
        <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 md:mt-0">
          {metrics.map(({ key, name }) => (
            <div key={key} className="flex items-baseline gap-2.5 text-[0.875rem] leading-[1.375rem]">
              <dt lang="en" className="text-muted">
                {name}
              </dt>
              <dd className="font-mono text-ink">{percent(gradientBoosting[key])}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className={`${prose} mt-8 md:mt-10`}>
        {t.rich("p3", {
          nb,
          rf: percent(randomForest.accuracy),
          lr: percent(logisticRegression.accuracy),
          high: percent((testHigh / testDays) * 100, 0),
          majority: percent(((testDays - testHigh) / testDays) * 100, 0),
        })}
      </p>
    </EnergySection>
  );
}

export function Forecasting() {
  const t = useTranslations("energyPage.forecasting");
  const { kwh } = useFigures();
  const { ridge, randomForest, lstm, lstmLastRun } = energy.forecasting;

  return (
    <EnergySection id="forecasting">
      <p className={lead}>{t.rich("lead", { nb })}</p>
      <p className={`${prose} mt-5`}>{t.rich("p1", { nb, ridge: kwh(ridge) })}</p>
      <div className="mt-10 md:mt-12">
        <ForecastFigure />
      </div>
      <p className={`${prose} mt-10 md:mt-12`}>
        {t.rich("p2", { nb, gap: kwh(lstm - randomForest), lastRun: kwh(lstmLastRun) })}
      </p>
    </EnergySection>
  );
}

export function Comparison() {
  const t = useTranslations("energyPage.comparison");
  const locale = useLocale();
  const { kwh } = useFigures();
  const { persistence, ridge, randomForest, lstm, lstmLastRun } = energy.forecasting;
  const errors = [ridge, randomForest, lstm, lstmLastRun];

  return (
    <EnergySection id="comparison">
      <p className={lead}>
        {t.rich("lead", {
          nb,
          low: kwh(Math.min(...errors)),
          high: kwh(Math.max(...errors)),
          baseline: kwh(persistence),
        })}
      </p>
      <p className={`${prose} mt-5`}>{t.rich("p1", { nb })}</p>
      <TextLink
        href={`${getPathname({ href: "/", locale })}#${sectionIds.moreWork}`}
        internal
        arrow="left"
        className="mt-12 text-[0.9375rem] text-ink hover:text-steel md:mt-14"
      >
        {t("back")}
      </TextLink>
    </EnergySection>
  );
}
