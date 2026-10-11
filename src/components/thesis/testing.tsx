import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CaseSection, itemBody, prose, statement } from "@/components/thesis/case-section";
import { line } from "@/lib/rich-text";

// Counted in the thesis repository.
const built = [
  ["chaincodes", "3"],
  ["contracts", "15"],
  ["collections", "5"],
  ["channels", "1"],
  ["connectors", "6"],
  ["registries", "5"],
  ["portals", "7"],
] as const;

function CountRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border py-2.5">
      <dt className="min-w-0 text-[0.875rem] leading-[1.375rem] wrap-break-word text-ink">{label}</dt>
      <dd className="shrink-0 text-right text-[0.875rem] leading-[1.375rem] text-ink">{children}</dd>
    </div>
  );
}

export function Testing() {
  const t = useTranslations("thesisPage.testing");

  return (
    <CaseSection id="testing">
      <p className={statement}>{t.rich("statement", { line })}</p>
      <p className={`${prose} mt-8`}>{t("p1")}</p>

      <div className="mt-12 grid gap-y-12 md:mt-14 md:grid-cols-2 md:gap-x-12">
        <div>
          <Eyebrow as="h3">{t("builtLabel")}</Eyebrow>
          <dl className="mt-3 border-t border-border">
            {built.map(([key, count]) => (
              <CountRow key={key} label={t(`built.${key}`)}>
                <span className="font-mono">{count}</span>
              </CountRow>
            ))}
          </dl>
        </div>

        <div>
          <Eyebrow as="h3">{t("testedLabel")}</Eyebrow>
          <dl className="mt-3 border-t border-border">
            <CountRow label={t("tested.chaincode")}>
              <span className="font-mono">157</span>
            </CountRow>
            <CountRow label={t("tested.frontend")}>{t("tested.frontendValue")}</CountRow>
          </dl>
          <p className={`${itemBody} mt-5`}>{t("suites")}</p>
        </div>
      </div>
    </CaseSection>
  );
}
