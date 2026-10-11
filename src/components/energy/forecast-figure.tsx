import { useFormatter, useTranslations } from "next-intl";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { energy } from "@/config/work";

// The one figure of the case study: next-day test RMSE of the persistence
// baseline, Random Forest and the LSTM as bars on one scale that starts at
// zero, the baseline being the full width. Two errors 0.02 kWh apart look the
// same, as they should. Every bar has its value and its distance from the
// baseline written beside it, so the figure reads without the bars and
// without colour; the bars are for the eye only. Nothing in it moves: it
// comes in with its section.
//
// Model names are the same in both languages. The values are in Plex Mono,
// which has no Greek, formatted for the reader's language.

const models = [
  { key: "persistence", name: "Persistence baseline" },
  { key: "randomForest", name: "Random Forest" },
  { key: "lstm", name: "LSTM" },
] as const;

export function ForecastFigure() {
  const t = useTranslations("energyPage.forecasting.figure");
  const format = useFormatter();
  const { persistence, testDays } = energy.forecasting;
  const kwh = (value: number) =>
    `${format.number(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh`;

  return (
    <figure aria-labelledby="forecast-caption" aria-describedby="forecast-note">
      <figcaption id="forecast-caption" className={`${eyebrowClass} text-muted`}>
        {t("caption")}
      </figcaption>

      <div className="mt-6 max-w-[880px] border border-border bg-surface px-4 py-6 sm:px-[18px] md:mt-8 md:p-7">
        <ol className="space-y-6 md:space-y-7">
          {models.map(({ key, name }) => {
            const rmse = energy.forecasting[key];
            return (
              <li key={key}>
                <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-[0.875rem] leading-5 text-ink">
                  <span lang="en" className="font-medium">
                    {name}
                  </span>{" "}
                  <span className="font-mono text-[0.8125rem]">{kwh(rmse)}</span>
                </p>
                <div aria-hidden="true" className="mt-2 h-2.5 bg-border/45">
                  <div
                    className="h-full bg-diagram"
                    style={{ width: `${(rmse / persistence) * 100}%` }}
                  />
                </div>
                <p className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-[0.8125rem] leading-5">
                  <span className="text-pretty text-muted">{t(`models.${key}`)}</span>{" "}
                  <span className="text-ink">
                    {key === "persistence"
                      ? t("reference")
                      : t("below", {
                          percent: format.number(((persistence - rmse) / persistence) * 100, {
                            maximumFractionDigits: 0,
                          }),
                        })}
                  </span>
                </p>
              </li>
            );
          })}
        </ol>

        <p
          id="forecast-note"
          className="mt-6 border-t border-border pt-4 text-[0.8125rem] leading-5 text-pretty text-muted md:mt-7"
        >
          {t("note", {
            features: testDays.features,
            history: testDays.history,
            baseline: kwh(persistence),
          })}
        </p>
      </div>
    </figure>
  );
}
