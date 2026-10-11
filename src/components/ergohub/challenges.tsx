import { useTranslations } from "next-intl";
import { itemBody, lead, subhead } from "@/components/thesis/case-section";
import { ErgoSection } from "@/components/ergohub/case-section";
import { code } from "@/lib/rich-text";

const rows = ["reach", "probes", "memory", "names"] as const;

export function Challenges() {
  const t = useTranslations("ergohubPage.challenges");

  return (
    <ErgoSection id="challenges">
      <p className={lead}>{t("lead")}</p>

      <ul className="mt-10 border-t border-border md:mt-12">
        {rows.map((key) => (
          <li
            key={key}
            className="grid gap-y-1.5 border-b border-border py-5 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-x-10"
          >
            <h3 className={subhead}>{t(`rows.${key}.title`)}</h3>
            <p className={`${itemBody} max-w-[620px]`}>{t.rich(`rows.${key}.body`, { code })}</p>
          </li>
        ))}
      </ul>
    </ErgoSection>
  );
}
