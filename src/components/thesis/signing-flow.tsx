import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/components/icons";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { Separator } from "@/components/ui/separator";
import { nb } from "@/lib/rich-text";

// The offline-signing protocol of the farmer wallet, from
// PORTFOLIO_CASE_STUDY.md and the wallet code in the thesis repository: two
// rounds, nine steps, four lanes.
//
// The wallet is drawn first, on the left, so that the trust boundary is the
// first line across the flow: everything to its right may carry bytes but
// never holds the key. The portal lane stays narrow; it only relays.
//
// Each step is a list item placed in its lane. On a wide panel, lines join
// consecutive steps: straight down within a lane, or across the portal, where
// a dot marks the relay, when the next step runs in another lane. On a
// narrow panel the steps follow one spine and each names its lane.

type Lane = "wallet" | "portal" | "backend" | "fabric";
type StepLane = "wallet" | "backend";
type Kind = "verify" | "sign";

type Step = {
  n: number;
  lane: StepLane;
  kind?: Kind;
  // Steps that hand the transaction to Fabric: an arrow into the Fabric lane.
  fabric?: boolean;
};

const lanes: readonly Lane[] = ["wallet", "portal", "backend", "fabric"];

// Lane widths 1.3 : 0.6 : 1.3 : 0.8, as percentages of the flow width.
const laneStart: Record<Lane, number> = { wallet: 0, portal: 32.5, backend: 47.5, fabric: 80 };

// Written out so that Tailwind finds the class names.
const laneBox: Record<StepLane, string> = {
  wallet: "@min-[52rem]:w-[32.5%]",
  backend: "@min-[52rem]:ml-[47.5%] @min-[52rem]:w-[32.5%]",
};

const rounds: readonly { id: "proposal" | "transaction"; steps: readonly Step[] }[] = [
  {
    id: "proposal",
    steps: [
      { n: 1, lane: "backend" },
      { n: 2, lane: "wallet" },
      { n: 3, lane: "wallet", kind: "verify" },
      { n: 4, lane: "wallet", kind: "sign" },
      { n: 5, lane: "backend", fabric: true },
    ],
  },
  {
    id: "transaction",
    steps: [
      { n: 6, lane: "backend" },
      { n: 7, lane: "wallet", kind: "verify" },
      { n: 8, lane: "wallet", kind: "sign" },
      { n: 9, lane: "backend", fabric: true },
    ],
  },
];

// Verification is outlined in steel, a signature filled in navy; the other
// steps are neutral. The kind is also written above the step title.
const badgeClass: Record<Kind | "neutral", string> = {
  neutral: "border-border text-ink",
  verify: "border-steel text-steel",
  sign: "border-navy bg-navy text-on-navy",
};

const kindClass: Record<Kind, string> = {
  verify: "text-steel",
  sign: "text-ink",
};

const stroke = "bg-steel/55";

// The 22px badge sits 16px into its lane, so lines run 27px from the lane
// start: 26.5px to the left edge of a 1px line.
const lineX = (lane: Lane) => `calc(${laneStart[lane]}% + 26.5px)`;

// A small chevron at the lower end of a vertical line, centred on it.
function Arrowhead({ direction = "down" }: { direction?: "down" | "right" }) {
  return direction === "down" ? (
    <svg
      aria-hidden="true"
      width="9"
      height="6"
      viewBox="0 0 9 6"
      className="absolute -bottom-px -left-1 text-steel"
    >
      <path d="M.5.5 4.5 5 8.5.5" fill="none" stroke="currentColor" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      width="6"
      height="9"
      viewBox="0 0 6 9"
      className="absolute -top-1 -right-px text-steel"
    >
      <path d="M.5.5 5 4.5.5 8.5" fill="none" stroke="currentColor" />
    </svg>
  );
}

