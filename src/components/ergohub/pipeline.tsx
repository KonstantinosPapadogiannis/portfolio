import { useTranslations } from "next-intl";
import { Eyebrow, eyebrowClass } from "@/components/ui/eyebrow";
import { itemBody, lead, prose, subhead } from "@/components/thesis/case-section";
import { ErgoSection } from "@/components/ergohub/case-section";
import { deliveryPaths, pipelinePhases, pipelineStages } from "@/components/ergohub/facts";
import { code } from "@/lib/rich-text";

// The Jenkinsfiles of each way to deploy, as named in the repository.
const jenkinsfiles = {
  kubectl: ["Jenkinsfile-backend", "Jenkinsfile-frontend"],
  ansible: ["Jenkinsfile-backend-ansible", "Jenkinsfile-frontend-ansible"],
  minikube: ["Jenkinsfile-backend-minikube", "Jenkinsfile-frontend-minikube"],
} as const;

// The stages of one pipeline, grouped by phase. The numbers run on across the
// groups, as the stages run in one pipeline; they are drawn, and the list
// carries them for assistive technology through `start`.
function StageColumn({ side }: { side: keyof typeof pipelineStages }) {
  const t = useTranslations("ergohubPage.pipeline.stages");
  const stages = pipelineStages[side];
  // The number of the first stage of each phase.
  const starts = pipelinePhases.map(
    (_, index) =>
      1 + pipelinePhases.slice(0, index).reduce((sum, phase) => sum + stages[phase].length, 0),
  );

  return (
    <div>
      <p className="text-[0.9375rem] leading-6 font-medium text-ink">{t(side)}</p>
      {pipelinePhases.map((phase, phaseIndex) => {
        const start = starts[phaseIndex];
        return (
          <div key={phase} className="mt-4 border-t border-border pt-3">
            <p className={`${eyebrowClass} text-muted`}>{t(`phases.${phase}`)}</p>
            <ol start={start} lang="en" className="mt-2 space-y-1">
              {stages[phase].map((stage, index) => (
                <li key={stage} className="flex gap-3 font-mono text-[0.75rem] leading-5 text-ink">
                  <span aria-hidden="true" className="w-5 shrink-0 text-muted tabular-nums">
                    {String(start + index).padStart(2, "0")}
                  </span>
                  <span>{stage}</span>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

export function Pipeline() {
  const t = useTranslations("ergohubPage.pipeline");

  return (
    <ErgoSection id="pipeline">
      <p className={lead}>{t("lead")}</p>

      <div className="mt-12 md:mt-14">
        <Eyebrow as="h3">{t("paths.label")}</Eyebrow>
        <ul className="mt-4 border-t border-border">
          {deliveryPaths.map((key) => (
            <li
              key={key}
              className="grid gap-y-3 border-b border-border py-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-x-10"
            >
              <div>
                <h4 className={subhead}>{t(`paths.items.${key}.title`)}</h4>
                {/* File names, in Plex Mono, which has no Greek. */}
                <p lang="en" className="mt-1 font-mono text-[0.75rem] leading-5 text-muted">
                  {jenkinsfiles[key].map((file) => (
                    <span key={file} className="block">
                      {file}
                    </span>
                  ))}
                </p>
              </div>
              <dl className="grid gap-y-2 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-x-6 md:gap-y-3">
                <dt className={`${eyebrowClass} text-muted sm:pt-[3px]`}>{t("paths.registry")}</dt>
                <dd className={itemBody}>{t(`paths.items.${key}.registry`)}</dd>
                <dt className={`${eyebrowClass} mt-2 text-muted sm:mt-0 sm:pt-[3px]`}>
                  {t("paths.deployment")}
                </dt>
                <dd className={itemBody}>{t.rich(`paths.items.${key}.deployment`, { code })}</dd>
              </dl>
            </li>
          ))}
        </ul>
      </div>

      <figure aria-labelledby="stages-caption" className="mt-14 md:mt-16">
        <figcaption id="stages-caption" className={`${eyebrowClass} text-muted`}>
          {t("stages.caption")}
        </figcaption>
        <div className="mt-6 grid gap-y-10 border border-border bg-surface px-[18px] py-6 md:mt-8 md:grid-cols-2 md:gap-x-10 md:p-7">
          <StageColumn side="api" />
          <StageColumn side="frontend" />
        </div>
      </figure>

      <div className={`${prose} mt-12 space-y-5 md:mt-14`}>
        <p>{t.rich("p1", { code })}</p>
        <p>{t("p2")}</p>
      </div>
    </ErgoSection>
  );
}
