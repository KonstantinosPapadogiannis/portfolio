import { useTranslations } from "next-intl";
import { eyebrowClass } from "@/components/ui/eyebrow";
import {
  chaincodes,
  institutions,
  mspIds,
  type Organisation,
} from "@/components/thesis/consortium";

// The detailed counterpart of the homepage diagram, from the thesis
// repository: the seven organisations with their MSPs and roles, the one
// channel, the three chaincodes with their world state and the five private
// data collections with their members.
//
// Text and CSS rules rather than a drawing, so it reads in order and
// reflows with the panel. Two compositions, chosen by the panel width:
//   wide    the farmer's browser and the six organisations in a column,
//           each joined by a line to the channel block on the right
//   narrow  everything stacked, the organisations on a spine that runs
//           down into the channel block
//
// Connector colour: border-steel/55, as on the homepage. Class names are
// written out in full so that Tailwind finds them.

function OrganisationRow({ id }: { id: Organisation }) {
  const t = useTranslations("thesisPage.architecture.figure");
  const tOrg = useTranslations("thesis.architecture.organisations");
  const farmer = id === "farmer";

  return (
    <li
      className={`relative py-2.5 @min-[52rem]:grid @min-[52rem]:grid-cols-[10.5rem_minmax(0,15rem)_minmax(2rem,1fr)] @min-[52rem]:items-start ${
        farmer
          ? ""
          : "before:absolute before:top-5 before:-left-5 before:w-3 before:border-t before:border-steel/55 @min-[52rem]:before:hidden"
      }`}
    >
      <p className="flex flex-wrap items-baseline gap-x-2 @min-[52rem]:block">
        <span className="text-[14px] leading-5 font-medium text-ink @min-[52rem]:block">
          {tOrg(`${id}.name`)}
        </span>
        <span className="font-mono text-[11px] leading-4 text-muted @min-[52rem]:block">
          {mspIds[id]}
        </span>
      </p>
      <p className="mt-0.5 @min-[52rem]:mt-0">
        <span className="block text-[13px] leading-5 text-ink">{t(`roles.${id}`)}</span>
        {t.has(`notes.${id}`) && (
          <span className="block text-[12px] leading-4 text-muted">{t(`notes.${id}`)}</span>
        )}
      </p>
      {/* Level with the middle of the name, however many lines the role
          takes. The farmer's line crosses the box padding (16px), its border
          and the 40px gap to reach the channel. */}
      <span
        aria-hidden="true"
        className={`hidden border-t border-steel/55 @min-[52rem]:mt-2.5 @min-[52rem]:ml-4 @min-[52rem]:block ${
          farmer ? "border-dashed @min-[52rem]:-mr-[57px]" : ""
        }`}
      />
    </li>
  );
}

function GroupLabel({ name, note }: { name: string; note: string }) {
  return (
    <>
      <p className={`${eyebrowClass} text-muted`}>{name}</p>
      <p className="mt-1 text-[12px] leading-4 text-muted">{note}</p>
    </>
  );
}

export function ArchitectureDiagram() {
  const t = useTranslations("thesisPage.architecture.figure");
  const tOrg = useTranslations("thesis.architecture.organisations");

  return (
    <figure aria-labelledby="system-architecture-caption">
      {/* The channel name keeps its own case in the upper-case caption. */}
      <figcaption id="system-architecture-caption" className={`${eyebrowClass} text-muted`}>
        {t.rich("caption", {
          name: (chunks) => <span className="normal-case">{chunks}</span>,
        })}
      </figcaption>

      <div className="@container mt-6 border border-border bg-surface px-[18px] py-6 md:mt-8 md:p-7">
        <div className="grid @min-[52rem]:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div>
            {/* The farmer's device is the trust boundary: the key never
                leaves it. Narrow: a dashed stub joins the spine below, 12px
                from the left edge like the spine. */}
            <div className="relative border border-dashed border-steel px-4 pt-3.5 pb-1 after:absolute after:top-full after:left-[11px] after:h-[25px] after:border-l after:border-dashed after:border-steel/55 @min-[52rem]:mr-10 @min-[52rem]:after:hidden">
              <GroupLabel name={t("farmerGroup")} note={t("farmerGroupNote")} />
              <ul className="mt-1">
                <OrganisationRow id="farmer" />
              </ul>
            </div>

            <div className="relative mt-6 pl-8 before:absolute before:top-0 before:-bottom-6 before:left-3 before:border-l before:border-steel/55 @min-[52rem]:pl-[17px] @min-[52rem]:before:hidden">
              <GroupLabel name={t("staffGroup")} note={t("staffGroupNote")} />
              <ul className="mt-1">
                {institutions.map((id) => (
                  <OrganisationRow key={id} id={id} />
                ))}
              </ul>
            </div>
          </div>

          {/* The channel: one ledger, three chaincodes, each with its own
              world state and, for two of them, private data collections. */}
          <div className="mt-6 border border-diagram/80 px-4 py-4 @min-[52rem]:mt-0 @min-[52rem]:self-stretch @min-[52rem]:px-5">
            <p className="font-mono text-[13px] leading-[18px] text-ink">subsidychannel</p>
            <p className="text-[12px] leading-4 text-muted">{t("ledger")}</p>

            <p id="architecture-chaincodes" className={`${eyebrowClass} mt-5 text-muted`}>
              {t("chaincodesLabel")}
            </p>
            <ul aria-labelledby="architecture-chaincodes" className="mt-2 border-t border-border">
              {chaincodes.map(({ name, contracts, collections }) => (
                <li key={name} className="border-b border-border py-2.5">
                  <p className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[12px] leading-4 text-ink">{name}</span>
                    <span className="shrink-0 text-[12px] leading-4 text-muted">
                      {t("contracts", { count: contracts })}
                    </span>
                  </p>
                  <div className="mt-1.5 pl-[15px]">
                    <p className="text-[12px] leading-4 text-muted">{t("worldState")}</p>
                    {collections.length > 0 && (
                      <ul aria-label={t("collectionsLabel")} className="mt-1.5 space-y-1.5">
                        {collections.map(({ name: collection, members }) => (
                          <li key={collection} className="relative pl-[15px]">
                            <span
                              aria-hidden="true"
                              className="absolute top-[5px] left-0 size-[7px] bg-steel/80"
                            />
                            <span className="block font-mono text-[11px] leading-4 text-ink">
                              {collection}
                            </span>
                            <span className="block text-[12px] leading-4 text-muted">
                              <span className="sr-only">{t("members")}: </span>
                              {members.map((member) => tOrg(`${member}.name`)).join(", ")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-[12px] leading-4 text-muted">{t("namespaceNote")}</p>
          </div>
        </div>

        <ul
          aria-label={t("legendLabel")}
          className="mt-6 flex flex-col gap-y-1.5 border-t border-border pt-4 text-[12px] leading-4 text-muted @min-[52rem]:flex-row @min-[52rem]:flex-wrap @min-[52rem]:gap-x-7"
        >
          <li className="flex items-center gap-2.5">
            <span aria-hidden="true" className="w-6 shrink-0 border-t border-steel/55" />
            {t("legendStaff")}
          </li>
          <li className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="w-6 shrink-0 border-t border-dashed border-steel/55"
            />
            {t("legendFarmer")}
          </li>
          <li className="flex items-center gap-2.5">
            <span aria-hidden="true" className="flex w-6 shrink-0 justify-center">
              <span className="size-3.5 border border-dashed border-steel" />
            </span>
            {t("legendBoundary")}
          </li>
        </ul>
      </div>
    </figure>
  );
}