// Wide panel: the line from one step to the next.
function WideConnector({ from, to }: { from: StepLane; to: StepLane }) {
  const shown = "absolute hidden @min-[52rem]:block";

  if (from === to) {
    return (
      <span
        aria-hidden="true"
        className={`${shown} top-[26px] bottom-1 w-px ${stroke}`}
        style={{ left: lineX(from) }}
      >
        <Arrowhead />
      </span>
    );
  }

  const a = laneStart[from];
  const b = laneStart[to];
  return (
    <>
      <span
        aria-hidden="true"
        className={`${shown} top-[26px] bottom-[18px] w-px ${stroke}`}
        style={{ left: lineX(from) }}
      />
      <span
        aria-hidden="true"
        className={`${shown} bottom-[18px] h-px ${stroke}`}
        style={{ left: lineX(a < b ? from : to), width: `calc(${Math.abs(b - a)}% + 1px)` }}
      />
      {/* The portal relays the bytes: a dot in the middle of its lane. */}
      <span
        aria-hidden="true"
        className={`${shown} bottom-[15px] size-[7px] rounded-full bg-steel`}
        style={{ left: "calc(40% - 3px)" }}
      />
      <span
        aria-hidden="true"
        className={`${shown} bottom-1 h-[14px] w-px ${stroke}`}
        style={{ left: lineX(to) }}
      >
        <Arrowhead />
      </span>
    </>
  );
}

// Narrow panel: one spine, with the relay written in the gap of a handoff.
function NarrowConnector({ handoff, relay }: { handoff: boolean; relay: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={`absolute top-[26px] bottom-1 left-[10.5px] w-px ${stroke} @min-[52rem]:hidden`}
      >
        <Arrowhead />
      </span>
      {handoff && (
        <span
          aria-hidden="true"
          className="absolute bottom-3.5 left-[34px] text-[12px] leading-4 text-muted @min-[52rem]:hidden"
        >
          {relay}
        </span>
      )}
    </>
  );
}

function FlowStep({ step, next }: { step: Step; next?: Step }) {
  const t = useTranslations("thesisPage.signing.flow");
  const { n, lane, kind, fabric } = step;
  const handoff = next !== undefined && next.lane !== lane;

  return (
    <li
      className={`relative ${
        next === undefined ? "pb-2" : handoff ? "pb-12 @min-[52rem]:pb-9" : "pb-6 @min-[52rem]:pb-9"
      }`}
    >
      {/* The right padding keeps the text clear of the next lane divider,
          and of the arrow into Fabric. */}
      <div
        className={`flex gap-3 @min-[52rem]:pl-4 ${laneBox[lane]} ${fabric ? "@min-[52rem]:pr-10" : "@min-[52rem]:pr-4"}`}
      >
        <span
          className={`flex size-[22px] shrink-0 items-center justify-center border font-mono text-[11px] leading-none ${badgeClass[kind ?? "neutral"]}`}
        >
          {n}
        </span>
        <div className="min-w-0">
          {kind ? (
            <p className={`${eyebrowClass} mb-1 @min-[52rem]:mb-0 @min-[52rem]:leading-[22px]`}>
              <span className="text-muted @min-[52rem]:sr-only">{t(`lanes.${lane}.name`)}</span>
              <Separator className="pr-[0.5px] pl-2 text-muted @min-[52rem]:hidden" />
              <span className={kindClass[kind]}>{t(`kinds.${kind}`)}</span>
            </p>
          ) : (
            <p className={`${eyebrowClass} mb-1 text-muted @min-[52rem]:sr-only`}>
              {t(`lanes.${lane}.name`)}
            </p>
          )}
          <p className="text-[15px] leading-[22px] font-medium text-ink">
            {t(`steps.${n}.title`)}
          </p>
          <p className="mt-0.5 text-[13px] leading-5 text-muted">
            {t.rich(`steps.${n}.detail`, { nb })}
          </p>
        </div>
      </div>

      {fabric && (
        <>
          <span
            aria-hidden="true"
            className={`absolute top-[11px] hidden h-px w-[38px] @min-[52rem]:block ${stroke}`}
            style={{ left: "calc(80% - 32px)" }}
          >
            <Arrowhead direction="right" />
          </span>
          <span
            aria-hidden="true"
            className="absolute top-2 hidden size-[7px] border border-diagram @min-[52rem]:block"
            style={{ left: "calc(80% + 7px)" }}
          />
          <p className="mt-2 flex items-center gap-2 pl-[34px] text-[12px] leading-4 text-muted @min-[52rem]:absolute @min-[52rem]:top-[3px] @min-[52rem]:left-[calc(80%_+_22px)] @min-[52rem]:mt-0 @min-[52rem]:pl-0">
            <ArrowRightIcon size={12} className="shrink-0 @min-[52rem]:hidden" />
            {t(`fabricNotes.${n}`)}
          </p>
        </>
      )}

      {next && (
        <>
          <WideConnector from={lane} to={next.lane} />
          <NarrowConnector handoff={handoff} relay={t("relay")} />
        </>
      )}
    </li>
  );
}

