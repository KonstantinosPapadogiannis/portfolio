import { useTranslations } from "next-intl";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { Track } from "@/components/ergohub/track";

// The two stories of the project side by side: how a request crosses the
// application, and how a change reaches the cluster. Each path is a track of
// steps with its name and a note beside it from 52rem, above it below that.
// The two meet in the cluster, which the line under them says in words.
const applicationSteps = ["user", "frontend", "api", "data"] as const;
const deliverySteps = ["source", "ci", "registry", "cluster", "ingress"] as const;

function PathRow({
  id,
  steps,
}: {
  id: "application" | "delivery";
  steps: readonly string[];
}) {
  const t = useTranslations(`ergohubPage.overview.paths.${id}`);

  return (
    <div className="@min-[52rem]:grid @min-[52rem]:grid-cols-[9.5rem_minmax(0,1fr)] @min-[52rem]:gap-x-10">
      <div>
        <p className={`${eyebrowClass} text-ink`}>
          {t("label")}
        </p>
        <p className="mt-1 text-[0.75rem] leading-4 text-muted">{t("note")}</p>
      </div>
      <Track
        className="mt-5 @min-[52rem]:mt-0"
        steps={steps.map((key) => ({
          key,
          name: t(`steps.${key}.name`),
          body: t(`steps.${key}.body`),
        }))}
        label={t("label")}
      />
    </div>
  );
}

export function PathsFigure() {
  const t = useTranslations("ergohubPage.overview.paths");

  return (
    <figure aria-labelledby="paths-caption" className="mt-14 md:mt-16">
      <figcaption id="paths-caption" className={`${eyebrowClass} text-muted`}>
        {t("caption")}
      </figcaption>

      <div className="@container mt-6 border border-border bg-surface px-[18px] py-6 md:mt-8 md:p-7">
        <PathRow id="application" steps={applicationSteps} />
        <div className="mt-8 border-t border-border pt-7 @min-[52rem]:mt-9 @min-[52rem]:pt-8">
          <PathRow id="delivery" steps={deliverySteps} />
        </div>
        <p className="mt-8 border-t border-border pt-4 text-[0.8125rem] leading-5 text-pretty text-ink/80 @min-[52rem]:mt-9 @min-[52rem]:pl-[calc(9.5rem+2.5rem)]">
          {t("meet")}
        </p>
      </div>
    </figure>
  );
}
