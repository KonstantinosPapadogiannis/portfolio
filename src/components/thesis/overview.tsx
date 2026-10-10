import { useTranslations } from "next-intl";
import { Eyebrow, eyebrowClass } from "@/components/ui/eyebrow";
import { CaseSection, prose, statement } from "@/components/thesis/case-section";

// Names of tools, the same in both languages.
const technologies = [
  "Hyperledger Fabric",
  "Go",
  "React",
  "TypeScript",
  "Web Crypto API",
  "Keycloak",
  "PostgreSQL",
  "CouchDB",
  "IPFS/Kubo",
  "Docker Compose",
  "Playwright",
  "Vitest",
];

function GlanceRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-3">
      <dt className={`${eyebrowClass} text-muted`}>{label}</dt>
      <dd className="mt-1.5 text-[14px] leading-[22px] text-pretty text-ink">{children}</dd>
    </div>
  );
}

export function Overview() {
  const t = useTranslations("thesisPage.overview");
  const typeParts = t.raw("glance.typeParts") as string[];

  return (
    <CaseSection id="overview">
      <p className="max-w-[760px] text-[17px] leading-[27px] text-muted md:text-[19px] md:leading-[29px]">
        {t("question")}
      </p>
      <p className={`${statement} mt-4`}>{t("statement")}</p>

      <div className="mt-12 grid gap-y-12 md:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-x-16">
        <div className={`${prose} space-y-5`}>
          <p>{t("p1")}</p>
          <p className="text-ink">{t("disclaimer")}</p>
          <p>{t("attribution")}</p>
        </div>

        <div>
          <Eyebrow as="h3">{t("glance.label")}</Eyebrow>
          <dl className="mt-3 border-b border-border">
            <GlanceRow label={t("glance.type")}>
              {/* One part per line: in a narrow column, separators would
                  start a line. */}
              <ul>
                {typeParts.map((part) => (
                  <li key={part}>{part}</li>
                ))}
              </ul>
            </GlanceRow>
            <GlanceRow label={t("glance.role")}>{t("glance.roleValue")}</GlanceRow>
            <GlanceRow label={t("glance.scope")}>{t("glance.scopeValue")}</GlanceRow>
            <GlanceRow label={t("glance.collaboration")}>
              {t("glance.collaborationValue")}
            </GlanceRow>
            <GlanceRow label={t("glance.technologies")}>
              <span lang="en" className="font-mono text-[12px] leading-5">
                {technologies.join(", ")}
              </span>
            </GlanceRow>
          </dl>
        </div>
      </div>
    </CaseSection>
  );
}