export function SigningFlow() {
  const t = useTranslations("thesisPage.signing.flow");

  return (
    <figure aria-labelledby="signing-flow-caption" aria-describedby="signing-flow-description">
      <figcaption id="signing-flow-caption" className={`${eyebrowClass} text-muted`}>
        {t("caption")}
      </figcaption>
      <p id="signing-flow-description" className="sr-only">
        {t("description")}
      </p>

      <div className="@container mt-6 border border-border bg-surface px-[18px] py-6 md:mt-8 md:p-7">
        <div className="relative">
          {/* Lane dividers. The first is the trust boundary. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[32.5%] hidden border-l border-dashed border-steel @min-[52rem]:block"
          />
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[47.5%] hidden border-l border-border @min-[52rem]:block"
          />
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[80%] hidden border-l border-border @min-[52rem]:block"
          />

          <ul
            aria-label={t("lanesLabel")}
            className="hidden border-b border-border pb-4 @min-[52rem]:grid @min-[52rem]:grid-cols-[minmax(0,1.3fr)_minmax(0,0.6fr)_minmax(0,1.3fr)_minmax(0,0.8fr)]"
          >
            {lanes.map((lane) => (
              <li key={lane} className="pr-3 pl-4">
                <span className="block text-[13px] leading-5 font-medium text-ink">
                  {t(`lanes.${lane}.name`)}
                </span>
                <span className="block text-[12px] leading-4 text-balance text-muted">
                  {t(`lanes.${lane}.note`)}
                </span>
              </li>
            ))}
          </ul>

          {rounds.map(({ id, steps }, index) => (
            <div
              key={id}
              className={index === 0 ? "@min-[52rem]:pt-5" : "mt-6 border-t border-border pt-5 @min-[52rem]:mt-0"}
            >
              <p
                id={`signing-round-${id}`}
                className={`${eyebrowClass} text-muted @min-[52rem]:pl-4`}
              >
                {t(`rounds.${id}`)}
              </p>
              <ol start={steps[0].n} aria-labelledby={`signing-round-${id}`} className="mt-5">
                {steps.map((step, i) => (
                  <FlowStep key={step.n} step={step} next={steps[i + 1]} />
                ))}
              </ol>
            </div>
          ))}
        </div>

        <ul
          aria-label={t("legendLabel")}
          className="mt-6 flex flex-col gap-y-2 border-t border-border pt-4 text-[12px] leading-4 text-muted @min-[52rem]:flex-row @min-[52rem]:flex-wrap @min-[52rem]:gap-x-7"
        >
          <li className="flex items-center gap-2.5">
            <span aria-hidden="true" className="size-3 shrink-0 border border-steel" />
            {t("kinds.verify")}
          </li>
          <li className="flex items-center gap-2.5">
            <span aria-hidden="true" className="size-3 shrink-0 border border-navy bg-navy" />
            {t("kinds.sign")}
          </li>
          <li className="hidden items-center gap-2.5 @min-[52rem]:flex">
            <span aria-hidden="true" className="relative flex w-6 shrink-0 items-center">
              <span className={`h-px w-full ${stroke}`} />
              <span className="absolute left-[8.5px] size-[7px] rounded-full bg-steel" />
            </span>
            {t("relay")}
          </li>
          <li className="hidden items-center gap-2.5 @min-[52rem]:flex">
            <span aria-hidden="true" className="flex h-4 w-3 shrink-0 justify-center">
              <span className="border-l border-dashed border-steel" />
            </span>
            {t("boundary")}
          </li>
        </ul>
      </div>
    </figure>
  );
}
