import { useTranslations } from "next-intl";
import { eyebrowClass } from "@/components/ui/eyebrow";
import { itemBody, lead, subhead } from "@/components/thesis/case-section";
import { ErgoSection } from "@/components/ergohub/case-section";
import { Track } from "@/components/ergohub/track";

// The statuses a project passes through, as named in the API's ProjectStatus
// enum: the main path from posting to completion.
const workflow = [
  { key: "pending", status: "PENDING" },
  { key: "approved", status: "APPROVED", alternative: "DENIED" },
  { key: "inProgress", status: "IN_PROGRESS" },
  { key: "completed", status: "COMPLETED" },
] as const;

const items = ["access", "records", "mail", "tests"] as const;

export function Application() {
  const t = useTranslations("ergohubPage.application");

  return (
    <ErgoSection id="application">
      <p className={lead}>{t("lead")}</p>

      <figure aria-labelledby="workflow-caption" className="@container mt-12 md:mt-14">
        <figcaption id="workflow-caption" className={`${eyebrowClass} text-muted`}>
          {t("workflow.caption")}
        </figcaption>
        {/* Status names from the code, in Plex Mono; the word between the
            two outcomes is in the text face, which has Greek. */}
        <Track
          className="mt-6"
          steps={workflow.map((step) => ({
            key: step.key,
            name: (
              <>
                <span lang="en" className="font-mono text-[12px] font-normal">
                  {step.status}
                </span>
                {"alternative" in step && (
                  <>
                    {" "}
                    <span className="text-[13px] font-normal text-muted">
                      {t("workflow.or")}
                    </span>{" "}
                    <span lang="en" className="font-mono text-[12px] font-normal">
                      {step.alternative}
                    </span>
                  </>
                )}
              </>
            ),
            body: t(`workflow.steps.${step.key}`),
          }))}
        />
      </figure>

      <ul className="mt-12 grid gap-y-8 md:mt-14 md:grid-cols-2 md:gap-x-12 md:gap-y-10">
        {items.map((key) => (
          <li key={key} className="border-t border-border pt-4">
            <h3 className={subhead}>{t(`items.${key}.title`)}</h3>
            <p className={`${itemBody} mt-2 max-w-[520px]`}>{t(`items.${key}.body`)}</p>
          </li>
        ))}
      </ul>
    </ErgoSection>
  );
}
