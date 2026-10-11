import type { ReactNode } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/components/icons";
import { TextLink } from "@/components/ui/text-link";
import { lead, prose } from "@/components/thesis/case-section";
import { VisionSection } from "@/components/vision/case-section";
import { ResultsTable } from "@/components/vision/results-table";
import { sectionIds } from "@/config/navigation";
import { vision } from "@/config/work";
import { getPathname } from "@/i18n/navigation";
import { nb } from "@/lib/rich-text";

// The four sections of the computer vision case study: classification, the
// model comparison, segmentation and detection, and what the numbers can
// show. Each exercise is reported with the metric its notebook measured and
// the split it was measured on (docs/CONTENT_AND_VOICE.md); where nothing
// was measured, the page says so. The measured figure of each run sits on
// its own line under its description, as the times do in the CUDA case study.

// A term and its description, one per row, as in the CUDA case study.
const row =
  "grid gap-y-1 border-b border-border py-4 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-x-10";
const rowLabel = "text-[15px] leading-6 font-medium text-ink md:text-[16px] md:leading-[25px]";
const rowBody =
  "max-w-[620px] text-[15px] leading-6 text-pretty text-ink/80 md:text-[16px] md:leading-[25px]";

// The figures are in Plex Mono, which has no Greek, so only they are set in
// it; a word between them stays in the text face.
function Measured({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14px] leading-[22px]">
      <span className="text-muted">{label}</span>{" "}
      <span className="flex items-center gap-1.5 text-ink">{children}</span>
    </p>
  );
}

function usePercent() {
  const format = useFormatter();
  return (value: number) =>
    `${format.number(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

const runs = [
  { key: "featureExtraction", term: "Feature extraction" },
  { key: "fineTuning", term: "Fine-tuning" },
  { key: "augmentation", term: "Augmentation" },
] as const;

export function Classification() {
  const t = useTranslations("visionPage.classification");
  const percent = usePercent();

  return (
    <VisionSection id="classification">
      <p className={lead}>{t.rich("lead", { nb })}</p>
      <p className={`${prose} mt-5`}>{t.rich("p2", { nb })}</p>
      <dl className="mt-6 max-w-[880px] border-t border-border md:mt-8">
        {runs.map(({ key, term }) => (
          <div key={key} className={row}>
            <dt lang="en" className={rowLabel}>
              {term}
            </dt>
            <dd className={rowBody}>
              <p>{t(`runs.${key}`)}</p>
              <Measured label={t("metric")}>
                <span className="font-mono">{percent(vision.pets[key])}</span>
              </Measured>
            </dd>
          </div>
        ))}
      </dl>
      <p className={`${prose} mt-8 md:mt-10`}>{t("p3")}</p>
    </VisionSection>
  );
}

export function Comparison() {
  const t = useTranslations("visionPage.comparison");
  const format = useFormatter();
  const { vit, vgg } = vision.cifar10;
  const oneDecimal = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
  const gaps = [vit.five - vgg.five, vit.ten - vgg.ten];

  return (
    <VisionSection id="comparison">
      <p className={lead}>{t.rich("lead", { nb })}</p>
      <div className="mt-10 md:mt-12">
        <ResultsTable />
      </div>
      <p className={`${prose} mt-10 md:mt-12`}>
        {t.rich("p1", {
          nb,
          low: format.number(Math.min(...gaps), oneDecimal),
          high: format.number(Math.max(...gaps), oneDecimal),
          ratio: format.number(vit.seconds / vgg.seconds, oneDecimal),
        })}
      </p>
    </VisionSection>
  );
}

export function SegmentationDetection() {
  const t = useTranslations("visionPage.segmentation-detection");
  const format = useFormatter();
  const percent = usePercent();
  const loss = (value: number) =>
    format.number(value, { minimumFractionDigits: 3, maximumFractionDigits: 3 });

  return (
    <VisionSection id="segmentation-detection">
      <dl className="max-w-[880px] border-t border-border">
        <div className={row}>
          <dt lang="en" className={rowLabel}>
            Segmentation
          </dt>
          <dd className={rowBody}>
            <p>{t("segmentation")}</p>
            <Measured label={t("segmentationMetric")}>
              <span className="font-mono">{percent(vision.segmentation)}</span>
            </Measured>
          </dd>
        </div>
        <div className={row}>
          <dt lang="en" className={rowLabel}>
            Detection
          </dt>
          <dd className={rowBody}>
            <p>{t.rich("detection", { nb })}</p>
            {/* The arrow is drawn; it is read as a word. */}
            <Measured label={t("detectionMetric")}>
              <span className="font-mono">{loss(vision.detectionLoss.first)}</span>
              <span className="sr-only"> {t("to")} </span>
              <ArrowRightIcon size={12} className="shrink-0 text-muted" />
              <span className="font-mono">{loss(vision.detectionLoss.last)}</span>
            </Measured>
          </dd>
        </div>
      </dl>
      <p className={`${prose} mt-8 md:mt-10`}>{t("p1")}</p>
    </VisionSection>
  );
}

export function Lessons() {
  const t = useTranslations("visionPage.lessons");
  const locale = useLocale();

  return (
    <VisionSection id="lessons">
      <p className={lead}>{t("lead")}</p>
      <p className={`${prose} mt-5`}>{t.rich("p1", { nb })}</p>
      <TextLink
        href={`${getPathname({ href: "/", locale })}#${sectionIds.moreWork}`}
        internal
        arrow="left"
        className="mt-12 text-[15px] text-ink hover:text-steel md:mt-14"
      >
        {t("back")}
      </TextLink>
    </VisionSection>
  );
}
