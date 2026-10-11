import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Eyebrow, eyebrowClass } from "@/components/ui/eyebrow";
import { prose, statement } from "@/components/thesis/case-section";
import { ErgoSection } from "@/components/ergohub/case-section";
import { PathsFigure } from "@/components/ergohub/paths-figure";
import { ergohub } from "@/config/work";

function GlanceRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-border py-3">
      <dt className={`${eyebrowClass} text-muted`}>{label}</dt>
      <dd className="mt-1.5 text-[14px] leading-[22px] text-pretty text-ink">{children}</dd>
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
          <p>{t("attribution")}</p>
          <p className="text-ink">{t("disclaimer")}</p>
        </div>

        <div>
          <Eyebrow as="h3">{t("glance.label")}</Eyebrow>
          <dl className="mt-3 border-b border-border">
            <GlanceRow label={t("glance.roles")}>{t("glance.rolesValue")}</GlanceRow>
            {/* Names of tools, in Plex Mono, which has no Greek. */}
            {ergohub.stack.map((group) => (
              <GlanceRow key={group.key} label={t(`glance.groups.${group.key}`)}>
                <span lang="en" className="font-mono text-[12px] leading-5">
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
