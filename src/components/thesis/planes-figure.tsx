import { useTranslations } from "next-intl";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { institutions } from "@/components/thesis/consortium";

// The three planes of the platform, one column per organisation that runs
// infrastructure: its registry, its connector and its place in the
// consortium. The EU Observer has a connector but no registry; farmers run
// nothing and are left out. From PORTFOLIO_CASE_STUDY.md and the connector
// code in the thesis repository (HTTP to the registry, gRPC to the peer).
//
// Wide panels set the planes as rows of a seven-column grid, the labels in
// the first column. Narrow panels stack each plane with its boxes two by two.

const box = "border px-3 py-2.5 text-[13px] leading-[18px]";
const link = "h-7 w-px justify-self-center bg-steel/55";

function PlaneLabel({ name, note }: { name: string; note: string }) {
  return (
    <div className="@min-[44rem]:pr-3">
      <p className="text-[14px] leading-5 font-medium text-ink">{name}</p>
      <p className="text-[12px] leading-4 text-muted">{note}</p>
    </div>
  );
}

// Between two planes: one line and the protocol on a narrow panel, a line
// under every column on a wide one.
function PlaneLink({ protocol, skip }: { protocol: string; skip?: string }) {
  const label = "font-mono text-[11px] leading-4 text-muted";
  return (
    <>
      <div className="flex h-10 items-stretch gap-2.5 pl-6 @min-[44rem]:hidden">
        <span aria-hidden="true" className="w-px bg-steel/55" />
        <span className={`self-center ${label}`}>{protocol}</span>
      </div>
      <div className="hidden @min-[44rem]:col-span-7 @min-[44rem]:grid @min-[44rem]:grid-cols-subgrid">
        <span className={`self-center ${label}`}>{protocol}</span>
        {institutions.map((key) => (
          <span key={key} aria-hidden="true" className={key === skip ? "" : link} />
        ))}
      </div>
    </>
  );
}

export function PlanesFigure() {
  const t = useTranslations("thesisPage.design.figure");
  const tOrg = useTranslations("thesis.architecture.organisations");
  const tDesign = useTranslations("thesisPage.design");

  return (
    <figure aria-labelledby="planes-caption">
      <figcaption id="planes-caption" className={`${eyebrowClass} text-muted`}>
        {t("caption")}
      </figcaption>

      <div className="@container mt-6 border border-border bg-surface px-[18px] py-6 md:mt-8 md:p-7">
        <div className="@min-[44rem]:grid @min-[44rem]:grid-cols-[12rem_repeat(6,minmax(0,1fr))] @min-[44rem]:gap-x-3">
          <PlaneLabel name={t("external.name")} note={t("external.note")} />
          <ul className="mt-3 grid grid-cols-2 gap-2 @min-[44rem]:col-span-6 @min-[44rem]:mt-0 @min-[44rem]:grid-cols-subgrid @min-[44rem]:gap-x-3">
            {institutions.map((key) => {
              const none = key === "observer";
              return (
                <li
                  key={key}
                  className={`${box} ${none ? "border-dashed border-border text-muted" : "border-border text-ink"}`}
                >
                  <span className="block text-[12px] leading-4 text-muted @min-[44rem]:sr-only">
                    {tOrg(`${key}.name`)}
                  </span>
                  <span className="block">{t(`registries.${key}`)}</span>
                </li>
              );
            })}
          </ul>

          <PlaneLink protocol="HTTP" skip="observer" />

          <PlaneLabel name={t("connectors.name")} note={t("connectors.note")} />
          <ul className="mt-3 grid grid-cols-2 gap-2 @min-[44rem]:col-span-6 @min-[44rem]:mt-0 @min-[44rem]:grid-cols-subgrid @min-[44rem]:gap-x-3">
            {institutions.map((key) => (
              <li key={key} className={`${box} border-diagram/70 font-medium text-ink`}>
                {tOrg(`${key}.name`)}
              </li>
            ))}
          </ul>

          <PlaneLink protocol="gRPC" />

          <PlaneLabel name={t("consortium.name")} note={t("consortium.note")} />
          <div className="mt-3 border border-diagram/80 px-4 py-3 @min-[44rem]:col-span-6 @min-[44rem]:mt-0">
            <p className="font-mono text-[13px] leading-[18px] text-ink">subsidychannel</p>
            <p className="text-[12px] leading-4 text-muted">{t("channel")}</p>
          </div>
        </div>

        <p className="mt-6 max-w-[720px] border-t border-border pt-4 text-[13px] leading-5 text-ink/80">
          {tDesign("rule")}
        </p>
      </div>
    </figure>
  );
}
