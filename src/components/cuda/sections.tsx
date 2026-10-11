import { useFormatter, useLocale, useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/components/icons";
import { TextLink } from "@/components/ui/text-link";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { lead, prose } from "@/components/thesis/case-section";
import { CudaSection } from "@/components/cuda/case-section";
import { BenchmarkFigure } from "@/components/cuda/benchmark-figure";
import { sectionIds } from "@/config/navigation";
import { cuda } from "@/config/work";
import { getPathname } from "@/i18n/navigation";
import { code } from "@/lib/rich-text";

// The four sections of the CUDA case study: the baseline and how it was
// measured, where its time went, the two changes, and the result. Each
// paragraph serves the problem, a measurement, the reasoning or the lesson
// (docs/CONTENT_AND_VOICE.md). What was measured is set apart from what is
// explained: the measured times sit on their own line under each change.

// A term and its description, one per row, as in the OpenStack case study.
const row =
  "grid gap-y-1 border-b border-border py-4 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-x-10";
const rowLabel = "text-[0.9375rem] leading-6 font-medium text-ink md:text-[1rem] md:leading-[1.5625rem]";
const rowBody =
  "max-w-[620px] text-[0.9375rem] leading-6 text-pretty text-ink/80 md:text-[1rem] md:leading-[1.5625rem]";

const method = ["timer", "inputs", "runs", "check"] as const;

export function Baseline() {
  const t = useTranslations("cudaPage.baseline");

  return (
    <CudaSection id="baseline">
      <p className={lead}>{t("lead")}</p>
      <p className={`${prose} mt-5`}>{t("p2")}</p>
      <h3 className={`${eyebrowClass} mt-10 text-muted md:mt-12`}>{t("methodLabel")}</h3>
      <dl className="mt-4 max-w-[880px] border-t border-border">
        {method.map((key) => (
          <div key={key} className={row}>
            <dt className={rowLabel}>{t(`method.${key}.label`)}</dt>
            <dd className={rowBody}>{t.rich(`method.${key}.body`, { code })}</dd>
          </div>
        ))}
      </dl>
      <p className={`${prose} mt-8 md:mt-10`}>{t("warmup")}</p>
    </CudaSection>
  );
}

export function Bottleneck() {
  const t = useTranslations("cudaPage.bottleneck");

  return (
    <CudaSection id="bottleneck">
      <p className={lead}>{t("lead")}</p>
      <p className={`${prose} mt-5`}>{t("p2")}</p>
    </CudaSection>
  );
}

// The time at N = 4096 before and after one change, from the program's
// output. The arrow is drawn; it is read as a word.
function Measured({ before, after }: { before: number; after: number }) {
  const t = useTranslations("cudaPage.optimisation");
  const format = useFormatter();
  const oneDecimal = { minimumFractionDigits: 1, maximumFractionDigits: 1 };

  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.875rem] leading-[1.375rem]">
      <span className="text-muted">{t("measured")}</span>{" "}
      <span className="flex items-center gap-1.5 text-ink">
        <span className="font-mono">{format.number(before * 1000, oneDecimal)} ms</span>
        <span className="sr-only"> {t("to")} </span>
        <ArrowRightIcon size={12} className="shrink-0 text-muted" />
        <span className="font-mono">{format.number(after * 1000, oneDecimal)} ms</span>
      </span>{" "}
      <span className="text-ink">
        {t("speedup", { ratio: format.number(before / after, oneDecimal) })}
      </span>
    </p>
  );
}

export function Optimisation() {
  const t = useTranslations("cudaPage.optimisation");
  const { naive, tiled, registerBlocked } = cuda.seconds;

  return (
    <CudaSection id="optimisation">
      <p className={lead}>{t("lead")}</p>
      <dl className="mt-6 max-w-[880px] border-t border-border md:mt-8">
        <div className={row}>
          <dt lang="en" className={rowLabel}>
            Tiling
          </dt>
          <dd className={rowBody}>
            <p>{t("tiling")}</p>
            <Measured before={naive} after={tiled} />
          </dd>
        </div>
        <div className={row}>
          <dt lang="en" className={rowLabel}>
            Register blocking
          </dt>
          <dd className={rowBody}>
            <p>{t("registers")}</p>
            <Measured before={tiled} after={registerBlocked} />
          </dd>
        </div>
      </dl>
      <p className={`${prose} mt-8 md:mt-10`}>{t("caveat")}</p>
    </CudaSection>
  );
}

export function Result() {
  const t = useTranslations("cudaPage.result");
  const locale = useLocale();

  return (
    <CudaSection id="result">
      <BenchmarkFigure />
      <div className={`${prose} mt-10 space-y-5 md:mt-12`}>
        <p>{t("p1")}</p>
        <p>{t("correctness")}</p>
      </div>
      <p className={`${lead} mt-8 md:mt-10`}>{t("lesson")}</p>
      <TextLink
        href={`${getPathname({ href: "/", locale })}#${sectionIds.moreWork}`}
        internal
        arrow="left"
        className="mt-12 text-[0.9375rem] text-ink hover:text-steel md:mt-14"
      >
        {t("back")}
      </TextLink>
    </CudaSection>
  );
}
