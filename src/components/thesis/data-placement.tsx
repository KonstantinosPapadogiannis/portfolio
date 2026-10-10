import { useTranslations } from "next-intl";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { ProjectGallery } from "@/components/ui/project-gallery";
import { organisations, type Organisation } from "@/components/thesis/consortium";

// Where each class of data lives, organisation by organisation: four views
// of the same consortium, from PORTFOLIO_CASE_STUDY.md and the collection
// definitions in the thesis repository. The privacy text states the same
// facts, so nothing here exists only inside the gallery.

type State = "holds" | "reference" | "none";

const views = ["workflow", "records", "iban", "diploma"] as const;
type View = (typeof views)[number];

const placement: Record<View, Record<Organisation, State>> = {
  // Every peer keeps the channel ledger; farmers have no peer.
  workflow: {
    farmer: "none",
    opekepe: "holds",
    aade: "holds",
    region: "holds",
    ministry: "holds",
    bank: "holds",
    observer: "holds",
  },
  // Private data collections: members keep the value, the other peers the
  // hash that Fabric writes to the ledger.
  records: {
    farmer: "none",
    opekepe: "holds",
    aade: "holds",
    region: "holds",
    ministry: "reference",
    bank: "reference",
    observer: "reference",
  },
  // The IBAN stays in the bank's own registry.
  iban: {
    farmer: "none",
    opekepe: "none",
    aade: "none",
    region: "none",
    ministry: "none",
    bank: "holds",
    observer: "none",
  },
  // Two IPFS/Kubo nodes keep the file; the ledger keeps its CID.
  diploma: {
    farmer: "none",
    opekepe: "holds",
    aade: "reference",
    region: "reference",
    ministry: "holds",
    bank: "reference",
    observer: "reference",
  },
};

// Shape, not only colour: filled, outlined or a dash. Centred in a box as
// tall as the line of text beside it.
function PlacementMarker({ state, height }: { state: State; height: "h-4" | "h-5" }) {
  return (
    <span aria-hidden="true" className={`flex w-[9px] shrink-0 items-center ${height}`}>
      <span
        className={
          state === "holds"
            ? "size-[9px] bg-steel"
            : state === "reference"
              ? "size-[9px] border border-steel"
              : "w-full border-t border-muted"
        }
      />
    </span>
  );
}

function PlacementView({ view }: { view: View }) {
  const t = useTranslations("thesisPage.privacy.gallery");
  const tOrg = useTranslations("thesis.architecture.organisations");

  return (
    <div className="@container border border-border bg-surface px-[18px] py-6 md:p-7">
      <div className="grid gap-y-4 @min-[48rem]:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] @min-[48rem]:gap-x-10">
        <div>
          <h4 className="text-[18px] leading-[26px] font-medium text-ink">
            {t(`slides.${view}.title`)}
          </h4>
          <p className="mt-3">
            <span className={`${eyebrowClass} block text-muted`}>{t("storeLabel")}</span>
            <span className="mt-1 block text-[14px] leading-[22px] text-ink">
              {t(`slides.${view}.store`)}
            </span>
          </p>
        </div>
        <p className="text-[15px] leading-6 text-ink/80">{t(`slides.${view}.body`)}</p>
      </div>

      <dl className="mt-6 border-t border-border @min-[48rem]:grid @min-[48rem]:grid-cols-7 @min-[48rem]:gap-x-4 @min-[48rem]:pt-4">
        {organisations.map((org) => {
          const state = placement[view][org];
          return (
            <div
              key={org}
              className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-3 border-b border-border py-2 @min-[48rem]:block @min-[48rem]:border-b-0 @min-[48rem]:py-0"
            >
              <dt className="text-[13px] leading-5 font-medium text-ink">
                {tOrg(`${org}.name`)}
              </dt>
              <dd
                className={`flex gap-2 text-[13px] leading-5 @min-[48rem]:mt-1.5 ${
                  state === "holds" ? "text-ink" : "text-muted"
                }`}
              >
                <PlacementMarker state={state} height="h-5" />
                <span>{t(`slides.${view}.cells.${org}`)}</span>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export function DataPlacement() {
  const t = useTranslations("thesisPage.privacy.gallery");

  return (
    <div>
      <ProjectGallery
        id="data-placement"
        title={t("label")}
        slides={views.map((view) => ({
          id: view,
          title: t(`slides.${view}.title`),
          content: <PlacementView view={view} />,
        }))}
      />
      <ul
        aria-label={t("legendLabel")}
        className="mt-4 flex flex-col gap-y-1.5 text-[12px] leading-4 text-muted sm:flex-row sm:flex-wrap sm:gap-x-7"
      >
        {(["holds", "reference", "none"] as const).map((state) => (
          <li key={state} className="flex gap-2.5">
            <PlacementMarker state={state} height="h-4" />
            {t(`states.${state}`)}
          </li>
        ))}
      </ul>
    </div>
  );
}
