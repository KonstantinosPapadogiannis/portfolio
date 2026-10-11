import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Eyebrow, eyebrowClass } from "@/components/ui/eyebrow";
import { TextLink } from "@/components/ui/text-link";
import { prose, statement } from "@/components/thesis/case-section";
import { ErgoSection } from "@/components/ergohub/case-section";
import { PathsFigure } from "@/components/ergohub/paths-figure";
import { collaboratorConfig } from "@/config/site";
import { ergohub } from "@/config/work";

function GlanceRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-border py-3">
      <dt className={`${eyebrowClass} text-muted`}>{label}</dt>
      <dd className="mt-1.5 text-[0.875rem] leading-[1.375rem] text-pretty text-ink">{children}</dd>
    </div>
  );
}

export function Overview() {
  const t = useTranslations("ergohubPage.overview");

  return (
    <ErgoSection id="overview">
      <p className={statement}>{t("statement")}</p>

      <div className="mt-12 grid gap-y-12 md:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-x-16">
        <div className={`${prose} space-y-5`}>
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>
            {t.rich("attribution", {
              anastasia: (chunks) => (
                <TextLink href={collaboratorConfig.anastasiaZerva.linkedin} arrow="none">
                  {chunks}
                </TextLink>
              ),
            })}
          </p>
          <p className="text-ink">{t("disclaimer")}</p>
        </div>

        <div>
          <Eyebrow as="h3">{t("glance.label")}</Eyebrow>
          <dl className="mt-3 border-b border-border">
            <GlanceRow label={t("glance.roles")}>{t("glance.rolesValue")}</GlanceRow>
            {/* Names of tools, in Plex Mono, which has no Greek. */}
            {ergohub.stack.map((group) => (
              <GlanceRow key={group.key} label={t(`glance.groups.${group.key}`)}>
                <span lang="en" className="font-mono text-[0.75rem] leading-5">
                  {group.items.join(", ")}
                </span>
              </GlanceRow>
            ))}
          </dl>
        </div>
      </div>

      <PathsFigure />
    </ErgoSection>
  );
}
