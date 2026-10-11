import { useFormatter, useTranslations } from "next-intl";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { cuda } from "@/config/work";

// The one figure of the case study: the three kernels' times at N = 4096 as
// bars on one scale, the naive kernel's time being the full width. Every
// bar has its time and its ratio to the naive kernel written beside it, so
// the figure reads without the bars and without colour; the bars are for
// the eye only. Nothing in it moves: it comes in with its section.
//
// Kernel names are the functions in the source, the same in both languages
// and set in Plex Mono, which has no Greek, so each sits in its own element.
// The times are in Plex Mono too, formatted for the reader's language.

const kernels = [
  { key: "naive", name: "naive_matmul" },
  { key: "tiled", name: "tiled_matmul" },
  { key: "registerBlocked", name: "register_blocked_matmul" },
] as const;

export function BenchmarkFigure() {
  const t = useTranslations("cudaPage.result.figure");
  const format = useFormatter();
  const baseline = cuda.seconds.naive;
  const oneDecimal = { minimumFractionDigits: 1, maximumFractionDigits: 1 };

  return (
    <figure aria-labelledby="benchmark-caption" aria-describedby="benchmark-note">
      <figcaption id="benchmark-caption" className={`${eyebrowClass} text-muted`}>
        {t("caption")}
      </figcaption>

      <div className="mt-6 max-w-[880px] border border-border bg-surface px-4 py-6 sm:px-[18px] md:mt-8 md:p-7">
        <ol className="space-y-6 md:space-y-7">
          {kernels.map(({ key, name }) => {
            const seconds = cuda.seconds[key];
            return (
              <li key={key}>
                <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-[0.8125rem] leading-5 text-ink">
                  <span lang="en" className="font-mono [overflow-wrap:anywhere]">
                    {name}
                  </span>{" "}
                  <span className="font-mono">
                    {format.number(seconds * 1000, oneDecimal)} ms
                  </span>
                </p>
                <div aria-hidden="true" className="mt-2 h-2.5 bg-border/45">
                  <div
                    className="h-full bg-diagram"
                    style={{ width: `${(seconds / baseline) * 100}%` }}
                  />
                </div>
                <p className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-[0.8125rem] leading-5">
                  <span className="text-pretty text-muted">{t(`kernels.${key}`)}</span>{" "}
                  <span className="text-ink">
                    {key === "naive"
                      ? t("baseline")
                      : t("speedup", { ratio: format.number(baseline / seconds, oneDecimal) })}
                  </span>
                </p>
              </li>
            );
          })}
        </ol>

        <p
          id="benchmark-note"
          className="mt-6 border-t border-border pt-4 text-[0.8125rem] leading-5 text-pretty text-muted md:mt-7"
        >
          {t("note")}
        </p>
      </div>
    </figure>
  );
}
