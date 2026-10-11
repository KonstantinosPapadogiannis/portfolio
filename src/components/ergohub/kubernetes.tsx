import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/components/icons";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { lead, prose } from "@/components/thesis/case-section";
import { ErgoSection } from "@/components/ergohub/case-section";
import { ingressRoutes, workloads } from "@/components/ergohub/facts";
import { code } from "@/lib/rich-text";

// The namespace drawn as it ran: the Ingress at the edge, the Deployments
// behind it and the configuration they read. Each Deployment is a row with
// its Service, its storage and its probes. In a wide panel these sit in
// columns under one header row, which is drawn only (each value keeps its
// own label for assistive technology); in a narrow one each value has its
// label beside it.
//
// Class names are written out in full so that Tailwind finds them.

function Attribute({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 @min-[52rem]:block">
      <dt className={`${eyebrowClass} pt-[3px] text-muted @min-[52rem]:sr-only`}>{label}</dt>
      <dd className="min-w-0 text-[0.8125rem] leading-5 text-ink">{children}</dd>
    </div>
  );
}

const rowGrid =
  "@min-[52rem]:grid @min-[52rem]:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] @min-[52rem]:gap-x-8";
const valueGrid = "grid gap-y-2 @min-[52rem]:grid-cols-3 @min-[52rem]:gap-x-6";

export function Kubernetes() {
  const t = useTranslations("ergohubPage.kubernetes");
  const f = useTranslations("ergohubPage.kubernetes.figure");
  const notes = f.raw("ingressNotes") as string[];

  return (
    <ErgoSection id="kubernetes">
      <p className={lead}>{t.rich("lead", { code })}</p>

      <figure aria-labelledby="cluster-caption" className="mt-12 md:mt-14">
        <figcaption id="cluster-caption" className={`${eyebrowClass} text-muted`}>
          {t.rich("figure.caption", {
            name: (chunks) => <span className="normal-case">{chunks}</span>,
          })}
        </figcaption>

        <div className="@container mt-6 border border-border bg-surface px-[18px] py-6 md:mt-8 md:p-7">
          <div className="grid gap-y-5 border border-diagram/80 p-4 @min-[52rem]:grid-cols-2 @min-[52rem]:gap-x-8 @min-[52rem]:p-5">
            <div>
              <p className={`${eyebrowClass} text-ink`}>{f("ingress")}</p>
              <ul className="mt-2 space-y-1 text-[0.8125rem] leading-5 text-muted">
                {notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className={`${eyebrowClass} text-muted`}>{f("routesLabel")}</p>
              <ul lang="en" className="mt-2 space-y-1 font-mono text-[0.75rem] leading-5 text-ink">
                {ingressRoutes.map((route) => (
                  <li key={route.path} className="flex flex-wrap gap-x-2">
                    <span className="w-8 shrink-0">{route.path}</span>
                    {/* Drawn: Plex Mono has no U+2192 in its web subset. */}
                    <ArrowRightIcon size={12} className="shrink-0 self-center text-muted" />
                    <span>
                      {route.service}:{route.port}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[0.75rem] leading-[1.125rem] text-pretty text-muted">{f("hosts")}</p>
            </div>
          </div>

          <span aria-hidden="true" className="ml-6 block h-6 border-l border-steel/55" />

          <p className={`${eyebrowClass} text-ink`}>{f("workloadsLabel")}</p>

          <div
            aria-hidden="true"
            className={`mt-3 hidden ${rowGrid}`}
          >
            <span className={`${eyebrowClass} text-muted`}>{f("deployment")}</span>
            <span className={`${valueGrid} ${eyebrowClass} text-muted`}>
              <span>{f("service")}</span>
              <span>{f("storage")}</span>
              <span>{f("probes")}</span>
            </span>
          </div>

          <ul className="mt-3 border-t border-border @min-[52rem]:mt-2">
            {workloads.map((workload) => (
              <li key={workload.name} className={`border-b border-border py-3.5 ${rowGrid}`}>
                <div>
                  <p lang="en" className="font-mono text-[0.8125rem] leading-5 text-ink">
                    {workload.name}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] leading-[1.125rem] text-muted">
                    {f(`workloads.${workload.name}`)}
                  </p>
                </div>
                <dl className={`mt-3 ${valueGrid} @min-[52rem]:mt-0`}>
                  <Attribute label={f("service")}>
                    <span lang="en" className="block font-mono text-[0.75rem] break-words">
                      {workload.service}
                    </span>
                    <span lang="en" className="block font-mono text-[0.75rem] text-muted">
                      {workload.ports
                        .split(", ")
                        .map((port) => `:${port}`)
                        .join(" ")}
                    </span>
                    {workload.nodePort && (
                      <span lang="en" className="block font-mono text-[0.75rem] text-muted">
                        {f("nodePort")}
                      </span>
                    )}
                  </Attribute>
                  <Attribute label={f("storage")}>
                    {workload.volume ? (
                      f("volume", { size: workload.volume })
                    ) : (
                      <span className="text-muted">{f("none")}</span>
                    )}
                  </Attribute>
                  <Attribute label={f("probes")}>
                    {workload.probes.length > 0 ? (
                      <span className="font-mono text-[0.75rem]">
                        {workload.probes.map((kind) => f(`probeKinds.${kind}`)).join(", ")}
                      </span>
                    ) : (
                      <span className="text-muted">{f("none")}</span>
                    )}
                  </Attribute>
                </dl>
              </li>
            ))}
          </ul>

          <div className="mt-6 border border-dashed border-steel/55 px-4 py-3">
            <p className={`${eyebrowClass} text-ink`}>{f("config")}</p>
            <p className="mt-1 text-[0.8125rem] leading-5 text-pretty text-muted">
              {f.rich("configNote", { code })}
            </p>
          </div>
        </div>
      </figure>

      <div className={`${prose} mt-12 space-y-5 md:mt-14`}>
        <p>{t("p1")}</p>
        <p>{t.rich("p2", { code })}</p>
        <p>{t("p3")}</p>
      </div>
    </ErgoSection>
  );
}
