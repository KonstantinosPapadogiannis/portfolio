import { useFormatter, useTranslations } from "next-intl";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { vision } from "@/config/work";

// The one figure of the case study: the two models on CIFAR-10 as a table,
// test accuracy after the 5-epoch and the 10-epoch run, and the time of one
// epoch. A table and not bars: two accuracies three points apart would only
// look different on a cut axis. The model names are row headers, so every
// figure is read with its model and its column. Nothing in it moves: it
// comes in with its section.
//
// Model names are proper names, the same in both languages. The figures are
// in Plex Mono, formatted for the reader's language.

const models = [
  { key: "vit", name: "ViT-B/16" },
  { key: "vgg", name: "VGG16-BN" },
] as const;

const head = `${eyebrowClass} pb-3 align-bottom text-muted`;
const cell = "py-3.5 pl-3 text-right font-mono text-[13px] leading-5 whitespace-nowrap text-ink";

export function ResultsTable() {
  const t = useTranslations("visionPage.comparison.table");
  const format = useFormatter();
  const percent = (value: number) =>
    `${format.number(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

  return (
    <figure aria-labelledby="results-caption" aria-describedby="results-note">
      <figcaption id="results-caption" className={`${eyebrowClass} text-muted`}>
        {t("caption")}
      </figcaption>

      <div className="mt-6 max-w-[880px] border border-border bg-surface px-4 pt-5 pb-6 sm:px-[18px] md:mt-8 md:px-7 md:pt-6 md:pb-7">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className={`${head} pr-3`}>
                {t("model")}
              </th>
              <th scope="col" className={`${head} pl-3 text-right`}>
                {t("five")}
              </th>
              <th scope="col" className={`${head} pl-3 text-right`}>
                {t("ten")}
              </th>
              <th scope="col" className={`${head} pl-3 text-right`}>
                {t("time")}
              </th>
            </tr>
          </thead>
          <tbody>
            {models.map(({ key, name }) => {
              const result = vision.cifar10[key];
              return (
                <tr key={key} className="border-b border-border">
                  <th
                    scope="row"
                    lang="en"
                    className="py-3.5 pr-3 text-[14px] leading-5 font-medium whitespace-nowrap text-ink md:text-[15px]"
                  >
                    {name}
                  </th>
                  <td className={cell}>{percent(result.five)}</td>
                  <td className={cell}>{percent(result.ten)}</td>
                  <td className={cell}>{format.number(result.seconds)} s</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p id="results-note" className="mt-4 text-[13px] leading-5 text-pretty text-muted">
          {t("note")}
        </p>
      </div>
    </figure>
  );
}
