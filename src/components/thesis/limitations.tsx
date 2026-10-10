import { useTranslations } from "next-intl";
import { CaseSection, itemBody, lead, subhead } from "@/components/thesis/case-section";
import { nb } from "@/lib/rich-text";

const items = ["simulated", "policy", "usability", "erasure", "inputs"] as const;

export function Limitations() {
  const t = useTranslations("thesisPage.limitations");

  return (
    <CaseSection id="limitations">
      <ul className="border-t border-border">
        {items.map((key) => (
          <li
            key={key}
            className="grid gap-y-1.5 border-b border-border py-5 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-x-10"
          >
            <h3 className={subhead}>{t(`items.${key}.title`)}</h3>
            <p className={`${itemBody} max-w-[620px]`}>{t.rich(`items.${key}.body`, { nb })}</p>
          </li>
        ))}
      </ul>

      <p className={`${lead} mt-10 md:mt-12`}>{t("closing")}</p>
    </CaseSection>
  );
}
