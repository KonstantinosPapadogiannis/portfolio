import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/components/icons";
import { eyebrowClass } from "@/components/ui/eyebrow";

// The one diagram of the case study: the layers inside the Google Cloud VM,
// drawn as boxes inside boxes, from Google's network down to the two
// instances. The dashed boxes are the two things added on the host to join
// the layers; each says so to assistive technology as well. Below the
// layers, the path a packet takes out, and the path the final test took in.
//
// Interface and unit names are the same in both languages and set in Plex
// Mono, which has no Greek, so each sits in its own element. No addresses.
//
// Class names are written out in full so that Tailwind finds them.

const mono = "font-mono text-[0.8125rem] leading-5 text-ink";
const note = "mt-0.5 text-[0.8125rem] leading-5 text-pretty text-muted";

// A hop on the way out, marked as the steps of a track are (ergohub/track):
// a small steel square, and a line from it down the left edge to the next
// layer, past anything set under the hop. The square sits on the first line
// of a label (eyebrow) or of a name (13px).
const hopTop = {
  label: "before:top-[5px] [&>[data-marker]]:top-[5px]",
  name: "before:top-[7px] [&>[data-marker]]:top-[7px]",
} as const;

function Hop({ first, children }: { first: keyof typeof hopTop; children: ReactNode }) {
  return (
    <div
      className={`relative pb-5 pl-6 before:absolute before:bottom-0 before:left-[3px] before:border-l before:border-steel/55 ${hopTop[first]}`}
    >
      <span aria-hidden="true" data-marker className="absolute left-0 size-[7px] bg-steel" />
      {children}
    </div>
  );
}

// An interface of the host, with what was added to it beside it from 44rem.
function HostInterface({
  name,
  description,
  added,
  addedNote,
}: {
  name: string;
  description: string;
  added: string;
  addedNote: string;
}) {
  const t = useTranslations("openstackPage.network.figure");

  return (
    <div className="grid gap-3 @min-[44rem]:grid-cols-2 @min-[44rem]:items-start @min-[44rem]:gap-x-6">
      <div>
        <p lang="en" className={mono}>
          {name}
        </p>
        <p className={note}>{description}</p>
      </div>
      <div className="border border-dashed border-steel/55 px-3.5 py-3">
        <p className="text-[0.8125rem] leading-5 text-ink">
          <span className="sr-only">{t("addedPrefix")} </span>
          <span lang="en" className="font-mono">
            {added}
          </span>
        </p>
        <p className={note}>{addedNote}</p>
      </div>
    </div>
  );
}

function Instance({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="border border-diagram/80 bg-surface px-3 py-2.5">
      <p lang="en" className={mono}>
        {name}
      </p>
      <p className={note}>{children}</p>
    </div>
  );
}

const outbound = [
  { key: "instance" },
  { key: "router" },
  { name: "br-ex" },
  { name: "ens4" },
  { key: "google" },
] as const;

export function NetworkFigure() {
  const t = useTranslations("openstackPage.network.figure");

  return (
    <figure
      aria-labelledby="network-caption"
      aria-describedby="network-paths"
      className="mt-12 md:mt-14"
    >
      <figcaption id="network-caption" className={`${eyebrowClass} text-muted`}>
        {t("caption")}
      </figcaption>

      <div className="@container mt-6 border border-border bg-surface px-[18px] py-6 md:mt-8 md:p-7">
        <Hop first="label">
          <p className={`${eyebrowClass} text-ink`}>{t("google")}</p>
          <p className={note}>{t("googleNote")}</p>
        </Hop>

        <div className="border border-diagram/80 p-3.5 @min-[36rem]:p-5">
          <p className={`${eyebrowClass} text-ink`}>{t("vm")}</p>
          <p className={note}>{t("vmNote")}</p>

          <div className="mt-4 border-t border-border pt-4">
            <Hop first="name">
              <HostInterface
                name="ens4"
                description={t("ens4")}
                added="iptables"
                addedNote={t("iptables")}
              />
            </Hop>
            <Hop first="name">
              <HostInterface
                name="br-ex"
                description={t("brex")}
                added="brex-setup.service"
                addedNote={t("brexSetup")}
              />
            </Hop>
          </div>

          <div className="border border-steel/55 p-3 @min-[36rem]:p-4">
            <p className={`${eyebrowClass} text-ink`}>{t("openstack")}</p>
            <div className="mt-3">
              <Hop first="name">
                <p className="text-[0.8125rem] leading-5 text-ink">{t("router")}</p>
                <p className={note}>{t("routerNote")}</p>
              </Hop>
            </div>

            <div className="border border-border bg-background p-3 @min-[36rem]:p-4">
              <p className={`${eyebrowClass} text-ink`}>{t("tenant")}</p>
              <p className={note}>{t("tenantNote")}</p>
              <div className="mt-4 grid gap-3 @min-[36rem]:grid-cols-2">
                <Instance name="vm-app">{t("vmApp")}</Instance>
                <Instance name="vm-db">{t("vmDb")}</Instance>
              </div>
              <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] leading-5 text-muted">
                <span lang="en" className="font-mono text-ink">
                  vm-app
                </span>
                <ArrowRightIcon size={12} className="shrink-0" />
                <span lang="en" className="font-mono text-ink">
                  vm-db
                </span>
                <span>{t("link")}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-border pt-5">
          {/* Drawn for the eye; assistive technology hears "added" in each box. */}
          <p aria-hidden="true" className="flex items-center gap-3 text-[0.8125rem] leading-5 text-muted">
            <span className="block h-3 w-6 shrink-0 border border-dashed border-steel/55" />
            {t("added")}
          </p>

          <div id="network-paths" className="space-y-3">
            <div className="@min-[44rem]:grid @min-[44rem]:grid-cols-[6rem_minmax(0,1fr)] @min-[44rem]:gap-x-6">
              <p className={`${eyebrowClass} text-ink`}>{t("outbound")}</p>
              <ol className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] leading-5 text-ink @min-[44rem]:mt-0">
                {outbound.map((step, index) => (
                  <li key={"key" in step ? step.key : step.name} className="flex items-center gap-2">
                    {index > 0 && <ArrowRightIcon size={12} className="shrink-0 text-muted" />}
                    {"key" in step ? (
                      <span>{t(`steps.${step.key}`)}</span>
                    ) : (
                      <span lang="en" className="font-mono">
                        {step.name}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
            <div className="@min-[44rem]:grid @min-[44rem]:grid-cols-[6rem_minmax(0,1fr)] @min-[44rem]:gap-x-6">
              <p className={`${eyebrowClass} text-ink`}>{t("testing")}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-5 text-pretty text-ink @min-[44rem]:mt-0">
                {t("testPath")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
