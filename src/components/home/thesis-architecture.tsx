import { useTranslations } from "next-intl";
import { eyebrowClass } from "@/components/ui/eyebrow";

// Simplified from the thesis source diagram (assets/thesis) and
// PORTFOLIO_CASE_STUDY.md: seven organisations on one Fabric channel, three
// chaincodes, one world state per chaincode namespace and five private data
// collections. Farmers hold their own key in a browser wallet; staff of the
// other six organisations sign in through Keycloak.
//
// Built from text and CSS rules rather than a drawing, so it reads in order
// for screen readers and reflows with the panel. Two compositions, chosen by
// the width of the panel rather than of the screen:
//   wide    organisations in a column, joined by a bus to the channel block
//   narrow  organisations on a spine that runs down into the channel block

const organisations = [
  "farmer",
  "opekepe",
  "aade",
  "region",
  "ministry",
  "bank",
  "observer",
] as const;

const chaincodes = [
  "policy-chaincode",
  "entitlement-chaincode",
  "subsidy-chaincode",
] as const;

const collections = 5;

// Connector colour. Rows are 28px tall, so the bus and the spine start and
// end 14px (top-3.5) inside the list, on the centre line of the outer rows.
const line = "border-steel/55";

export function ThesisArchitecture() {
  const t = useTranslations("thesis.architecture");

  return (
    <figure aria-labelledby="architecture-caption">
      <figcaption id="architecture-caption" className={`${eyebrowClass} text-muted`}>
        {t("caption")}
      </figcaption>

      <div className="@container mt-[34px] border border-border bg-surface px-[18px] py-6 md:p-7">
        <div className="grid gap-y-5 @min-[34rem]:grid-cols-[minmax(0,1fr)_minmax(0,14.5rem)] @min-[34rem]:gap-x-6">
          {/* Narrow: the spine runs from the first row through the gap into
              the channel block. Wide: a bus on the right edge of the list. */}
          <ul
            aria-label={t("organisationsLabel")}
            className="relative flex flex-col justify-between before:absolute before:top-3.5 before:-bottom-5 before:left-0 before:w-px before:bg-steel/55 @min-[34rem]:before:inset-y-3.5 @min-[34rem]:before:right-0 @min-[34rem]:before:left-auto"
          >
            {organisations.map((key) => {
              const isFarmer = key === "farmer";
              const stroke = `${line} ${isFarmer ? "border-dashed" : ""}`;
              return (
                <li key={key} className="flex min-h-7 items-center @max-[14rem]:flex-wrap">
                  <span
                    aria-hidden="true"
                    className={`mr-2 w-3 shrink-0 border-t ${stroke} @min-[34rem]:hidden`}
                  />
                  <span className="w-[7.75rem] shrink-0 text-[0.875rem] leading-5 font-medium text-ink">
                    {t(`organisations.${key}.name`)}
                  </span>
                  {/* Under the name when the figure is narrower than 14rem,
                      which only a larger default text size makes: at 16px
                      the narrowest phone leaves it 14.9rem. */}
                  <span className="text-[0.8125rem] leading-5 text-muted @max-[14rem]:basis-full @max-[14rem]:pl-5">
                    {t(`organisations.${key}.role`)}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`ml-3 hidden min-w-4 flex-1 border-t ${stroke} @min-[34rem]:block`}
                  />
                </li>
              );
            })}
          </ul>

          {/* The channel: one ledger shared by all seven. */}
          <div
            className="relative self-center border border-diagram/80 px-4 py-3.5 before:absolute before:top-1/2 before:right-full before:hidden before:w-6 before:border-t before:border-steel/55 @min-[34rem]:before:block"
          >
            <p className="font-mono text-[0.8125rem] leading-[1.125rem] text-ink">subsidychannel</p>
            <p className="text-[0.75rem] leading-4 text-muted">{t("ledger")}</p>

            <ul aria-label={t("chaincodesLabel")} className="mt-3 border-t border-border">
              {chaincodes.map((name) => (
                <li
                  key={name}
                  className="border-b border-border py-[5px] font-mono text-[0.75rem] leading-4 text-ink"
                >
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[0.75rem] leading-4 text-muted">{t("worldState")}</p>

            <p className="mt-3 flex items-center gap-2 text-[0.75rem] leading-4 text-muted">
              <span aria-hidden="true" className="flex gap-[3px]">
                {Array.from({ length: collections }, (_, i) => (
                  <span key={i} className="size-[7px] bg-steel/80" />
                ))}
              </span>
              {t("privateData", { count: collections })}
            </p>
          </div>
        </div>

        <ul
          aria-label={t("legendLabel")}
          className="mt-6 flex flex-col gap-y-1.5 border-t border-border pt-4 text-[0.75rem] leading-4 text-muted @min-[34rem]:flex-row @min-[34rem]:gap-x-7"
        >
          <li className="flex items-center gap-2.5">
            <span aria-hidden="true" className={`w-6 shrink-0 border-t ${line}`} />
            {t("legendStaff")}
          </li>
          <li className="flex items-center gap-2.5">
            <span aria-hidden="true" className={`w-6 shrink-0 border-t border-dashed ${line}`} />
            {t("legendFarmer")}
          </li>
        </ul>
      </div>
    </figure>
  );
}
